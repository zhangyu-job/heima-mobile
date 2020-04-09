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

/**
 * 不感兴趣的文章接口
 */
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}

/**
 * 举报文章接口
 */
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data
  })
}

/**
 * 获取搜索建议
 */
export function getSuggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}

/**
 * 搜索文章
 */
export function searchArticle (params) {
  return request({
    url: '/search',
    params
  })
}

/**
 * 获取文章详情
 */
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`
  })
}
