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
          <van-cell v-for="item in articles" :key="item.art_id">
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
import { getArticles } from '@/api/articles'
export default {
  data () {
    return {
      successText: '', // 刷新成功的文本
      downLoading: false, // 下拉刷新   表示是否正在下拉刷新
      upLoading: false, // 是否开启了上拉加载
      finished: false, // 是否已经完成数据加载
      articles: [], // 文章列表
      timestamp: null // 定义一个时间戳  存储历史时间戳
    }
  },
  // props:['channel_id]  //字符串数组  接收方式
  // props  对象形式  可以约束传入的值  必填
  props: {
    // key（props属性名）value（对象  配置）
    channel_id: {
      required: true, // 要求必须传
      type: Number, // 表示要传的类型
      default: null // 假如没有传入   就使用默认数据
    }
  },
  methods: {
    // 上拉加载
    async onLoad () {
      console.log('开始加载文章列表数据')
      // 数据加载完毕   把finished设置为true   就不在请求
      //   此时强制判断总条数  超过50直接关闭
      // if (this.articles.length > 50) {
      //   this.finished = true
      // } else {
      //   const arr = Array.from(
      //     Array(15),
      //     (value, index) => this.articles.length + index + 1
      //   )
      //   // 上拉加载   把数据追加到数组的队尾
      //   this.articles.push(...arr)
      //   // 添加完数据   关掉loading
      //   this.upLoading = false
      // }

      //   setTimeout(() => {
      //     this.finished = true // 表示数据已经加载完毕
      //   }, 1000)

      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      // 获取内容
      this.articles.push(data.results) // 将数据追加到队尾
      // 关闭加载状态
      this.upLoading = false
      // 将历史时间戳给timestamp   赋值之前判断历史时间戳是否为0
      // 如果历史时间戳为0  说明没有数据了
      if (data.pre_timestamp) {
        // 如果有历史时间戳  说明有数据  还可以继续加载
        this.timestamp = data.pre_timestamp
      } else {
        // 没有数据  结束
        this.finished = true
      }
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
