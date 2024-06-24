import express from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';
import { logInfo, logWarn } from '../utils';

interface Config {
  [key: string]: any;
}

interface MergeConfigArgs {
  directories: string[];
  output: string;
  port: number;
}

interface ConfigModule {
  configSchema: Config;
}

async function readConfigFile(filePath: string): Promise<Config | null> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const configFunction = new Function('exports', 'require', 'module', '__filename', '__dirname', data);
    const module: ConfigModule = { configSchema: {} };
    configFunction(module, require, module, filePath, path.dirname(filePath));
    return module.configSchema;
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
    const content = `import { validators, Type } from '@openmrs/esm-framework';

export const configSchema = ${JSON.stringify(config, null, 2)};
`;
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
        if (path.extname(file) === '.ts' || path.extname(file) === '.js') {
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

//server setup
const app = express();
app.use(express.json());

app.post('/merge-configs', async (req, res) => {
  const { directories, output } = req.body;

  if (!directories || !output) {
    return res.status(400).send('directories and output are required');
  }

  try {
    await packageConfigs(directories, output);
    res.status(200).send(`Merged configuration written to ${output}`);
  } catch (error) {
    logWarn(`Failed to package configs: ${error.message}`);
    res.status(500).send(`Failed to package configs: ${error.message}`);
  }
});

export function runMergeConfigServer(args: MergeConfigArgs) {
  const { directories, output, port } = args;

  app.post('/merge-configs', async (req, res) => {
    try {
      await packageConfigs(directories, output);
      res.status(200).send(`Merged configuration written to ${output}`);
    } catch (error) {
      logWarn(`Failed to package configs: ${error.message}`);
      res.status(500).send(`Failed to package configs: ${error.message}`);
    }
  });

  app.listen(port, () => {
    logInfo(`Server is running on port ${port}`);
  });
}
