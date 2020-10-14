const webpack = require('webpack');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader-v16');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env = {}) => ({
  mode: env.prod ? 'production' : 'development',
  // devtool: env.prod ? 'source-map' : 'eval-cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: env.prod ? '[name].[chunkhash].js' : '[name].js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // FROM THE OFFICIAL DOCS
      // this isn't technically needed, since the default `vue` entry for bundlers
      // is a simple `export * from '@vue/runtime-dom`. However having this
      // extra re-export somehow causes webpack to always invalidate the module
      // on the first HMR update and causes the page to reload.
      vue: '@vue/runtime-dom',
    },
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            envName: env.prod ? 'prod' : 'dev' 
          }
        }
      },
      {
        test: /\.vue$/,
        use: {
          loader: require.resolve('vue-loader-v16'),
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
         
        use: 
           [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !env.prod
              }
            }, 
            'css-loader', 'postcss-loader', 'sass-loader'
          ]
          
      },
      { 
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i
        ,
        use: {
          loader: 'url-loader',
          options: { limit: 8192 },
        },
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new VueLoaderPlugin(),
    new ESLintPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false'
    })
  ],
});
