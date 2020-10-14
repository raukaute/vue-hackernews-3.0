const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('./webpack.base.config');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

module.exports = (env = {}) =>
  merge(base(env), {
    entry: {
      app: './src/client-entry.js',
    },

    plugins: [
      // strip dev-only code in Vue source

      // extract vendor chunks for better caching

      // extract webpack runtime & manifest to avoid vendor chunk hash changing
      // on every build.

      new VueSSRClientPlugin(),
    ],
  });
