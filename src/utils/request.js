/***
 * request.js   请求管理工具
 * create by zhangyu   2020/3/23
 */

import axios from 'axios'
// axios.defaults   是对原有默认值进行赋值
import JSONBig from 'json-bigint' // 引入大数字插件
import store from '@/store' // 引入vuex中的store实例对象   相当于组件中的this.$store
import router from '@/router' // 引入router对象

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
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  //   config.headers.Authorization && (config.headers.Authorization = `Bearer ${store.state.user.token}`)
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
}, async function (error) {
  // 如果请求失败或者失效或者其他错误  会进入响应拦截器的错误区域
  // 只有要是401  就是token失效（应该用导航守卫将没有token的拦截在外面）
  /**
           * error
           * config    出现这次错误的配置信息
           * request   请求对象
           * response  响应对象status  状态码
           */
  if (error.response && error.response.state === 401) {
    const path = {
      path: '/login',
      query: {
        redirectUrl: router.currentRoute.fullPath // 表示登录页要跳转的地址
      }
      // 路由传参的两个写法   动态路由阿和query()
    }
    // 如果状态码是401的话   就认为token失败了    就需要处理token失效问题
    // refresh_token
    if (store.state.user.refresh_token) {
      /**
               * 如果有refresh_token   就要用refresh来换取新的token   需要调用刷新token的接口
               * 发请求就需要用工具   axios还是instance？
               * 需要使用axios   因为token失效了   instance的拦截器还是会去将失效的token注入到header中
               * 需要用没有拦截器的axios来发token的请求
               */
      try {
        const result = await axios({
          method: 'put',
          // 配置baceUrl的是instance，所以axios要写完整地址
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          // 在请求头中注入refresh_token
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` }
        })
        // await 后面就是promise执行完成的逻辑   axios没有进行解构  所以还是两个data
        // 如果成功了   更新失效的token   直接更新vuex中的数据
        store.commit('updateUser', {
          // 载荷数据
          user: {
            token: result.data.data.token, // 新token
            refresh_token: store.state.user.refresh_token // 还是原来的refresh_token   14天后过期
          }
        })
        // 相当于执行之前的401错误请求   返回这个请求的目的  是继续执行这个请求执行链下面的内容
        return instance(error.config)
      } catch (error) {
        // 如果失败  意味着尝试去续命   但是续命失败   即14天后refresh_token过期
        // 重新登录   登录之前  删掉token   因为此时token失效   refresh_token也失效
        store.commit('delUser')
        // 重新回到登录页面
        router.push(path)
      }
    } else {
      // 没有refresh_token   直接回到登录页
      //   router.push('/login')
      // A页面请求失败了 也没有refresh_token   只能回到登录页   登陆之后   希望回到A页面
      // 在跳转到登录页的过程中，把当前页地址传给登录页
      // 登录之后  先判断有没有需要跳转的页面  没有就跳转到主页
      // router.currentRoute.fullPath   需要跳转的地址
      // router.push不仅可以跟字符串，还可以跟一个对象
      store.commit('delUser') // 也需要删除   因为token失效了

      router.push(path)
    }
  }
  return Promise.reject(error)
})
export default instance
