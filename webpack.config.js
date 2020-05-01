const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/embed.js',
  output: {
    filename: 'ckan-embed.bundle.js',
    library: 'CKANembed'
  },
  node: {
    fs: 'empty'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin()
    ]
  }
};
