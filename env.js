/* 注入环境变量 */
/* 配置读取环境变量文件路径 加载.env*文件  默认加载.env文件*/
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
const dotenv = require("dotenv");

const { parsed } = dotenv.config({
  path: fs.existsSync(envPath)
    ? envPath
    : path.resolve(path.resolve(__dirname, ".env")),
});

// 定义规则：MY_VUE_ENV_开头的环境变量会被注入前端
// 可以在浏览器中通过process.env.MY_VUE_ENV_XXX取到
const MY_VUE_ENV_ = /^MY_VUE_ENV_/i;

// 使用插件的设置值
function getClientEnv() {
  return Object.keys(parsed).filter((key) => MY_VUE_ENV_.test(key));
}
module.exports = getClientEnv;

// function getClientEnvironment() {
//   // 取所有的环境变量，然后过滤出以MY_VUE_ENV_开头的环境变量
//   // 返回一个环境变量配置对象，提供给webpack InterpolateHtmlPlugin插件
//   const raw = Object.keys(process.env)
//     .filter((key) => MY_VUE_ENV_.test(key))
//     .reduce(
//       (env, key) => {
//         env[key] = process.env[key];
//         return env;
//       },
//       {
//         // 合并自定义的前端环境变量
//         // NODE_ENV已经默认注入了，这里不处理
//         // NODE_ENV: process.env.NODE_ENV || 'development'
//       }
//     );

//   // 字符串形式的process.env  提供给webpack DefinePlugin使用
//   const stringified = {
//     "process.env": Object.keys(raw).reduce((env, key) => {
//       env[key] = JSON.stringify(raw[key]);
//       return env;
//     }, {}),
//   };

//   return stringified;
// }

// module.exports = getClientEnvironment;
