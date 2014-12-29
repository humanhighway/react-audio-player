webpack = require("webpack");
HtmlWebpackPlugin = require("html-webpack-plugin");

// IS_PRODUCTION = "production" === process.env.NODE_ENV;

webpackConfig = module.exports = {
  entry: ['./js/app', 'webpack/hot/dev-server'],
  // devtool: 'source-map',
  resolve: {
    alias: {
      "howler": "./../vendor/howler.min.js"
    },
    modulesDirectories: [ 'node_modules' ]
  },
  output: {
    path: '',
    publicPath: './',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.scss$/, loader: "style!css!sass" },
      // { test: /\.js(x?)$/, loaders: ['react-hot-loader', 'jsx-loader?harmony'] },
      { test: /\.js(x?)$/, loaders: ['jsx-loader?harmony'] }
    ]
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'index-template.html',
      filename: 'index.html'
    })
  ]
};
