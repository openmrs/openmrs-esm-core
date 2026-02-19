import type { StorybookConfig } from 'storybook-react-rsbuild';
import { mergeRsbuildConfig } from '@rsbuild/core';
import { pluginSass } from '@rsbuild/plugin-sass';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const frameworkRoot = path.resolve(__dirname, '../../../framework');
const mocksRoot = path.resolve(__dirname, '../mocks');

const config: StorybookConfig = {
  stories: [path.resolve(frameworkRoot, 'esm-styleguide/src/**/*.stories.@(ts|tsx)')],
  addons: ['@storybook/addon-links'],
  framework: 'storybook-react-rsbuild',
  rsbuildFinal: (config) => {
    return mergeRsbuildConfig(config, {
      plugins: [
        pluginSass({
          sassLoaderOptions: {
            api: 'modern-compiler',
            implementation: require.resolve('sass-embedded'),
            sassOptions: { quietDeps: true },
          },
        }),
      ],
      resolve: {
        alias: {
          // Replace framework peer dependency imports with Storybook-compatible mocks.
          // These mocks provide plain-function implementations (no vi.fn() / jest.fn())
          // that return sensible defaults.
          '@openmrs/esm-react-utils': path.resolve(mocksRoot, 'esm-react-utils.ts'),
          '@openmrs/esm-translations': path.resolve(mocksRoot, 'esm-translations.ts'),
          '@openmrs/esm-config': path.resolve(mocksRoot, 'esm-config.ts'),
          '@openmrs/esm-api': path.resolve(mocksRoot, 'esm-api.ts'),
          '@openmrs/esm-state': path.resolve(mocksRoot, 'esm-state.ts'),
          '@openmrs/esm-extensions': path.resolve(mocksRoot, 'esm-extensions.ts'),
          '@openmrs/esm-emr-api': path.resolve(mocksRoot, 'esm-emr-api.ts'),
          '@openmrs/esm-globals': path.resolve(mocksRoot, 'esm-globals.ts'),
          '@openmrs/esm-navigation': path.resolve(mocksRoot, 'esm-navigation.ts'),
          '@openmrs/esm-error-handling': path.resolve(mocksRoot, 'esm-error-handling.ts'),

          // Direct source-path aliases that bypass package.json exports
          // restrictions. Needed because mocks and preview setup import
          // specific source files from framework packages.
          '@openmrs/esm-translations/src/translations': path.resolve(
            frameworkRoot,
            'esm-translations/src/translations.ts',
          ),
          '@openmrs/esm-styleguide/src/icons/icon-registration': path.resolve(
            frameworkRoot,
            'esm-styleguide/src/icons/icon-registration.ts',
          ),
          '@openmrs/esm-styleguide/src/pictograms/pictogram-registration': path.resolve(
            frameworkRoot,
            'esm-styleguide/src/pictograms/pictogram-registration.ts',
          ),
          '@openmrs/esm-styleguide/src/empty-card/empty-card-registration': path.resolve(
            frameworkRoot,
            'esm-styleguide/src/empty-card/empty-card-registration.ts',
          ),
          '@openmrs/esm-styleguide/src/config-schema': path.resolve(
            frameworkRoot,
            'esm-styleguide/src/config-schema.ts',
          ),
        },
      },
      tools: {
        rspack: (rspackConfig) => {
          // SVG files should be loaded as raw strings (matching the styleguide's
          // rspack.config.cjs), so that icon-registration.ts can parse and inject
          // them into the SVG sprite container.
          rspackConfig.module ??= {};
          rspackConfig.module.rules ??= [];
          rspackConfig.module.rules.push({
            test: /\.svg$/,
            use: [require.resolve('svgo-loader')],
            type: 'asset/source',
          });
          return rspackConfig;
        },
      },
    });
  },
};

export default config;
