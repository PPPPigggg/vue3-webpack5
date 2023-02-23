module.exports = {
  '/api': {
    // 匹配路径
    target: 'http://localhost:3000', // 目标路径
    pathRewrite: { '^/api': '' } // 重写路径
  }
}
