const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  mode: "development",
  context: __dirname,
  devtool: "source-map",
  devServer: {
    contentBase: "./public"
  },
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js"
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  plugins: [
    // Uncomment for minification:
    // new UglifyJSPlugin({
    //   sourceMap: true
    // })
  ]
};
