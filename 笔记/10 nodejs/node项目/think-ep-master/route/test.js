// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

const router = require('express').Router();

// 导入控制器
const TestController = require('../app/test/controller/TestController');
// 导入中间件
const AuthMiddleware = require("../app/test/middleware/AuthMiddleware");
// 导入验证器
const TestValidate = require('../app/test/validate/TestValidate');


/**
 * 请求路由
 */
router.get('/test/sessionGet', TestController.sessionGet);// 测试get方法路由
router.get('/test/sessionSet', TestController.sessionSet);// 测试get方法路由
router.get('/test/get', [AuthMiddleware.auth, TestValidate.add], TestController.testGet);// 测试get方法路由
router.get('/test/get1', TestController.testGet);// 测试get方法路由
router.post('/test/post', TestController.testPost);// 测试post方法路由
router.post('/test/up', TestController.upload);// 测试文件上传
router.post('/test/qrcode', [AuthMiddleware.auth], TestController.qrcode);// 测试二维码
router.get('/test/jwtjwtSetToken', TestController.jwtSetToken);// 生成token
router.get('/test/jwtCheckToken', TestController.jwtCheckToken);// 验证token
router.post('/test/sendEmail', TestController.sendEmail);// 发送邮件
router.get('/test/encry', TestController.encry);// 加密测试
router.get('/test/excep', TestController.excep);// 测试自定义异常
router.get('/test/resp', TestController.resp);// 测试统一响应方法
router.get('/test/captcha', TestController.captcha);// 测试生成验证码的方法


module.exports = router;