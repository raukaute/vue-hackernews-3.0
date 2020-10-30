'use strict';

/* */

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('./webpack.base.config');
const WorkBoxPlugin = require('workbox-webpack-plugin');
const { VueSSRClientPlugin } = require('./lib/client.plugin');

module.exports = (env = {}) =>
  merge(base(env), {
    entry: {
      app: './src/client-entry.js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    plugins: env.prod
      ? [
          new VueSSRClientPlugin(),
          new WorkBoxPlugin.GenerateSW({
            swDest: './service-worker.js',
            exclude: [/\.(?:png|jpg|jpeg|svg)$/],
            runtimeCaching: [
              {
                urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'images',
                  expiration: {
                    maxEntries: 10,
                  },
                },
              },
            ],
          }),
        ]
      : [new VueSSRClientPlugin()],
  });
