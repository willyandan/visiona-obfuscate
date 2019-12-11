const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const dist = path.join(__dirname,"./dist")

module.exports = {
  entry: {
    "bundle": path.join(__dirname,"./src/home.js"),
  },
  target:'node',
  devtool: "source-map",
  output: {
    path: dist,
    filename: "[name].js"
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_fnames: false,
        },
      }),
    ],
  },
};