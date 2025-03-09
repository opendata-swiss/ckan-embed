const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/embed.js',
  output: {
    filename: 'ckan-embed.bundle.js',
    library: 'CKANembed'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css"],
    fallback: {
      fs: false,
      zlib: false,
      path: false,
      http: false,
      https: false,
      crypto: false,
      querystring: false,
    },
    alias: { 
      "stream": require.resolve("stream-browserify") 
    }
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin()
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]
};
