// 专门处理postcss文件
module.exports = {
  plugins: {
    // 自动给css样式加前缀属性displa:flex
    autoprefixer: {},
    'postcss-pxtorem': {
      // 基准值：使用的ipone6  370/10
      rootValue: 37.5,
      // 包含哪些文件   所有的文件
      propList: ['*']
    }
  }

}
