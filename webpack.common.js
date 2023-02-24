const path = require("path");

const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin, EnvironmentPlugin } = require("webpack");
// 此插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// const getClientEnvironment = require("./env");
const getClientEnv = require("./env");

const devMode = process.env.NODE_ENV !== "production";

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  //  'development' or 'production'
  entry: "./src/index.ts",
  module: {
    rules: [
      // {
      //   test: /\.ts$/,
      //   exclude: /node_modules/,
      //   // 因为单文件组件被 vue-loader 解析成了三个部分，script 部分最终交由 ts-loader 来处理，但是 tsc 并不知道如何处理 .vue 结尾的文件为了解决这个问题，需要给 ts-loader 添加一个配置项
      //   use: [
      //     {
      //       loader: 'ts-loader',
      //       options: {
      //         appendTsSuffixTo: [/\.vue$/]
      //       }
      //     }
      //   ]
      // },

      /* 由于babel支持ts的转换所以弃用ts-loader */
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: [
          "thread-loader",
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      /* 样式支持 */
      {
        test: /\.(c|le)ss$/i,
        exclude: /node_modules/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env"]],
              },
            },
          },
          "less-loader",
        ],
        generator: {
          // 图片生成到images目录
          filename: "style/[name]-[hash][ext]",
        },
      },
      /* 处理静态资源========start */
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        type: "asset",
        generator: {
          // 图片生成到images目录
          filename: "images/[name]-[hash][ext]",
        },
      },
      {
        test: /\.(eot|svg|ttf|woff2?|)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name]-[hash][ext]",
        },
      },
      /* 处理静态资源========end */
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "myVue3",
      template: "./index.html",
    }),

    new VueLoaderPlugin(),

    /**
     * 把环境变量注入浏览器
     * 使用时需要把名字写全如“process.env.MY_VUE_ENV_TEST”
     */
    new EnvironmentPlugin([...getClientEnv()]),
    new DefinePlugin({
      /* 解决vue在控制台的警告 */
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      /* 把环境变量注入浏览器 */
      // ...getClientEnvironment(),
    }),
  ],
  // 简化控制台信息
  stats: "errors-only",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
};
