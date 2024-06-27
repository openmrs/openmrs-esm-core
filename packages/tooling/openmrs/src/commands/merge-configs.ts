import * as fs from 'fs/promises';
import * as path from 'path';
import { logInfo, logWarn } from '../utils';

interface Config {
  [key: string]: any;
}

export interface MergeConfigArgs {
  directories: string[];
  output: string;
}

async function readConfigFile(filePath: string): Promise<Config | null> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logWarn(`Error reading or parsing file ${filePath}: ${error.message}`);
    return null;
  }
}

function mergeConfigs(configs: (Config | null)[]): Config {
  const mergedConfig: Config = {};

  configs.forEach((config) => {
    if (config === null) {
      return;
    }

    Object.keys(config).forEach((key) => {
      if (typeof config[key] === 'object' && !Array.isArray(config[key])) {
        mergedConfig[key] = { ...mergedConfig[key], ...config[key] };
      } else {
        mergedConfig[key] = config[key];
      }
    });
  });

  return mergedConfig;
}

async function writeConfigFile(filePath: string, config: Config): Promise<void> {
  try {
    const content = JSON.stringify(config, null, 2);
    await fs.writeFile(filePath, content, 'utf8');
    logInfo(`Merged configuration written to ${filePath}`);
  } catch (error) {
    logWarn(`Error writing to file ${filePath}: ${error.message}`);
  }
}

async function packageConfigs(configDirs: string[], outputFilePath: string): Promise<void> {
  const configs: (Config | null)[] = [];

  for (const dir of configDirs) {
    try {
      const files = await fs.readdir(dir);
      for (const file of files) {
        if (path.extname(file) === '.json') {
          const filePath = path.join(dir, file);
          const config = await readConfigFile(filePath);
          configs.push(config);
        }
      }
    } catch (error) {
      logWarn(`Error reading directory ${dir}: ${error.message}`);
    }
  }

  const mergedConfig = mergeConfigs(configs.filter(Boolean) as Config[]);
  await writeConfigFile(outputFilePath, mergedConfig);
}

export async function runMergeConfig(args: MergeConfigArgs) {
  const { directories, output } = args;

  try {
    await packageConfigs(directories, output);
    logInfo(`Merged configuration written to ${output}`);
  } catch (error) {
    logWarn(`Failed to package configs: ${error.message}`);
  }
}
