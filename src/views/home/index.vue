<template>
  <div class="container">
    <!-- 放置tabs组件 默认绑定激活页签-->
    <van-tabs v-model="activeIndex">
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 生成若干个单元格 -->
        <!-- <div class="scroll-wrapper">
          <van-cell-group>
            <van-cell title="标题" value="内容" :key="item" v-for="item in 20"></van-cell>
          </van-cell-group>
        </div> -->
        <!-- 需要将频道id传递给每一个列表组件  父=》子props -->
        <!-- 监听article-list触发的showAction事件 -->
        <ArticleList @showAction="openAction" :channel_id="item.id"></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 放置编辑频道的图标 -->
    <span class="bar_btn" @click="showChannelEdit=true">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 放置一个弹层组件 -->
    <van-popup v-model="showMoreAction" style="width:70%">
      <!-- 放置反馈组件 -->
      <!-- 在此监听more-action触发事件 -->
      <MoreAction @dislike="dislikeOrReport('dislike')" @report="dislikeOrReport('report',$event)"/>
    </van-popup>
    <!-- 频道编辑组件  放在弹出面板的组件 -->
    <van-action-sheet :round="false" v-model="showChannelEdit" title="编辑频道">
      <!-- 放置频道编辑组件 -->
      <!-- 将父组件数据传给子组件 -->
      <ChannelEdit @addChannel="addChannel" @delChannel="delChannel" :activeIndex="activeIndex" @selectChannel="selectChannel" :channels="channels"></ChannelEdit>
    </van-action-sheet>
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from './components/article-list'
import MoreAction from './components/more-action'
import { getMyChannels, delChannel, addChannel } from '@/api/channels'
import { dislikeArticle, reportArticle } from '@/api/articles'
import eventbus from '@/utils/eventbus'
import ChannelEdit from './components/channel-edit' // 引入编辑频道组件
export default {
  name: 'Home',
  components: {
    ArticleList, MoreAction, ChannelEdit
  },
  data () {
    return {
      channels: [], // 用来接收频道数据
      showMoreAction: false, // 是否显示弹层
      articleId: null, // 用来接收点击的文章id
      activeIndex: 0, // 当前默认激活的页面0
      showChannelEdit: false // 是否显示频道编辑  默认不显示
    }
  },
  methods: {
    // 删除频道方法
    async delChannel (id) {
      // 先调用
      console.log(id)

      try {
        await delChannel(id)
        // 如果此时成功的resolve   应该去溢出data中的数据
        const index = this.channels.findIndex(item => item.id === id)
        // 根据当前删除的索引  和当前激活的索引的关系来决定 当前激活索引是否需要改变
        if (index <= this.activeIndex) {
          // 如果删除的索引是在当前激活索引之前的   或者等于当前激活索引的
          // 此时把激活索引往前一位
          this.activeIndex = this.activeIndex - 1
        }
        this.channels.splice(index, 1)
      } catch (error) {
        this.$znotify({ message: '删除频道失败' })
      }
    },
    // 添加频道的方法
    async addChannel (channel) {
      // 这里需要 调用api 将频道写入缓存 成功之后 要将 该频道添加到 data数据
      await addChannel(channel) // 传入参数 写入缓存
      this.channels.push(channel)// 将添加的channel添加到 data中的channels中
    },
    async getMyChannels () {
      const data = await getMyChannels() // 接收返回数据
      this.channels = data.channels // 将数据赋值给data中的数据
    },
    // 方法1  传id
    // selectChannel (id) {
    //   // 拿到id  找到id所对应的频道索引
    //   const index = this.channels.findIndex(item => item.id === id)
    //   this.activeIndex = index
    //   this.showChannelEdit = false // 关闭弹层
    // },
    // 方法2  传索引
    selectChannel (index) {
      // 拿到id  找到id所对应的频道索引
      // const index = this.channels.findIndex(item => item.id === id)
      this.activeIndex = index
      this.showChannelEdit = false // 关闭弹层
    },
    // 此方法会在article-list中触发showAction的时候触发
    openAction (artId) {
      // 此时弹出反馈的层
      this.showMoreAction = true
      // 把id存起来
      this.articleId = artId
    },
    // 对文章不感兴趣
    async dislikeOrReport (operateType, type) {
      try {
        // 根据参数判断是不喜欢还是举报

        operateType === 'dislike' ? await dislikeArticle({
          target: this.articleId // 不感兴趣的文章id
        }) : await reportArticle({ target: this.articleId, type }) // 这里的type是通过$event传出来的
        this.$znotify({
          type: 'success',
          message: '操作成功'
        })
        // 应该触发一个事件 利用事件广播的机制  通知对应的tab来删除对应的文章
        // this.channels[this.activeIndex].id  //当前激活的频道数据
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        // 监听了事件  根据id删除文章数据
        this.showMoreAction = false // 此时关闭弹层
      } catch (error) {
        this.$znotify({
          message: '操作失败'
        })
      }
    }
    // 举报文章
    // async reportArticle (type) {
    //   try {
    //     // 调用举报文章接口
    //     await reportArticle({ target: this.articleId, type })
    //     // awiat 下方表示举报成功
    //     this.$znotify({
    //       type: 'success',
    //       message: '操作成功'
    //     })
    //     // 将举报成功的文章删除
    //     eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //     // 监听了事件  根据id删除文章数据
    //     this.showMoreAction = false // 此时关闭弹层
    //   } catch (error) {
    //     this.$znotify({
    //       message: '操作失败'
    //     })
    //   }
    // }
  },
  created () {
    // 直接获取频道数据
    this.getMyChannels()
  }
}
</script>

<style lang="less" scoped>
 //弹出编辑面板的样式
  .van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }

}
</style>
