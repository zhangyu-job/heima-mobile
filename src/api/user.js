/**
 * 专门处理用户相关的请求
 */
import request from '@/utils/request' // 引入请求模块
// request相当于axios的一个实例  和axios有同样的方法和属性
// 登录方法
export function login (data) {
  return request({
    // 配置选项
    url: '/authorizations',
    method: 'post',
    // axios中的body参数放置在data中
    data // 接收传入的data
  })
  // 返回一个promise对象
}

/**
 * 关注用户
 */
export function folloeUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}

/**
 * 取消关注用户
 */
export function unfollowUser (autid) {
  return request({
    url: `/user/followings/${autid}`,
    method: 'delete'
  })
}

/**
 * 获取用户自己的信息
 */
export function getUserInfo () {
  return request({
    url: '/user'
  })
}

/**
 * 获取用户资料
 */
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}

/**
 * 修改用户头像
 */
export function updatePhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data
  })
}

/**
 * 保存用户信息
 */
export function saveUserInfo (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data: { ...data, photo: null }
  })
}
