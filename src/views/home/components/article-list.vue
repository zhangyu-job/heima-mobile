<template>
  <!-- 文章列表组件    -->
  <!-- van-list可以实现上拉加载下一页内容 -->
  <!-- 阅读记忆   上次你浏览到哪  回来还在哪 -->
    <div class="scroll-wrapper">
        <!-- 文章列表 -->
        <!-- van-list组件  如果不加干涉  初始化完毕  就会检测   自己距离底部的长度  如果超过了
        限定，就会执行load事件 自动把绑定的loading变成true -->
        <van-list v-model="upLoading" :finished="finished" @load="onLoad"></van-list>
    </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false, // 是否开启了上拉加载
      finished: false // 是否已经完成数据加载
    }
  },
  methods: {
    onLoad () {
      console.log('开始加载数据')

      setTimeout(() => {
        this.finished = true // 表示数据已经加载完毕
      }, 1000)
    }
  }
}
</script>

<style>

</style>
