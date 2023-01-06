#!/usr/bin/env node
/* eslint-env es6 */
const yargs = require("yargs")
  .usage(
    `
Usage: $0 [-config config_filename]
		
Export l10n file from csv or google spered sheet.
If it read from google spread sheet, you need credential setting.
`
  )
  .options({
    config: {
      default: "l10n-dart.config.js",
    },
  })
  .describe({
    config: "setting config file",
  })
  .help()
  .alias("h", "help");

const argv = yargs.argv;

yargs.showHelp();
