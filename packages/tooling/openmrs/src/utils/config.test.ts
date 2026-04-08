import { describe, expect, it } from 'vitest';
import { loadBundlerConfig } from './config';

// loadBundlerConfig loads the real @openmrs/esm-app-shell webpack config
// (a workspace dependency) via require(). We don't mock it -- the value of
// these tests is verifying the env var mapping, not the webpack config itself.

describe('loadBundlerConfig', () => {
  it('sets OMRS_PROXY_TARGET when backend is provided', () => {
    loadBundlerConfig({ backend: 'https://example.com' });
    expect(process.env.OMRS_PROXY_TARGET).toBe('https://example.com');
  });

  it('sets OMRS_PUBLIC_PATH when spaPath is provided', () => {
    loadBundlerConfig({ spaPath: '/openmrs/spa/' });
    expect(process.env.OMRS_PUBLIC_PATH).toBe('/openmrs/spa/');
  });

  it('sets OMRS_API_URL when apiUrl is provided', () => {
    loadBundlerConfig({ apiUrl: '/openmrs/' });
    expect(process.env.OMRS_API_URL).toBe('/openmrs/');
  });

  it('sets OMRS_PAGE_TITLE when pageTitle is provided', () => {
    loadBundlerConfig({ pageTitle: 'My App' });
    expect(process.env.OMRS_PAGE_TITLE).toBe('My App');
  });

  it('sets OMRS_ADD_COOKIE when addCookie is provided', () => {
    loadBundlerConfig({ addCookie: 'session=abc' });
    expect(process.env.OMRS_ADD_COOKIE).toBe('session=abc');
  });

  it('sets OMRS_OFFLINE to "enable" when supportOffline is true', () => {
    loadBundlerConfig({ supportOffline: true });
    expect(process.env.OMRS_OFFLINE).toBe('enable');
  });

  it('sets OMRS_OFFLINE to "disable" when supportOffline is false', () => {
    loadBundlerConfig({ supportOffline: false });
    expect(process.env.OMRS_OFFLINE).toBe('disable');
  });

  it('sets OMRS_CONFIG_URLS to semicolon-joined string from configUrls', () => {
    loadBundlerConfig({ configUrls: ['https://a.com/config.json', 'https://b.com/config.json'] });
    expect(process.env.OMRS_CONFIG_URLS).toBe('https://a.com/config.json;https://b.com/config.json');
  });

  it('sets both OMRS_ENV and NODE_ENV when env is provided', () => {
    loadBundlerConfig({ env: 'production' });
    expect(process.env.OMRS_ENV).toBe('production');
    expect(process.env.NODE_ENV).toBe('production');
  });

  it('sets OMRS_ESM_DEFAULT_LOCALE when defaultLocale is provided', () => {
    loadBundlerConfig({ defaultLocale: 'en_GB' });
    expect(process.env.OMRS_ESM_DEFAULT_LOCALE).toBe('en_GB');
  });

  it('sets OMRS_ESM_IMPORTMAP for an inline importmap', () => {
    loadBundlerConfig({ importmap: { type: 'inline', value: '{"imports":{}}' } });
    expect(process.env.OMRS_ESM_IMPORTMAP).toBe('{"imports":{}}');
  });

  it('sets OMRS_ESM_IMPORTMAP_URL for a URL importmap', () => {
    loadBundlerConfig({ importmap: { type: 'url', value: 'https://example.com/importmap.json' } });
    expect(process.env.OMRS_ESM_IMPORTMAP_URL).toBe('https://example.com/importmap.json');
  });

  it('sets OMRS_ROUTES for inline routes', () => {
    loadBundlerConfig({ routes: { type: 'inline', value: '{}' } });
    expect(process.env.OMRS_ROUTES).toBe('{}');
  });

  it('sets OMRS_ROUTES_URL for URL routes', () => {
    loadBundlerConfig({ routes: { type: 'url', value: 'https://example.com/routes.json' } });
    expect(process.env.OMRS_ROUTES_URL).toBe('https://example.com/routes.json');
  });

  it('sets OMRS_ESM_CORE_APPS_DIR when coreAppsDir is provided', () => {
    loadBundlerConfig({ coreAppsDir: '/apps' });
    expect(process.env.OMRS_ESM_CORE_APPS_DIR).toBe('/apps');
  });

  it('sets OMRS_CLEAN_BEFORE_BUILD when fresh is provided', () => {
    loadBundlerConfig({ fresh: true });
    expect(process.env.OMRS_CLEAN_BEFORE_BUILD).toBe('true');
  });

  it('sets OMRS_JS_CSS_ASSETS to semicolon-joined string from assets', () => {
    loadBundlerConfig({ assets: ['/path/to/a.css', '/path/to/b.js'] });
    expect(process.env.OMRS_JS_CSS_ASSETS).toBe('/path/to/a.css;/path/to/b.js');
  });

  it('does not set env vars for absent options', () => {
    const envBefore = { ...process.env };
    loadBundlerConfig({});
    expect(process.env.OMRS_PROXY_TARGET).toBe(envBefore.OMRS_PROXY_TARGET);
  });
});
