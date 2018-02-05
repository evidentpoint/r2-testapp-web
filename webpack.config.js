module.exports = {
  context: __dirname,
  devtool: "inline-source-map",
  entry: "./build_temp/src/main.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
};