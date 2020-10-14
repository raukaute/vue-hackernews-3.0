const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('./webpack.base.config');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = (env = {}) =>
  merge(base(env), {
    entry: './src/server-entry.js',
    output: {
      filename: 'server-bundle.js',
      libraryTarget: 'commonjs2',
    },
    externals: nodeExternals({
      // do not externalize CSS files in case we need to import it from a dep
      allowlist: /\.css$/,
    }),
    plugins: [new VueSSRServerPlugin()],
  });
