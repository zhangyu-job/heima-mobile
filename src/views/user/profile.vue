<template>
   <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          @click="showPhoto=true"
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="名称" @click="showName= true" :value="user.name" />
      <van-cell is-link title="性别" @click="showGender= true" :value="user.gender===0?'男':'女'"/>
      <van-cell is-link title="生日" @click="showDate" :value="user.birthday" />
    </van-cell-group>
    <!-- 放置头像弹层 -->
    <!-- 弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
       <van-cell @click="openFileDialog" is-link title="本地相册选择图片"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>
    <!-- 放置昵称弹层 -->
    <!-- 弹昵称 -->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay="false">
       <!-- 编辑用户昵称  双向绑定用户的昵称-->
       <van-field :error-message="nameMsg" v-model.trim="user.name" type='textarea'  rows="4"></van-field>
       <!-- 放置一个按钮   用来确定关闭弹层 -->
       <van-button block type="info" size="normal" @click="btnName">确定</van-button>
    </van-popup>
    <!-- 放置性别弹层 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 放置生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <van-datetime-picker
           v-model="currentDate"
           type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="showBirthDay=false"
          @confirm="confirmDate"
         />
    </van-popup>
    <!-- 放置一个input：file标签  用来上传图片  不能被看到  要隐藏 -->
    <input @change="upload" ref="myFile" type="file" style="display:none" name="" id="">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updatePhoto } from '@/api/user'
export default {
  data () {
    return {
      showPhoto: false, // 头像弹层
      showName: false, // 姓名弹层
      showGender: false, // 性别弹层
      actions: [{ name: '男' }, { name: '女' }], // 数组   表示弹层中的选项
      showBirthDay: false, // 生日弹层
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(), // 当前时间
      currentDate: new Date(), // 弹出层时间
      nameMsg: '', // 错误信息
      user: {
        // 放置个人资料信息
        name: '', // 用户名称
        gender: 1,
        birthday: '', // 生日默认值
        photo: '' // 头像
      }
    }
  },
  methods: {
    // 打开选择图片的弹层
    openFileDialog () {
      this.$refs.myFile.click()
    },
    // 封装获取用户信息的方法
    async getUserProfile () {
      this.user = await getUserProfile()
    },
    btnName () {
      // 关闭弹层
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '用户昵称长度在1-7'
        return
      }
      // 此时长度不符合要求
      this.nameMsg = '' // 直接将错误信息清空
      this.showName = false
    },
    selectItem (item, index) {
      // 通过item或index得到点击是男还是女
      this.user.gender = index
      // 手动关闭弹层
      this.showGender = false
    },
    // 显示生日弹层
    showDate () {
      this.showBirthDay = true
      // 将当前的生日  设置到  选择日期的当前时间   将生日字符串转化成Date对象  绑定到日期组件
      this.currentDate = new Date(this.user.birthday)
    },
    // 确定生日
    confirmDate () {
      // 拿到选择的日期，设置给生日
      // 将日期类型转换为字符串
      this.user.birthday = dayjs(this.currentDate).format('YYYY-MM-DD')
      // 关闭弹层
      this.showBirthDay = false
    },
    // 修改头像
    async upload () {
      // 选择头像之后  修改头像
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0])
      const result = await updatePhoto(data)
      this.user.photo = result.photo // 把成功上传的头像地址设置给当前data中的数据
      this.showPhoto = false // 关闭弹层
    }
  },
  created () {
    this.getUserProfile() // 获取用户资料
  }
}
</script>

<style>

</style>
