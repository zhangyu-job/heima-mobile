<template>
  <div class="container">
    <!-- 头：导航组件 -->
    <!-- 当前页地址是/user的时候   应该隐藏导航栏 -->
    <van-nav-bar title="黑马头条" right-text="搜索" fixed v-if="$route.path!=='/user'" @click-right="$router.push('/search')" />

    <!-- 二级路由组件容器 -->
    <!-- 判断当前的地址   如果是/user  则使用noTop -->
    <div class="my-wrapper" :class="{noTop:$route.path==='/user'}">
      <!-- 直接缓存二级路由容器  使用keep-alive组件包裹容器 -->
      <keep-alive>
          <!-- 一旦被包裹  组件就不会被销毁 -->
        <router-view></router-view>
      </keep-alive>
    </div>

    <!-- 底：标签栏组件 -->
    <!-- 开启路由模式 van-tabbar-item就可以当做router-link -->

    <van-tabbar route >
      <!-- 点击标签，跳转路由 -->
      <van-tabbar-item icon="wap-home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/question">问答</van-tabbar-item>
      <van-tabbar-item icon="tv-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="user-circle-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {}
}
</script>

<style scoped lang='less'>
.container{
  width: 100%;
  height: 100%;
  position: relative;
//控制二级路由
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
