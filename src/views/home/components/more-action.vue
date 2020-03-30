<template>
  <div class="more-action">
      <!-- 单元格组 -->
      <!-- v-if前面满足前面显示   前面不满足后面显示 -->
    <van-cell-group v-if="!isReport">
      <!-- 注册点击事件   调用父组件方法触发接口 -->
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
      <!-- 单元格组 -->

    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <!-- 注册举报点击事件 -->
      <van-cell @click="$emit('report',item.value)" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>

    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants' // 引入常量变量
import eventBus from '@/utils/eventbus'
export default {
  data () {
    return {
      isReport: false, // 是否举报
      reports // 相当于定义一个reports变量 初始值来源于constants的reports
    }
  },
  created () {
    // 一初始化就开始监听
    eventBus.$on('delArticle', () => (this.isReport = false)) // 只要开始删除，就把弹层组件设置初始化
  }
}
</script>

<style lang='less' scoped>
.more-action {
  border-radius: 4px;
}
</style>
