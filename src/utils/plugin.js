/**
 * 专门负责处理小函数以及vue中常用的过滤器及函数
 */

import dayjs from 'dayjs' // 引入dayjs插件
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间插件
import 'dayjs/locale/zh-cn' // 引入中文语言包   默认英文语言包
// 相当于dayjs的扩展   相对时间的方法   这个方法写完之后  dayjs就有了from方法
dayjs.extend(relativeTime)

export default {
  // 导出一个对象
  install (Vue) {
    // 该方法会在Vue.use时调用
    // 给vue的原型属性赋值一个函数  自定义一个函数名znotify
    // duration: 800, ...params之所以是这个顺序是因为如果传过来的params中带有时间参数，可以覆盖前面的800毫秒
    Vue.prototype.$znotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    // 给Vue的原型属性赋值一个函数   自定义一个函数名
    Vue.prototype.$sleep = sleep // 定义一个原型属性  $sleep所有组件都有了这个属性
    // 过滤器   全局 局部
    Vue.filter('relTime', relTime) // 注册全局过滤器  一旦注册 全局可用
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

/**
 * 此函数用来将  日期转化成相对时间
 * @params data  传入的日期
 */

function relTime (date) {
  // from 中的值是 日期 或者dayjs得到的日期  dayjs()当前时间 dayjs().from（date）当前时间距离传入时间多远
  // 对dayjs  进行本地语言包转化locale
  return dayjs().locale('zh-cn').from(date)
}
