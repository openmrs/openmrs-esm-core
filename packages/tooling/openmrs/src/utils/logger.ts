/* eslint-disable no-console */
import chalk from 'chalk';

export function logInfo(message: string) {
  console.log(`${chalk.green.bold('[openmrs]')} ${message}`);
}

export function logWarn(message: string) {
  console.warn(`${chalk.yellow.bold('[openmrs]')} ${chalk.yellow(message)}`);
}

export function logFail(message: string) {
  console.error(`${chalk.red.bold('[openmrs]')} ${chalk.red(message)}`);
}
