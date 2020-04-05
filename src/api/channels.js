import store from '@/store' // 游客用户的key
/***
 * 负责处理频道数据
 */
import request from '@/utils/request'
const CACHE_CHANNEL_V = 'hm-94-toutiao-v' // 登录用户的key
const CACHE_CHANNEL_T = 'hm-94-toutiao-t' // 游客用户的key
/**
 * 获取我的频道数据  没有参数  匿名用户也可以获取
 * 要将此方法  改造成  本地化的频道
 */
export function getMyChannels () {
  // return request({
  //   url: '/user/channels'
  // })

  // 要对原来的方法进行改造   但是不想改造调用的方法
  // 因为python端编辑用户接口有问题
  return new Promise(function (resolve, reject) {
    // 支持本地化缓存   区分当前是登录用户还是游客用户
    // 根据当前用户有没有token判断
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 去缓存中读取  用户频道数据
    const str = localStorage.getItem(key) // 通过缓存key获取缓存中的用户的频道数据
    if (str) {
      // 本地缓存有数据   应该把本地数据释放给后面的执行结果
      resolve({ channels: JSON.parse(str) })
    } else {
      // 本地缓存没有数据  本地没有数据就要去线上取数据
      request({ url: '/user/channels' }).then(result => {
        // 获取请求的结果  先把数据放入缓存
        localStorage.setItem(key, JSON.stringify(result.channels))
        // 需要resolve数据
        resolve(result) // 表示成功执行了获取用户频道数据
      })
    }
  })
}

/**
 * 获取全部频道数据
 */
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}

/**
 * 删除频道API
 * @params   id   作为删除频道的依据
 */

export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 有id就可以直接从缓存中删除对应的id数
    // 删除频道时   是有数据的
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key)) // 直接将本地缓存中的字符串转化为对象
    // 第一种
    // channels = channels.filter(item => item.id !== id)
    // localStorage.setItem(key, JSON.stringify(channels))
    // 第二种
    const index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      channels.splice(index, 1) // 删除对应的下标元素
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
      // 如果成功
      resolve() // 可以传参也可以不传
    } else {
      // 如果没有找到对应的下标
      reject(new Error('没有找到对应的频道..'))
    }
  })
}

/**
 * 添加频道方法
 */

export function addChannel (channel) {
  return new Promise(function (resolve, reject) {
    // 根据当前的token判断使用哪个key
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T // key根据当前的登录状态来判断
    const channels = JSON.parse(localStorage.getItem(key)) // 转化数组 得到缓存中的数据
    channels.push(channel) // 将添加的频道数据添加到队尾
    localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
    resolve() // 执行这一步 相当于 告诉我们使用promise的方法 执行成功了
  })
}
