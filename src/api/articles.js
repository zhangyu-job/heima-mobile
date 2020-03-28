/**
 * 处理文章模块的请求数据
 */

import request from '@/utils/request'

/**
 * 获取文章数据
 * 需要传入时间戳和channel_id
 */
export function getArticles (params) {
  return request({
    // 这里地址需要全地址  因为地址变了
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params } // 合并数据
  })
}
