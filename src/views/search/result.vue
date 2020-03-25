<template>
  <div class="container">
   <!-- 导航显示返回箭头 -->
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" />

  </div>
</template>

<script>
export default {
  name: 'searchResult'
}
</script>

<style>

</style>
