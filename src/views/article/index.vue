<template>
   <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate|relTime}}</p>
        </div>
        <van-button :loading="followLoading" @click="follow" round size="small" type="info">{{article.is_followed?'已关注':'+ 关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content">
        <!-- 文章内容有标签有属性有样式  将标签设置到对应的元素中v-html -->

      </div>
      <div class="zan">
        <!-- 需要根据当前的态度决定 -->
        <van-button round size="small" :class="{active:article.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active:article.attitude===0}" plain icon="delete">不喜欢</van-button>
      </div>
      <!-- 放置评论组件 -->
      <Comment />
    </div >
    <!-- 放置一个遮罩层 -->
    <van-overlay :show="loading">
      <!-- 加载进度条 -->
      <div class="loading-container">
        <van-loading />
      </div>
    </van-overlay>
  </div>
</template>

<script>
// @ is an alias to /src

import { getArticleInfo } from '@/api/articles'
import { folloeUser, unfollowUser } from '@/api/user'
import Comment from './components/comment'
export default {
  components: {
    Comment
  },
  data () {
    return {
      article: {}, // 接收文章详情数据
      followLoading: false, // 是否正在点击关注
      loading: false // 遮罩层是否隐藏
    }
  },
  methods: {
    // 获取文章详情数据
    async getArticleInfo () {
      this.loading = true // 打开遮罩层
      // 获取参数
      const { artId } = this.$route.query // 从当前路由信息对象读取query参数
      this.article = await getArticleInfo(artId) // 得到文章结果
      this.loading = false // 关闭遮罩层
    },
    // 关注或者取消关注
    async follow () {
      this.followLoading = true
      try {
        // 判断关注状态
        if (this.article.is_followed) {
          // 取消关注
          await unfollowUser(this.article.aut_id)
        } else {
          await folloeUser({
            target: this.article.aut_id
          })
        }
        // 如果成功l
        // pc端是重新加载
        // 移动端不会重新加载  只是修改对应的数据状态
        this.article.is_followed = !this.article.is_followed

        if (this.article.is_followed) {
          this.$znotify({ type: 'success', message: '关注成功' })
        } else {
          this.$znotify({ type: 'success', message: '已取消' })
        }
      } catch (error) {
        // 失败会进入  error.message报错信息
        // 报错提示是编译之后的代码
        this.$znotify({ message: '操作失败' })
      } finally {
        // 不论成功或是失败  都会进入该函数
        this.followLoading = false
      }
    }
  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.loading-container{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay{
  background-color: none;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
