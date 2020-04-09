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
          <!-- item.art_id此时是一个大数字的对象   v-for的key需要用字符串或数字代替 -->
          <!-- to属性，跳转到文章详情 -->
          <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
            <!-- 放置元素  文章列表的循环项   无图  单图  三图 -->
            <div class="article_item">
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <!-- 根据封面类型判断单图 三图 无图 -->
              <!-- 三图 -->
              <div class="img_box" v-if="item.cover.type===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 -->
              <div class="img_box" v-if="item.cover.type===1">
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>

              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}</span>
                <span>{{item.pubdate|relTime}}</span>

                <!-- 此叉号的显示   应该根据当前的登录状态来显示   登录显示  不登录不显示 -->
                <!-- 最原始方式 -->
                <!-- <span class="close" v-if="$store.state.user.token"> -->
                <!-- 辅助函数形式 -->
                <!-- @事件名=“逻辑处理”  点击事件中触发一个显示反馈的事件   传出点击的文章id  -->
                <span class="close" @click.stop="$emit('showAction',item.art_id.toString())" v-if="user.token">
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
import { mapState } from 'vuex'
import { getArticles } from '@/api/articles'
import eventBus from '@/utils/eventbus'
export default {
  // 初始化函数
  created () {
    // 监听删除事件   有多少个实例就有多少个监听
    eventBus.$on('delArticle', (artId, channelId) => {
      // 判断一下  传过来的频道是否等于自身的频道
      if (channelId === this.channel_id) {
        // 说明当前的文章实例就是我们要去删除的数据实例
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        // 通过id查询对应的文章数据所在的下标
        if (index > -1) {
          this.articles.splice(index, 1)
        }
        if (this.articles.length === 0) {
          // 数据删光了
          this.onLoad() // 手动触发onload事件  给页面加载数据
        }
      }
    })
  },
  computed: {
    ...mapState(['user']) // 将user对象映射到计算属性中
  },
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
      await this.$sleep() // 人为的控制了时间  不让用户拉取太频繁

      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      // 获取内容
      this.articles.push(...data.results) // 将数据追加到队尾   这里需要一项一项追加，而不是直接追加数组
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
    async onRefresh () {
      // setTimeout(() => {
      //   // 下拉刷新   新的数据添加在数据头部
      //   const arr = Array.from(
      //     Array(2),
      //     (value, index) => '追加' + (index + 1)
      //   )
      //   // 下拉刷新   把数据追加到数组的队首
      //   this.articles.unshift(...arr)
      //   // 添加完数据   关掉loading
      //   this.downLoading = false
      //   this.successText = `更新了${arr.length}条数据`
      // }, 1000)

      await this.$sleep() // 人为的控制了时间  不让用户拉取太频繁
      // 下拉刷新发送最新时间戳
      const data = await getArticles({
        channel_id: this.channel_id,
        timestamp: Date.now() // 最新的时间戳
      })
      // 手动关闭下拉刷新
      this.downLoading = false
      // 判断最新的时间戳能否换来数据  如果能  新数据替换就数据   如果不能  就提示没有新数据
      if (data.results.length) {
        // 如果有返回数据   就需要替换article
        this.articles = data.results // 历史数据全部被覆盖
        // 此时之前的数据全部覆盖了   假如   之前把数据拉到了低端  意味着之前的finished已经为true
        if (data.pre_timestamp) {
          // 因为下拉刷新  换来了一波新的数据  让列表可以继续上拉加载
          this.finished = false // 重新唤醒列表  让列表可以上拉加载
          this.timestamp = data.pre_timestamp // 记录历史时间戳
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 没有新数据
        this.successText = '当前已是最新数据'
      }
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
