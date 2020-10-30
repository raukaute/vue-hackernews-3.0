const fs = require('fs'),
  path = require('path'),
  resolve = (file) => path.resolve(__dirname, file);

const express = require('express'),
  favicon = require('serve-favicon'),
  app = express();

const serialize = require('serialize-javascript');
const { createBundleRenderer } = require('vue-bundle-renderer');

const isProd = process.env.NODE_ENV === 'production';

function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      runInNewContext: false,
      vueServerRenderer: require('@vue/server-renderer'),
      basedir: resolve('./dist'),
      publicPath: '/dist/',
    })
  );
}

let renderer, readyPromise;

if (isProd) {
  const bundle = require('./dist/vue-ssr-server-bundle.json'),
    clientManifest = require('./dist/vue-ssr-client-manifest.json');

  renderer = createRenderer(bundle, { clientManifest });
} else {
  readyPromise = require('./build/setup-dev-server')(app, (bundle, options) => {
    renderer = createRenderer(bundle, options);
  });
}

const serve = (path, cache) =>
  express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0,
  });

app.use(favicon('./src/assets/logo-48.png'));
app.use('/dist', serve('./dist', true));

async function render(req, res) {
  const handleError = (err) => {
    res.status(500).send('500 | Internal Server Error');
    console.error(`error during render : ${req.url}`);
    console.error(err);
  };

  const renderState = (context) => {
    const contextKey = 'state';
    const windowKey = '__INITIAL_STATE__';
    const state = serialize(context[contextKey]);
    const autoRemove =
      ';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());';
    var nonceAttr = context.nonce ? ' nonce="' + context.nonce + '"' : '';
    return context[contextKey]
      ? '<script' +
          nonceAttr +
          '>window.' +
          windowKey +
          '=' +
          state +
          autoRemove +
          '</script>'
      : '';
  };

  const context = {
    url: req.url,
  };

  let page;
  try {
    page = await renderer.renderToString(context);
  } catch (err) {
    handleError(err);
  }
  let { renderStyles, renderResourceHints, renderScripts } = context;

  // TODO: Use loadash template
  const html = `
        <!DOCTYPE html>
            <html lang="en">
              <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              ${renderResourceHints()}
              ${renderStyles()}
              <title>SSR Vue 3</title>
              </head>
              <body>
                <div id="app">${page}</div>
                ${renderScripts()}
                ${renderState(context)}
                </body>
            </html>
        `;

  // print page to file for inspection
  if (!isProd) {
    fs.writeFile('rendered.html', html, (err) => {
      if (err) {
        throw err;
      }
    });
  }
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}

app.get(
  '*',
  isProd
    ? render
    : async (req, res) => {
        await readyPromise;

        render(req, res);
      }
);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
