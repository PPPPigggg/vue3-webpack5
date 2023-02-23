const { merge } = require("webpack-merge");

const ESLintPlugin = require("eslint-webpack-plugin");

const common = require("./webpack.common.js");

const proxy = require("./proxy.config.js");

/**
 * @type {import('webpack').Configuration}
 */
module.exports = merge(common, {
  mode: "development",
  //  'development' or 'production'
  // publicPath: '/',
  devtool: "eval-cheap-module-source-map",
  devServer: {
    open: true,
    port: 8080, // 指定端口号
    proxy,
  },
  cache: {
    type: "filesystem",
  },
  plugins: [new ESLintPlugin({ extensions: ["js", "ts", "vue"] })],
});
