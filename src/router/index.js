import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/home'

Vue.use(VueRouter)

// 用按需加载的方式配置路由
const Layout = () => import('@/views/layout') // 按需引入layout
const home = () => import('@/views/home') // 按需引入home
const question = () => import('@/views/question') // 按需引入question
const video = () => import('@/views/video') // 按需引入video
const user = () => import('@/views/user') // 按需引入user
// 其他一级组件
const chat = () => import('@/views/user/chat') // 小智同学
const profile = () => import('@/views/user/profile') // 编辑资料组件
const login = () => import('@/views/login') // 登录模块
const search = () => import('@/views/search') // 搜索中心模块
const searchresult = () => import('@/views/search/result') // 搜索结果模块
const article = () => import('@/views/article') // 文章详情模块
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    children: [{
      path: '', // 啥都不写  默认就是默认组件
      component: home
    }, {
      path: '/question', // 问答组件
      component: question
    }, {
      path: '/video', // 视频组件
      component: video
    }, {
      path: '/user', // 用户组件
      component: user
    }]
  }, {
    path: '/user/chat', // 一级路由  小智同学
    component: chat
  }, {
    path: '/user/profile', // 一级路由  编辑资料组件
    component: profile
  }, {
    path: '/login',
    component: login // 一级路由   登录模块
  }, {
    path: '/search',
    component: search // 一级路由   搜索中心模块
  }, {
    path: '/search/result',
    component: searchresult // 一级路由   搜索结果模块
  }, {
    path: '/article',
    component: article // 一级路由   文章详情模块
  }

]

const router = new VueRouter({
  routes
})

export default router
