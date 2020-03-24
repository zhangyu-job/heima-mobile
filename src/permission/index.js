/**
 * 在此文件做导航守卫
 */

import router from '@/router' // 引入路由实例
import store from '@/store'
// 每当路由发生变化时   前置守卫都会执行
router.beforeEach(function (to, from, next) {
  // 如果是/user为起始   说明需要进行token的判断
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 需要拦截请求   让它去登录
    // 想去A  被拦截了   去了登录
    next({
      path: '/login',
      query: {
        // fullpath和path的区别是   fullpath会带？后面的参数   是一个完整的路径
        redirectUrl: to.fullPath
      }
    })
  } else {
    // 直接放行
    next()
  }
})
