<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 联想内容 -->
    <van-search @search="onSearch" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <!-- 判断是否有输入内容 -->
    <!-- 或者使用v-if="!q" -->
    <van-cell-group class="suggest-box" v-if="q">
      <!-- 循环的搜索建议 -->
      <van-cell @click="toResult(item)" icon="search" v-for="(item,index) in suggestList" :key="index">
        {{item}}
      </van-cell>
    </van-cell-group>
    <!-- 历史记录部分    -->
    <div class="history-box" v-else>
      <!-- 如果没有历史记录   就隐藏 -->
      <!-- 只有当历史记录存在时候   才显示头部 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <!-- 清空操作 -->
        <van-icon @click="clear" name="delete"></van-icon>
      </div>
      <van-cell-group>
        <van-cell @click="toResult(item)" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <!-- 注册点击叉号事件 -->
          <!-- 但父组件和子组件都有点击事件时   发生了事件冒泡 -->
          <!-- js  event.stopPagintion() -->
          <!-- vue中国可以使用修饰符  直接阻止事件冒泡 -->
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { getSuggestion } from '@/api/articles'
const key = 'hm-94-toutiao-history' // 作为历史数据存在本地缓存中
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键字的数据
      historyList: JSON.parse(localStorage.getItem(key) || '[]'), // 历史记录
      suggestList: [] // 联想的搜索建议   任何想在视图中使用的变量都要在data中定义
    }
  },
  watch: {
    // 函数防抖
    // q () {
    //   // 请求接口   防抖
    //   clearTimeout(this.timer) // 先清除掉之前的定时器
    //   // 防抖函数
    //   this.timer = setTimeout(async () => {
    //     // 需要判断   当清空时候不能发送请求  但是要把联想内容清空
    //     if (!this.q) {
    //       this.suggestList = []
    //       return
    //     }
    //     // 请求  联想搜索的建议
    //     // 联想搜索的建议  需要 放置在一个变量中
    //     const data = await getSuggestion({ q: this.q })
    //     this.suggestList = data.options
    //   }, 300)
    // }
    // 函数节流
    q () {
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          // 先将标记设置为空
          this.timer = null
          // 需要判断  当清空时候不能发送请求  但是要把联想数据清空
          if (!this.q) {
            this.suggestList = []
            return
          }
          const data = await getSuggestion({ q: this.q })
          this.suggestList = data.options
        }, 300)
      }
    }
  },
  methods: {
    // 删除历史
    delHistory (index) {
      // 先在data中删除数据   然后把data中的数据同步到本地缓存
      this.historyList.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // toSearchResult (text) {
    //   // 跳转到搜索结果页
    //   // 路由传参   params  query
    //   // 方法1
    //   // this.$router.push('/search/result?q=' + text) // 采用query传递参数
    //   // 方法2
    //   this.$router.push({ path: '/search/result', query: { q: text } })
    // },
    // 到结果页
    toResult (text) {
      // 应该把text放到历史记录
      this.historyList.push(text) // 加到历史记录
      // 去重
      this.historyList = Array.from(new Set(this.historyList))
      // 设置到本地缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 跳转到搜索页
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    // 清空历史记录
    async clear () {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定删除所有的历史记录吗？'
        })
        // 清空历史记录
        this.historyList = [] // 将本地历史记录设置为空
        localStorage.setItem(key, '[]') // 同步本地缓存
      } catch (error) {
        // 失败不需要处理
      }
    },
    onSearch () {
      // 判断搜索内容是否为空
      if (!this.q) return
      // 跳转之前  把搜索结果添加到历史记录
      this.historyList.push(this.q)
      // 这里需要去重  set   new Set(this.historyList)
      // Array.from转为数组
      this.historyList = Array.from(new Set(this.historyList))
      // 将历史记录同步到本地缓存
      localStorage.setItem(key, JSON.stringify(this.historyList))
      // 搜索事件触发   跳到搜索结果页  并且携带参数
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  }
  // created () {
  //   this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  // }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
