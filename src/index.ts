#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import inquirer from "inquirer";

const program = new Command();

program
    .name("cpm")
    .description("Class Package Manager (CPM) – Manage sharable classes/components")
    .version("1.0.0");

const submissionsPath = path.join(process.env.USERPROFILE || process.env.HOME!, ".cpm_submissions");
fs.ensureDirSync(submissionsPath);

const getCpmJson = () => {
    const cpmJsonPath = path.join(process.cwd(), ".cpm", "cpm.json");
    if (!fs.existsSync(cpmJsonPath)) return { packages: {} };
    return fs.readJsonSync(cpmJsonPath);
};

const saveCpmJson = (data: any) => {
    const cpmJsonPath = path.join(process.cwd(), ".cpm", "cpm.json");
    fs.ensureDirSync(path.dirname(cpmJsonPath));
    fs.writeJsonSync(cpmJsonPath, data, { spaces: 2 });
};

// ---------- Commands ---------- //

// Init project
program
    .command("init")
    .description("Initialize a new CPM project")
    .action(() => {
        const cpmDir = path.join(process.cwd(), ".cpm");
        fs.ensureDirSync(cpmDir);
        saveCpmJson({ packages: {} });
        console.log(chalk.green("✅ CPM project initialized!"));
    });

// Publish package (staging)
program
    .command("publish <packagePath>")
    .description("Submit a package for CPM central repository")
    .action((packagePath) => {
        const absPath = path.resolve(packagePath);

        if (!fs.existsSync(absPath)) {
            console.error(chalk.red("❌ Package path does not exist"));
            process.exit(1);
        }

        const pkgJsonPath = path.join(absPath, "package.json");
        if (!fs.existsSync(pkgJsonPath)) {
            console.error(chalk.red("❌ package.json not found in package"));
            process.exit(1);
        }

        const pkg = fs.readJsonSync(pkgJsonPath);
        if (!pkg.name || !pkg.version) {
            console.error(chalk.red("❌ package.json must contain 'name' and 'version'"));
            process.exit(1);
        }

        const dest = path.join(submissionsPath, `${pkg.name}@${pkg.version}`);
        fs.copySync(absPath, dest, { overwrite: true });

        console.log(chalk.green(`✅ Package ${pkg.name}@${pkg.version} staged for review.`));
        console.log(chalk.yellow("⚠ Only CPM maintainers can publish it to the central repository."));
    });

// Interactive review & approve
program
    .command("review")
    .description("Interactive review of staged packages")
    .action(async () => {
        const submissions = fs.readdirSync(submissionsPath);
        if (submissions.length === 0) {
            console.log(chalk.yellow("No staged packages for review."));
            return;
        }

        const { selected } = await inquirer.prompt([
            {
                type: "checkbox",
                name: "selected",
                message: "Select packages to approve and publish:",
                choices: submissions
            }
        ]);

        if (selected.length === 0) {
            console.log(chalk.yellow("No packages selected."));
            return;
        }

        for (const pkgFolder of selected) {
            const pkgPath = path.join(submissionsPath, pkgFolder);
            try {
                console.log(chalk.blue(`📦 Publishing ${pkgFolder} to npm...`));
                execSync(`npm publish "${pkgPath}" --access public`, { stdio: "inherit" });
                console.log(chalk.green(`✅ Successfully published ${pkgFolder} to npm!`));
                fs.removeSync(pkgPath);
            } catch (err: any) {
                console.error(chalk.red(`❌ Failed to publish ${pkgFolder}:`), err.message);
            }
        }
    });

// Search for packages (npm)
program
    .command("search <term>")
    .description("Search npm for CPM packages matching a term")
    .action((term) => {
        try {
            console.log(chalk.blue(`🔍 Searching npm for packages matching "${term}"...`));
            execSync(`npm search ${term}`, { stdio: "inherit" });
        } catch (err: any) {
            console.error(chalk.red("❌ Search failed:"), err.message);
            process.exit(1);
        }
    });

// Install package (from npm)
program
    .command("install <packageName>")
    .description("Install a CPM package (from npm)")
    .action((packageName) => {
        try {
            console.log(chalk.blue(`📦 Installing ${packageName} from npm...`));
            execSync(`npm pack ${packageName}`, { stdio: "inherit" });

            const tarball = fs.readdirSync(process.cwd()).find(f => f.startsWith(packageName) && f.endsWith(".tgz"));
            if (!tarball) throw new Error("Package tarball not found after npm pack");

            const destDir = path.join(process.cwd(), ".cpm");
            fs.ensureDirSync(destDir);
            execSync(`tar -xzf "${tarball}" -C "${destDir}"`);
            fs.removeSync(tarball);

            const cpmData = getCpmJson();
            cpmData.packages[packageName] = { path: path.join(destDir, "package") };
            saveCpmJson(cpmData);

            console.log(chalk.green(`✅ Installed ${packageName} to project`));
        } catch (err: any) {
            console.error(chalk.red("❌ Failed to install package:"), err.message);
            process.exit(1);
        }
    });

// List installed packages
program
    .command("list")
    .description("List installed CPM packages")
    .action(() => {
        const cpmData = getCpmJson();
        const pkgs = Object.keys(cpmData.packages);
        if (pkgs.length === 0) {
            console.log(chalk.yellow("No packages installed."));
            return;
        }

        console.log(chalk.blue("Installed packages:"));
        pkgs.forEach(p => console.log(" -", p));
    });

// Uninstall package
program
    .command("uninstall <packageName>")
    .description("Uninstall a CPM package")
    .action((packageName) => {
        const cpmData = getCpmJson();
        if (!cpmData.packages[packageName]) {
            console.error(chalk.red(`❌ Package ${packageName} not found in project`));
            process.exit(1);
        }

        fs.removeSync(cpmData.packages[packageName].path);
        delete cpmData.packages[packageName];
        saveCpmJson(cpmData);

        console.log(chalk.green(`✅ Uninstalled ${packageName}`));
    });

program.parse(process.argv);
