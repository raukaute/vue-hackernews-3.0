'use strict';

/* */

const path = require('path');
const MFS = require('memory-fs');
const webpack = require('webpack');
const clientConfig = require('./webpack.client.config')();
const serverConfig = require('./webpack.server.config')();

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8');
  } catch (e) {}
};

module.exports = function setupDevServer(app, cb) {
  let bundle, clientManifest, ready;

  const readyPromise = new Promise((r) => {
      ready = r;
    }),
    update = () => {
      if (bundle && clientManifest) {
        ready();
        cb(bundle, { clientManifest });
      }
    };

  clientConfig.entry.app = [
    'webpack-hot-middleware/client',
    clientConfig.entry.app,
  ];
  clientConfig.output.filename = '[name].js';
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  const clientCompiler = webpack(clientConfig);
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: '/dist/',
    stats: {
      colors: true,
      chunks: false,
    },
  });

  app.use(devMiddleware);

  clientCompiler.hooks.done.tap('stats', (stats) => {
    stats = stats.toJson();
    stats.errors.forEach((err) => console.error(err));
    stats.warnings.forEach((err) => console.warn(err));
    if (stats.errors.length) return;
    clientManifest = JSON.parse(
      readFile(devMiddleware.fileSystem, 'vue-ssr-client-manifest.json')
    );
    update();
  });

  app.use(
    require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 })
  );

  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    if (stats.errors.length) return;

    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));
    update();
  });

  return readyPromise;
};
