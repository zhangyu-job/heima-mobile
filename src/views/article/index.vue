<template>
  <div class="container">
   <!-- 导航显示返回箭头 -->
    <van-nav-bar title="文章详情" left-arrow @click-left="$router.back()" />

  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {

  }
}
</script>
