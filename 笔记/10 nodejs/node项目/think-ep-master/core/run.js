// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

const fs = require("fs");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const CustomExceptionHandle = require('./exceptions/CustomExceptionHandle');
const ResponseService = require('./services/ResponseService');

// 加载.env解析文件
const dotoenv = require('./lib/dotoenv')
dotoenv.config({glo:true})
global.Env = dotoenv.Env;

// 创建应用
const app = express();

// 加载配置文件
const config = require('../config');
global.Config = config.Conf;

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'));

//配置 body-parser 中间件 (插件, 专门用来解析表单 POST 请求)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// 引入session
const session = require('./caches/Session');
// 设置统一返回结果方法
app.use(ResponseService)
// 设置session
app.use(session)

/**
 * 在路由加载前配置跨域
 */
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Token,token,Authorization,authorization,X-Requested-With');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Expose-Headers", "*");
  next();
});

// 设置静态文件
app.use(express.static('public'));

/**
 * 扫描路由目录,并挂载路由
 * 可以将一类的路由单独保存在一个文件中
 */
fs
  .readdirSync(path.join(__dirname,"/../route"))
  .forEach((file) => {
    app.use('/', require(path.join(__dirname, "/../route/" + file)));
  })

// 统一异常处理
app.use(CustomExceptionHandle);

// 监听端口并启动
if(global.Config('database.sync')){
  // 自动生成表数据库没有对应表的时候创建
  const { sequelize } = require('../model');
  sequelize.sync().then(()=>{
    app.listen(global.Config('app.port'), function (err) {
      console.log(`hello, 欢迎使用大明构建的thinkEp架构! app is running at: http://localhost:${global.Config('app.port')}`);
      console.log(
          '(♥◠‿◠)ﾉﾞ thinkEp启动成功 ლ(´ڡ`ლ)ﾞ  \n'
      );
    });
  })
}else{
  app.listen(global.Config('app.port'), function (err) {
    console.log(`hello, 欢迎使用大明构建的thinkEp架构! app is running at: http://localhost:${global.Config('app.port')}`);
    console.log(
        '(♥◠‿◠)ﾉﾞ thinkEp启动成功 ლ(´ڡ`ლ)ﾞ  \n'
    );
  });
}

module.exports = app;