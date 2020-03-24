<template>
  <div class="container">
   <!-- 导航显示返回箭头 -->
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()" />
    <!-- 登录布局 -->
    <!-- 外层用cell-group组件来包裹提供  边框 -->
    <van-cell-group>
      <!-- 登录手机号 -->
      <van-field label="手机号" @blur="checkMobile" :error-message="errorMessage.mobile" v-model.trim="loginForm.mobile" placeholder="请输入手机号" />
      <!-- 验证码 -->
      <van-field label="验证码" @blur="checkCode" :error-message="errorMessage.code" v-model.trim="loginForm.code" placeholder="请输入验证码">
        <!-- 插槽内容 -->
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
    <div class="login-box">
      <van-button @click="login" type="info"  size="small" block round>登录</van-button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  data () {
    return {
      // 表单数据
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      // 专门放置消息
      errorMessage: {
        mobile: '', // 手机的错误提示消息
        code: '' // 验证码的错误提示消息
      }
    }
  },
  methods: {
    // 检查手机号的方法
    checkMobile () {
      // 获取手机号  判断是否为空  满足手机号格式
      if (!this.loginForm.mobile) {
        //  表示为空
        this.errorMessage.mobile = '手机号不能为空'
        // 此时没必要继续往下了
        return false // false表示次轮校验没通过
      }
      // 第二轮  手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMessage.mobile = '手机号格式不正确'
        return false
      }
      // 到了这个位置   说明校验通过了
      this.errorMessage.mobile = ''
      return true
    },
    // 检查验证码的方法
    checkCode () {
      // 获取验证码  判断是否为空  满足验证码格式
      if (!this.loginForm.code) {
        //  表示为空
        this.errorMessage.code = '验证码不能为空'
        // 此时没必要继续往下了
        return false // false表示次轮校验没通过
      }
      // 第二轮  验证码格式
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMessage.code = '验证码必须是6位数字'
        return false
      }
      // 到了这个位置   说明校验通过了
      this.errorMessage.code = ''
      return true
    },
    // 登录校验
    login () {
      // 校验手机号和验证码
      if (this.checkMobile() && this.checkCode()) {
        // 如果两个值都为true  表示通过了校验
        // 校验通过之后   调用接口  判断手机号和验证码正确与否
        console.log('校验通过')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-box{
  padding: 20px;
}
</style>
