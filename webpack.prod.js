const path = require("path");
const glob = require("glob");

const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

const TerserPlugin = require("terser-webpack-plugin");
/* 配置静态目录就是不用打包的目录，相当于直接复制目录到dist文件夹下 */
const CopyWebpackPlugin = require("copy-webpack-plugin");
/* 压缩css */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");

/**
 * @type {import('webpack').Configuration}
 */
module.exports = merge(common, {
  mode: "production",
  output: {
    clean: true,
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, { nodir: true }),
    }),
    new CopyWebpackPlugin({
      // from后的路径是相对于项目的根目录，to后的路径是相对于打包后的dist目录
      patterns: [{ from: "./public", to: "./public" }],
    }),
  ],
  optimization: {
    // 代码混淆压缩
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            /* 如需保留log可以使用window.console.log的方式 */
            drop_console: true, // 清除 console 语句默认为false
            drop_debugger: true, // 清除 debugger 语句默认为true
            pure_funcs: ["console.log"], // 移除console
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      // 选择对哪些文件进行拆分，默认是async，即只对动态导入的文件进行拆分
      chunks: "all",
      // 提取chunk的最小体积
      minSize: 20000,
      // 要提取的chunk最少被引用次数
      minChunks: 1,
      // 对要提取的trunk进行分组
      cacheGroups: {
        // 匹配node_modules中的三方库，将其打包成一个trunk
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: -10,
        },
        default: {
          // 将至少被两个trunk引入的模块提取出来打包成单独trunk
          minChunks: 2,
          name: "default",
          priority: -20,
        },
      },
    },
  },
});
