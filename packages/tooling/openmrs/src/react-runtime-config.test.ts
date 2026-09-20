import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolve } from 'node:path';
import rspackConfig from '@openmrs/rspack-config';
import webpackConfig from '@openmrs/webpack-config';

const loginAppDir = resolve(import.meta.dirname, '../../../apps/esm-login-app');
const reactSubpaths = ['react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom/client'];

afterEach(() => {
  vi.restoreAllMocks();
});

describe.each([
  ['Rspack', rspackConfig, ['options']],
  ['Webpack', webpackConfig, ['use', 'options']],
])('%s React runtime config', (_name, makeConfig, optionsPath) => {
  it.each([
    ['development', true],
    ['production', false],
  ])('uses the automatic transform in %s mode', (mode, development) => {
    vi.spyOn(process, 'cwd').mockReturnValue(loginAppDir);

    const config = makeConfig({}, { mode });
    const scriptRule = config.module.rules[0];

    expect(scriptRule).toHaveProperty([...optionsPath, 'jsc', 'transform', 'react'], {
      runtime: 'automatic',
      development,
    });
  });

  it('shares the React runtime entry points as singletons', () => {
    vi.spyOn(process, 'cwd').mockReturnValue(loginAppDir);

    const config = makeConfig({}, { mode: 'production' });
    const federationPlugin = config.plugins?.find((plugin) => plugin?.constructor.name === 'ModuleFederationPlugin');

    for (const subpath of reactSubpaths) {
      expect(federationPlugin).toHaveProperty(['_options', 'shared', subpath], {
        requiredVersion: '18.x',
        strictVersion: false,
        singleton: true,
        import: subpath,
        shareKey: subpath,
        shareScope: 'default',
        version: '18.3.1',
      });
    }
  });
});
