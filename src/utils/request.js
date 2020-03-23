/***
 * request.js   请求管理工具
 * create by zhangyu   2020/3/23
 */

import axios from 'axios'
// axios.defaults   是对原有默认值进行赋值
import JSONBig from 'json-bigint' // 引入大数字插件
import store from '@/store'

// axios.create()相当于new了一个新的axios实例
const instance = axios.create({
  // 构造函数传入一些配置   和defaults一样
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',
  transformResponse: [function (data) {
    // data就是后台响应回来   但是还没进入到axios的响应拦截器时执行  数组里可以写多个的处理函数
    return data ? JSONBig.parse(data) : {}
  }]
}) // 创建一个axios的新实例

// token注入   应该在请求之前
instance.interceptors.request.use(function (config) {
  // 读取配置信息   给配置信息中注入token
  // 将token统一注入到header中
//   if (config.headers.Authorization) {
//     config.headers.Authorization = `Bearer ${store.state.user.token}`
//   }
  config.headers.Authorization && (config.headers.Authorization = `Bearer ${store.state.user.token}`)
  return config
}, function (error) {
  // 直接返回promise的错误   这样会直接进入axios的catch中
  return Promise.reject(error)
})

// 用响应拦截器处理返回的数据   将嵌套的数据结构出来
instance.interceptors.response.use(function (response) {
  // response实际上已经是axios默认包了一层数据   data才是我们之前处理过的数据
  try {
    return response.data.data
  } catch (error) {
    return response.data
  }
}, function (error) {
  return Promise.reject(error)
})
export default instance
