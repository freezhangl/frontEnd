// 导入定义验证规则的模块
const joi = require('joi')

// 分别定义 标题、分类Id、内容、发布状态的校验规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()

// 验证规则对象 - 发布新文章
exports.addArticleSchema = {
  body: {
    title,
    cate_id,
    content,
    state
  }
} 

// 验证规则对象 - 删除文章 与 获取文章详情
exports.articleIdSchema = {
  params: {
    id: cate_id
  }
}

// 验证规则对象 - 更新文章信息
exports.updateArticleSchema = {
  body: {
    id: cate_id,
    cate_id,
    title,  
    content,
    state
  }
}