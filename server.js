const path = require('path'),
  resolve = (file) => path.resolve(__dirname, file);

const express = require('express'),
  app = express();

const { createBundleRenderer } = require('vue-bundle-renderer');

const isProd = false;

function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      runInNewContext: false,
      vueServerRenderer: require('@vue/server-renderer'),
      basedir: resolve('./dist'),
      publicPath: '/dist/'
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

app.use('/dist', serve('./dist', false));

async function render(req, res) {
  res.setHeader('Content-Type', 'text/html');

  const handleError = (err) => {
    res.status(500).send('500 | Internal Server Error');
    console.error(`error during render : ${req.url}`);
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
  // Use loadash template
  const html = `
        <!DOCTYPE html>
            <html>
              <head> 
                <title>SSR Vue 3</title>
                ${renderResourceHints()}
                ${renderStyles()}
              </head>
              <body>
                <div id="app">${page}</div>
                ${renderScripts()}
                </body>
            </html>
        `;

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
