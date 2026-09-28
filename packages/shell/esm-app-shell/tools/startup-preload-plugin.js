const HtmlWebpackPlugin = require('html-webpack-plugin');

const pluginName = 'StartupPreloadPlugin';

/**
 * Adds `<link rel="preload">` tags to the generated HTML for the chunks the app shell always loads while
 * starting up, so the browser fetches them alongside the entry script instead of only once it has run.
 *
 * Preloaded are the files of each named chunk group (named with `webpackChunkName`) and of the
 * shared-module fallbacks those groups consume. Their other lazy children, like the per-locale
 * translations, still load on demand.
 */
class StartupPreloadPlugin {
  /**
   * @param {Array<string>} chunkGroupNames Names of the chunk groups loaded on every startup
   */
  constructor(chunkGroupNames) {
    this.chunkGroupNames = chunkGroupNames;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tap(pluginName, (data) => {
        const files = new Set();
        for (const name of this.chunkGroupNames) {
          const group = compilation.namedChunkGroups.get(name);
          if (!group) {
            throw new Error(`${pluginName}: no chunk group is named "${name}"`);
          }

          for (const g of [group, ...group.childrenIterable.filter(isConsumeSharedGroup)]) {
            g.getFiles().forEach((file) => files.add(file));
          }
        }

        const preloads = [...files]
          .filter((file) => file.endsWith('.js') || file.endsWith('.css'))
          .map((file) =>
            HtmlWebpackPlugin.createHtmlTagObject('link', {
              rel: 'preload',
              href: data.publicPath + file,
              as: file.endsWith('.css') ? 'style' : 'script',
            }),
          );
        data.headTags.push(...preloads);
        return data;
      });
    });
  }
}

function isConsumeSharedGroup(group) {
  return group.origins.some((origin) => origin.module?.identifier().startsWith('consume shared module'));
}

module.exports = { StartupPreloadPlugin };
