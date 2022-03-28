import request from '@/utils/request'

// 获取sku列表
export const getSku = (page, limit) => {
  return request({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get'
  })
}

// 上架
export const upSku = (skuId) => {
    return request({
        url: `/admin/product/onSale/${skuId}`,
        method: 'get'
    })
}

// 下架
export const downSku = (skuId) => {
    return request({
        url: `/admin/product/cancelSale/${skuId}`,
        method: 'get'
    })
}

// 获取sku详情
export const getSkuInfo = (skuId) => {
    return request({
        url: `/admin/product/getSkuById/${skuId}`,
        method: 'get'
    })
}