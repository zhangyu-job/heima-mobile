<template>
  <div class="container">
   <!-- 导航显示返回箭头 -->
    <van-nav-bar title="编辑资料" left-arrow right-text="保存" @click-left="$router.back()" />

  </div>
</template>

<script>
export default {
  name: 'profile'
}
</script>

<style>

</style>
