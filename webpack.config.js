var path = require('path');

var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BellOnBundlerErrorPlugin = require('bell-on-bundler-error-plugin');
var FixDefaultImportPlugin = require('webpack-fix-default-import-plugin');

var cssLoader =  ExtractTextPlugin.extract(['css-loader?sourceMap', 'postcss-loader?sourceMap']);
var lessLoader = ExtractTextPlugin.extract(['css-loader?sourceMap', 'postcss-loader?sourceMap', 'less-loader?sourceMap']);
var sassLoader = ExtractTextPlugin.extract(['css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap']);
var stylusLoader = ExtractTextPlugin.extract(['css-loader?sourceMap', 'postcss-loader?sourceMap', 'stylus-loader?sourceMap']);

// autoprefixer configuration based on Bootstrap 4.x defaults
var autoprefixerBrowsers = require('bootstrap/grunt/postcss').autoprefixer.browsers;

var config = {
  entry: {
    app: './src/index'
  },
  devServer: {
    disableHostCheck: true,
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js?[hash]',
    devtoolModuleFilenameTemplate: function (info) {
      var relPath = info.resourcePath
        .replace(/^.*(~|node_modules)/, '~')
        .replace(/^(webpack:\/\/\/)+/, '')
        .replace(/^\.\//, '')
        .replace(/^\(webpack\)-/, '(webpack)/')
        .replace(/^webpack\/bootstrap/, '(webpack)/bootstrap');
      return 'webpack:///' + relPath + '?' + info.hash;
    }
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js' ],
  },
  module: {
    /*
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: "pre"
        // include: path.resolve('node_modules')
      }
    ],
    */
    loaders: [
      {
        test: /\.js$/,
        loader: 'imports?this=>window',
        include: path.resolve('node_modules/foundation/js/foundation')
      },
      {
        test: /\.css$/,
        loader: cssLoader
      },
      {
        test: /\.less$/,
        loader: lessLoader
      },
      {
        test: /\.(scss|sass)$/,
        loader: sassLoader
      },
      {
        test: /\.styl$/,
        loader: stylusLoader
      },
      {
        test: /\.(png|jpg|woff|woff2|eot|ttf|svg)(\?.*)?$/,
        loader: 'file-loader?name=[path]/[name].[ext]?[hash]'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require('postcss-flexbugs-fixes'),
          require('autoprefixer')({ browsers: autoprefixerBrowsers })
        ]
      }
    }),
    new webpack.ProvidePlugin({
      'jQuery': 'jquery',         // for Bootstrap 3.x / 4.x
      'window.jQuery': 'jquery',  // for Bootstrap 3.x / 4.x
      'Tether': 'tether',         // for Bootstrap 4.x
      'window.Tether': 'tether'   // for Bootstrap 4.x
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'layout.html',
      template: 'src/layout.html'
    }),
    new FixDefaultImportPlugin(),
    new BellOnBundlerErrorPlugin()
  ],
};

var extractTextPlugin = new ExtractTextPlugin('[name].css?[hash]');

config.plugins.push(
  new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
    output: { comments: false }
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  extractTextPlugin
);

module.exports = config;
