'use strict';

/* */

var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const { Compilation } = require('webpack');
const fs = require('fs');
const isJS = (file) => /\.js(\?[^.]+)?$/.test(file);

class VueSSRServerPlugin {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        filename: 'vue-ssr-server-bundle.json',
      },
      options
    );
  }
  apply(compiler) {
    let this$1 = this;
    // Hook into compiler right before compilation is sealed so we get full stats object
    compiler.hooks.make.tap(
      'vue-server-plugin',
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'generate-server-bundle',
            stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
          },
          () => {
            const stats = compilation.getStats().toJson(),
              entryName = Object.keys(stats.entrypoints)[0],
              entryInfo = stats.entrypoints[entryName];

            if (!entryInfo) {
              return cb();
            }

            const entryAssets = entryInfo.assets
              .map(({ name }) => name)
              .filter(isJS);

            if (entryAssets.length > 1) {
              throw new Error(
                'Server-side bundle should have one single entry file. ' +
                  'Avoid using optimization.splitChunks in the server config.'
              );
            }

            const entry = entryAssets[0];
            if (!entry || typeof entry !== 'string') {
              throw new Error(
                'Entry "' +
                  entryName +
                  '" not found. Did you specify the correct entry option?'
              );
            }

            const bundle = {
              entry: entry,
              files: {},
              maps: {},
            };

            stats.assets.forEach((asset) => {
              if (isJS(asset.name)) {
                bundle.files[asset.name] = compilation.assets[
                  asset.name
                ].source();
              } else if (asset.name.match(/\.js\.map$/)) {
                bundle.maps[asset.name.replace(/\.map$/, '')] = JSON.parse(
                  compilation.assets[asset.name].source()
                );
              }

              delete compilation.assets[asset.name];
            });

            const json = JSON.stringify(bundle, null, 2);

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
      }
    );
  }
}

exports.VueSSRServerPlugin = VueSSRServerPlugin;
