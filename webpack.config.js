const path = require('path');
const webpack = require('webpack');


module.exports = {
  mode: 'development', // Set the mode to development
  entry: './test.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'tests-for-browser.js',
  },
  target: 'web', // Specify the target environment as web browser
  watch: true, // Enable watch mode
};