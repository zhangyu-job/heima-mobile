<template>
  <!-- 文章列表组件    -->
  <!-- van-list可以实现上拉加载下一页内容 -->
  <!-- 阅读记忆   上次你浏览到哪  回来还在哪 -->
  <div class="scroll-wrapper">
    <!-- 文章列表 -->
    <!-- van-list组件  如果不加干涉  初始化完毕  就会检测   自己距离底部的长度  如果超过了
    限定，就会执行load事件 自动把绑定的loading变成true-->
    <!-- 下拉刷新组件包裹  列表组件 -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
      <van-list finished-text="我是有底线的" v-model="upLoading" :finished="finished" @load="onLoad">
        <!-- 循环内容 -->
        <van-cell-group>
          <van-cell v-for="item in articles" :key="item">
            <!-- 放置元素  文章列表的循环项   无图  单图  三图 -->
            <div class="article_item">
              <h3 class="van-ellipsis">PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新</h3>
              <div class="img_box">
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
              </div>
              <div class="info_box">
                <span>你像一阵风</span>
                <span>8评论</span>
                <span>10分钟前</span>
                <span class="close">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data () {
    return {
      successText: '', // 刷新成功的文本
      downLoading: false, // 下拉刷新   表示是否正在下拉刷新
      upLoading: false, // 是否开启了上拉加载
      finished: false, // 是否已经完成数据加载
      articles: []
    }
  },
  methods: {
    // 上拉加载
    onLoad () {
      console.log('开始加载数据')
      // 数据加载完毕   把finished设置为true   就不在请求
      //   此时强制判断总条数  超过50直接关闭
      if (this.articles.length > 50) {
        this.finished = true
      } else {
        const arr = Array.from(
          Array(15),
          (value, index) => this.articles.length + index + 1
        )
        // 上拉加载   把数据追加到数组的队尾
        this.articles.push(...arr)
        // 添加完数据   关掉loading
        this.upLoading = false
      }
      //   setTimeout(() => {
      //     this.finished = true // 表示数据已经加载完毕
      //   }, 1000)
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        // 下拉刷新   新的数据添加在数据头部
        const arr = Array.from(
          Array(2),
          (value, index) => '追加' + (index + 1)
        )
        // 下拉刷新   把数据追加到数组的队首
        this.articles.unshift(...arr)
        // 添加完数据   关掉loading
        this.downLoading = false
        this.successText = `更新了${arr.length}条数据`
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
