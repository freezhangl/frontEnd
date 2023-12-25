import request from '@/utils/request'
// 分类：获取文章分类
export const artGetChannelsService = () => request.get('/my/cate/list')
// 分类：添加文章分类
export const artAddChannelService = (data) => request.post('/my/cate/add', data)
// 分类：编辑文章分类
export const artEditChannelService = (data) =>
  request.put('/my/cate/info', data)
// 分类：删除文章分类
export const artDelChannelService = (id) => {
  request.delete(`/my/cate/del/${id}`)
}

// 文章：获取文章列表
export const artGetListService = (data) =>
  request.post('/my/article/list', data)

// 文章：添加文章
// 注意：data需要是一个formData格式的对象
export const artPublishService = (data) => request.post('/my/article/add', data)

// 文章：获取文章详情
export const artGetDetailService = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })

// 文章：编辑文章接口
export const artEditService = (data) => request.post('/my/article/edit', data)

// 文章：删除文章接口
export const artDelService = (id) =>
  request.post('/my/article/del', id, {
    params: { id: id.id }
  })

// 文章：删除文章接口
export const artdown = (id) =>
  request.post('/my/article/down', id, {
    responseType: 'blob'
  })
