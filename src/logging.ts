'use strict';

import * as chalk from "chalk";

const isDebug = process.env.version_checker_is_debug === 'yes';

export const log = {
  info: console.log.bind(console),
  warning: console.error.bind(console, chalk.bold.yellow.bold('version-checker warn:')),
  warn: console.error.bind(console, chalk.bold.magenta.bold('version-checker warn:')),
  error: console.error.bind(console, chalk.redBright.bold('version-checker error:')),
  debug (...args: any[]) {
    isDebug && console.log(chalk.yellow.bold('version-checker debug:'), ...arguments);
  }
};

export default log;
