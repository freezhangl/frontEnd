// 文章的路由模块

const express = require('express')
const router = express.Router()
const fieldsConfig = [
  {name: 'cover_img', maxCount: 2},
  {name: 'fileList', maxCount: 2}
];

// 导入需要的处理函数模块
const articleHandler = require('../router_handler/article')

// 导入 multer 和 path
const multer = require('multer')
const path = require('path')

// 创建 multer 的实例
const uploads = multer({ dest: path.join(__dirname, '../public/uploads/') })
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { addArticleSchema, articleIdSchema, updateArticleSchema } = require('../schema/article')

// 发布文章的路由
router.post('/add', uploads.fields(fieldsConfig), expressJoi(addArticleSchema), articleHandler.addArticle)



// 导入文章的验证模块
// const { addArticleSchema, articleIdSchema, updateArticleSchema } = require('../schema/article')

// 发布新文章的路由
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
// 获取文章列表数据的路由
router.post('/list', articleHandler.getArticles)
// 删除文章的路由
router.post('/del', articleHandler.deleteIcleById)
// 获取文章详情的路由
router.get('/info', articleHandler.getArticleById)
// router.get('/info', expressJoi(articleIdSchema), articleHandler.getArticleById)
// 更新文章信息的路由
router.post('/edit',uploads.fields(fieldsConfig),articleHandler.updateIcleById)
// router.post('/edit', expressJoi(updateArticleSchema), articleHandler.updateIcleById)

module.exports = router