import * as fs from 'fs/promises';
import * as path from 'path';
import { logInfo, logWarn } from '../utils';

interface Config {
  [key: string]: any;
}

export interface MergeArgs {
  directoriesPath: string;
  outputPath: string;
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

async function packageConfigs(configDirs: string, outputFilePath: string): Promise<void> {
  const configs: (Config | null)[] = [];
    try {
      const files = await fs.readdir(configDirs);
      for (const file of files) {
        const filePath = path.join(configDirs, file);
        if (path.extname(file) === '.json') {
          const config = await readConfigFile(filePath);
          configs.push(config);
        }
      }
    } catch (error) {
      logWarn(`Error reading directory ${configDirs}: ${error.message}`);
    }

    const mergedConfig = mergeConfigs(configs.filter(Boolean) as Config[]);
    await writeConfigFile(outputFilePath, mergedConfig);
}


export function runMergeConfig(args: MergeArgs): Promise<void> {

  try {
    packageConfigs(args.directoriesPath, args.outputPath);
    logInfo(`Merged configuration written to ${args.outputPath}`);
  } catch (error) {
    logWarn(`Failed to package configs: ${error.message}`);
  }
  return Promise.resolve();
}
