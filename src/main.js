import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import '@/styles/index.less' // 用来覆盖vant样式
import 'amfe-flexible'
Vue.use(Vant) // 注册vant组件   一旦注册  所以组件都可以使用
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
