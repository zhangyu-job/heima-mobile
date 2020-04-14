<template>
  <div id="app">
    <!-- 一级路由容器 -->
    <!-- keep-alive如果不加控制  会缓存所有的组件实例
    如果不使用，就都不缓存 -->
    <!-- 条件渲染   -->
    <keep-alive>
      <router-view v-if="$route.meta.isAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.isAlive"></router-view>
  </div>
</template>

<style lang="less">

</style>
