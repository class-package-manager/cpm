#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

const program = new Command();

program
  .name("cpm")
  .description("Class Package Manager (CPM) – Manage sharable classes/components")
  .version("1.0.0");

// Local registry folder (in user's home)
const registryPath = path.join(process.env.USERPROFILE || process.env.HOME!, ".cpm_registry");
fs.ensureDirSync(registryPath);

// Helper: get project cpm.json
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

// Publish package
program
  .command("publish <packagePath>")
  .description("Publish a local package to the CPM registry")
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

    const dest = path.join(registryPath, `${pkg.name}@${pkg.version}`);
    fs.copySync(absPath, dest, { overwrite: true });
    console.log(chalk.green(`✅ Published ${pkg.name}@${pkg.version} to local registry`));
  });

// Install package
program
  .command("install <packageName>")
  .description("Install a CPM package from the registry")
  .action((packageName) => {
    const allPackages = fs.readdirSync(registryPath);
    const pkgFolder = allPackages
      .filter(f => f.startsWith(packageName + "@"))
      .sort() // optional: sort for latest version
      .pop();

    if (!pkgFolder) {
      console.error(chalk.red(`❌ Package ${packageName} not found in registry`));
      process.exit(1);
    }

    const src = path.join(registryPath, pkgFolder);
    const dest = path.join(process.cwd(), ".cpm", pkgFolder);
    fs.ensureDirSync(path.dirname(dest));
    fs.copySync(src, dest, { overwrite: true });

    const cpmData = getCpmJson();
    cpmData.packages[pkgFolder] = { path: dest };
    saveCpmJson(cpmData);

    console.log(chalk.green(`✅ Installed ${pkgFolder} to project`));
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
    const pkgFolder = Object.keys(cpmData.packages).find(p => p.startsWith(packageName + "@"));
    if (!pkgFolder) {
      console.error(chalk.red(`❌ Package ${packageName} not found in project`));
      process.exit(1);
    }

    fs.removeSync(cpmData.packages[pkgFolder].path);
    delete cpmData.packages[pkgFolder];
    saveCpmJson(cpmData);

    console.log(chalk.green(`✅ Uninstalled ${pkgFolder}`));
  });

program.parse(process.argv);
