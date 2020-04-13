<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="myList">
      <!-- 把list消息循环渲染到视图上 -->
      <div class="chat-item" :class="{left:item.name==='xz',right:item.name!=='xz'}" v-for="(item,index) in list" :key="index">
        <!-- 如果小智说的  应该在左边 -->
        <van-image v-if="item.name==='xz'" fit="cover" round :src="XZImg" />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image v-if="item.name!=='xz'" fit="cover" round :src="photo" />

      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">发送</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import XZImg from '@/assets/head.jpg'
import { mapState } from 'vuex'
import io from 'socket.io-client'
export default {
  data () {
    return {
      loading: false, // 控制输入状态
      value: '', // 存储输入内容
      XZImg,
      list: [] // 用来存储小智童鞋  和我的聊天记录
    }
  },
  computed: {
    ...mapState(['photo', 'user']) // 头像地址   当前用户的头像地址
  },
  // 初始化钩子函数
  created () {
    // 建立与服务端链接
    // new WebSocket  原生
    // io需要传参数   接口规定的
    // 初始化WebSocket链接
    this.socket = io('http://ttapi.research.itcast.cn', {
      // 固定写法   会拼接到url地址上?后面
      query: {
        token: this.user.token // vuex中的tokrn
      }
    })// 这里用this.socket接收 目的是在其他方法  依然可以用this.socket获取对象实例
    // 怎么监听连接成功  ws.onopen（原生）
    // connect是固定写法   表示当前已经建立连接成功
    this.socket.on('connect', () => {
      // 此时执行 connect事件  表示已经和服务器打通了电话
      this.list.push({ msg: '你今天真好看', name: 'xz' }) // 加上name是用来区分这句话是谁说的
    })
    // 此时监听回复消息
    this.socket.on('message', data => {
      // 接收的消息都是小智回复的
      this.list.push({ ...data, name: 'xz' })
      this.scrollBottom() // 接收消息之后滚到底
    })
  },
  methods: {
    // 将内容滚动到底部  设置滚动条的scrollTop（滚动条距离顶部的长度）=scrollHeight（整个容器实际高度）
    scrollBottom () {
      // vuejs  数据变化=》异步的=》视图更新
      // 需要等到异步更新完之后  才去执行 滚动
      // this.$nextTick 此函数会在上一次更新  并且完成页面渲染之后执行
      this.$nextTick(() => {
        // 在这个回调函数中  上一次的数据更新结果  已经反映到视图上  视图已经更新了
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight // 将滚动条滚动到最底部
      })
    },
    // 发送消息方法
    async send () {
      // 调用websocket发出一个消息
      // 发出消息之前  要判断
      if (!this.value) return false // 如果字符串为空  不能发消息
      // 如果不为空   先打开状态
      this.loading = true // 打开状态的目的是防止重复提交
      await this.$sleep(500) // 强制休眠
      // 使用websocket发送消息
      const obj = {
        msg: this.value, // 消息内容
        timestamp: Date.now() // 给一个当前的时间戳
      }
      // socket.emit(消息类型，消息内容)
      this.socket.emit('message', obj)
      // 发送消息之后  把消息追加到当前页面
      this.list.push(obj)
      this.value = ''
      this.loading = false
      this.scrollBottom() // 发消息之后滚到底
    }
  },
  // 实例销毁
  beforeDestroy () {
    // 需要在实例销毁前  关闭websocket
    this.socket.close()
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
