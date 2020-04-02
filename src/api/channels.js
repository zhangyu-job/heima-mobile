import store from '@/store' // 游客用户的key
/***
 * 负责处理频道数据
 */
import request from '@/utils/request'
const CACHE_CHANNEL_V = 'hm-toutiao-v' // 登录用户的key
const CACHE_CHANNEL_T = 'hm-toutiao-t'
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
      // 本地缓存有数据   应该吧本地数据释放给后面的执行结果
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
