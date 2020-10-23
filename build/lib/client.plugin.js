'use strict';

/* */

Object.defineProperty(exports, '__esModule', { value: true });
const { Compilation } = require('webpack');
const hash = require('hash-sum');
const uniq = require('lodash.uniq');

const isJS = (file) => /\.js(\?[^.]+)?$/.test(file),
  isCSS = (file) => /\.css(\?[^.]+)?$/.test(file);

class VueSSRClientPlugin {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        filename: 'vue-ssr-client-manifest.json',
      },
      options
    );
  }

  apply(compiler) {
    var this$1 = this;
    // Hook into compiler right before compilation is sealed so we get full stats object
    compiler.hooks.make.tap('vue-client-plugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'generate-client-manifest',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          const stats = compilation.getStats().toJson(),
            allFiles = uniq(stats.assets.map((a) => a.name)),
            initialFiles = uniq(
              Object.keys(stats.entrypoints)
                .map((name) => stats.entrypoints[name].assets)
                .reduce((assets, all) => {
                  return all.concat(assets);
                }, [])
                .filter(({ name }) => isJS(name) || isCSS(name))
                .map(({ name }) => name)
            ),
            asyncFiles = allFiles
              .filter((file) => isJS(file) || isCSS(file))
              .filter((file) => initialFiles.indexOf(file) < 0),
            manifest = {
              publicPath: stats.publicPath,
              all: allFiles,
              initial: initialFiles,
              async: asyncFiles,
              modules: {
                /* [identifier: string]: Array<index: number> */
              },
            },
            assetModules = stats.modules.filter((m) => m.assets.length),
            fileToIndex = (file) => manifest.all.indexOf(file);

          stats.modules.forEach((m) => {
            if (m.chunks.length === 1) {
              let cid = m.chunks[0];
              let chunk = stats.chunks.find((c) => c.id === cid);

              if (!chunk || !chunk.files) {
                return;
              }
              const id = m.identifier.replace(/\|.*/, '').split('!').pop(); /* use only 'base' filepath */
              let files = (manifest.modules[hash(id)] = chunk.files.map(
                fileToIndex
              ));

              assetModules.forEach((m) => {
                if (m.chunks.some((id) => id === cid)) {
                  files.push.apply(files, m.assets.map(fileToIndex));
                }
              });
            }
          });
          const json = JSON.stringify(manifest, null, 2);
          compilation.assets[this$1.options.filename] = {
            source: function() {
              return json;
            },
            size: function() {
              return json.length;
            },
          };
        }
      );
    });
  }
}

exports.VueSSRClientPlugin = VueSSRClientPlugin;
