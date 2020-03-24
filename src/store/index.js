import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 专门来放置共享的状态
    user: auth.getUser
  },
  mutations: {
    // 修改token  {token,refresh_token}
    updateUser (state, payload) {
      state.user = payload.user // 定义载荷的user数据给token
      // 更新vuex时候，应该将最新数据缓存
      auth.setUser(payload.user) // 相当于保持vuex和本地保持一致
    },
    delUser (state) {
      // 将vuex中的token设置为空对象
      state.user = {}
      // 缓存数据也需要更新
      auth.delUser() // 删除本地缓存中的token
    }
  },
  actions: {
  },
  modules: {
  }
})
