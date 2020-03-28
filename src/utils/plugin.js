/**
 * 专门负责处理小函数以及vue中常用的过滤器及函数
 */

export default {
  // 导出一个对象
  install (Vue) {
    // 该方法会在Vue.use时调用
    // 给vue的原型属性赋值一个函数  自定义一个函数名znotify
    // duration: 800, ...params之所以是这个顺序是因为如果传过来的params中带有时间参数，可以覆盖前面的800毫秒
    Vue.prototype.$znotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    // 给Vue的原型属性赋值一个函数   自定义一个函数名
    Vue.prototype.$sleep = sleep // 定义一个原型属性  $sleep所有组件都有了这个属性
  }
}

// 休眠函数
// time=500  如果传入了  就用传入的  没有传入就用500
function sleep (time = 500) {
  // 返回一个promise
  return new Promise(function (resolve, reject) {
    // 成功执行  但是有一个延迟
    setTimeout(() => resolve(), time)
  })
}
