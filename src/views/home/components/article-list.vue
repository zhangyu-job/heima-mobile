<template>
  <!-- 文章列表组件    -->
  <!-- van-list可以实现上拉加载下一页内容 -->
  <!-- 阅读记忆   上次你浏览到哪  回来还在哪 -->
    <div class="scroll-wrapper">
        <!-- 文章列表 -->
        <!-- van-list组件  如果不加干涉  初始化完毕  就会检测   自己距离底部的长度  如果超过了
        限定，就会执行load事件 自动把绑定的loading变成true -->
        <van-list finished-text="我是有底线的" v-model="upLoading" :finished="finished" @load="onLoad">
            <!-- 循环内容 -->
            <van-cell-group>
                <van-cell v-for="item in articles" :key="item" title="美股熔断" :value="'天台排队'+item"></van-cell>
            </van-cell-group>
        </van-list>
    </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false, // 是否开启了上拉加载
      finished: false, // 是否已经完成数据加载
      articles: []
    }
  },
  methods: {
    onLoad () {
      console.log('开始加载数据')
      // 数据加载完毕   把finished设置为true   就不在请求
      //   此时强制判断总条数  超过50直接关闭
      if (this.articles.length > 50) {
        this.finished = true
      } else {
        const arr = Array.from(Array(15), (value, index) => this.articles.length + index + 1)
        // 上拉加载   把数据追加到数组的队尾
        this.articles.push(...arr)
        // 添加完数据   关掉loading
        this.upLoading = false
      }
    //   setTimeout(() => {
    //     this.finished = true // 表示数据已经加载完毕
    //   }, 1000)
    }
  }
}
</script>

<style>

</style>
