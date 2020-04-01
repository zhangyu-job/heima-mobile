<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
          <!-- 点击频道选项时候，需要把频道id传出去 也可以传索引 -->
          <!-- 方法1 传id -->
          <!-- <span @click="$emit('selectChannel',item.id)" class="f12">{{item.name}}</span> -->
          <!-- 方法2  传索引 -->
          <span @click="$emit('selectChannel',index)" class="f12">{{item.name}}</span>
          <!-- 叉号应该在编辑状态时候显示    推荐  第一个永远不能删除 -->
          <van-icon v-if="index!==0" class="btn" name="cross"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false,
      allChannels: [] // 定义变量  接收全部的数据
    }
  },
  props: {
    channels: {
      requires: true, // 表示必须传递channels
      type: Array, // 数组类型
      default: () => [] // 默认空数组   箭头函数表示返回一个空数组
    }
  },
  methods: {
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels // 直接把频道数据赋值给频道
    }
  },
  // 计算属性是一个动态的结果  全部数据-用户频道=重新计算
  computed: {
    // 可选频道  计算属性要求必须有返回值
    optionChannels () {
      // 全部频道-用户频道
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  },
  created () {
    this.getAllChannels() // 调用组件的方法
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
