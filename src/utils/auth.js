// 专门处理token的读写和删除

const USER_TOKEN = 'heima-toutiao-mobile' // 专门用来存储用户信息

// 设置用户的token信息
export function setUser (user) {
// user信息应该是一个对象
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}
// 获取用户的token信息
export function getUser () {
  // 将字符串转化为对象在返回
  // 短路表达式   如果前面为true   后面不执行   前面为false   后面才执行
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')
}
// 删除用户的token信息
export function delUser () {
// 删除token信息
  localStorage.removeItem(USER_TOKEN)
}
