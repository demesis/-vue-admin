import request from '@/utils/request'

// 获取品牌
export const getBrand = (page, limit) => {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })
}

// 新增品牌
export const saveBrand = (data) => {
  return request({
    url: '/admin/product/baseTrademark/save',
    method: 'post',
    data
  })
}

// 修改品牌
export const updateBrand = (data) => {
  return request({
    url: '/admin/product/baseTrademark/update',
    method: 'put',
    data
  })
}

// 删除品牌
export const deleteBrand = (id) => {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
}