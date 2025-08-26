#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

program
  .name("cpm")
  .description("Class Package Manager (CPM) – Manage sharable classes/components")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize a new CPM package")
  .action(() => {
    console.log(chalk.green("✅ CPM package initialized!"));
  });

program
  .command("install <package>")
  .description("Install a CPM package")
  .action((pkg) => {
    console.log(chalk.blue(`📦 Installing ${pkg}...`));
  });

program.parse(process.argv);
