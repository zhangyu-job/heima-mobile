import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission' // 权限拦截模块
import store from './store'
import Vant, { Lazyload } from 'vant'
import plugin from '@/utils/plugin'
import 'vant/lib/index.less'
import '@/styles/index.less' // 用来覆盖vant样式
import 'amfe-flexible'
Vue.use(Vant) // 注册vant组件   一旦注册  所以组件都可以使用
Vue.use(plugin) // 注册组件  需要放置在Vue.use(Vant)之后  因为要在plugin中用vant函数
Vue.use(Lazyload) // 注册懒加载指令  图片就可以搭配这个指令进行懒加载
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
