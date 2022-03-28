import request from '@/utils/request'

// 获取一级分类
export const getFirstSelect = () => {
  return request({
    url: `/admin/product/getCategory1`,
    method: 'get'
  })
}

// 获取二级分类
export const getSecondSelect = (category1Id) => {
    return request({
        url: `/admin/product/getCategory2/${category1Id}`,
        method: 'get'
    })
}

// 获取三级分类
export const getThirdSelect = (category2Id) => {
    return request({
      url: `/admin/product/getCategory3/${category2Id}`,
      method: 'get'
    })
}

// 获取分类信息
export const getSelect = (category1Id, category2Id, category3Id ) => {
    return request({
      url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: 'get'
    })
}

// 添加属性与属性值
export const saveAttr = (data) => {
  return request({
    url: '/admin/product/saveAttrInfo',
    method: 'post',
    data
  })
}

