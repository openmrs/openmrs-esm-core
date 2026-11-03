const HtmlWebpackPlugin = require('html-webpack-plugin');

const pluginName = 'StartupPreloadPlugin';

/**
 * Adds `<link rel="preload">` tags to the generated HTML for the chunks the app shell always loads while
 * starting up, so the browser fetches them alongside the entry script instead of only once it has run.
 *
 * Preloaded are the files of each named chunk group (named with `webpackChunkName`) and of the shared
 * modules those groups consume. The app shell provides each library it consumes, so a consumed module is
 * preloaded from the app shell's provided copy, which is what loads at startup, not the fallback chunk
 * the consume would otherwise use. Other lazy children, like the per-locale translations, still load on
 * demand.
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
        const providedGroups = new Map();
        for (const group of compilation.chunkGroups) {
          const shareKey = getShareKey(group, 'provide');
          if (shareKey) {
            providedGroups.set(shareKey, group);
          }
        }

        const files = new Set();
        for (const name of this.chunkGroupNames) {
          const group = compilation.namedChunkGroups.get(name);
          if (!group) {
            throw new Error(`${pluginName}: no chunk group is named "${name}"`);
          }

          const consumedGroups = group.childrenIterable.flatMap((child) => {
            const shareKey = getShareKey(child, 'consume');
            return shareKey ? [providedGroups.get(shareKey) ?? child] : [];
          });

          for (const g of [group, ...consumedGroups]) {
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

/**
 * Returns the share key of the shared module a chunk group was created for, or `undefined` if it wasn't
 * created for one of the given kind. Module Federation identifies these modules as, e.g.,
 * `consume shared module (default) swr/infinite@2.5.1 (strict) ...`.
 *
 * @param {'consume' | 'provide'} kind
 */
function getShareKey(group, kind) {
  const prefix = `${kind} shared module (`;
  for (const origin of group.origins) {
    const identifier = origin.module?.identifier();
    if (identifier?.startsWith(prefix)) {
      return identifier.match(/^\w+ shared module \([^)]*\) (.+?)@/)?.[1];
    }
  }
}

module.exports = { StartupPreloadPlugin };
