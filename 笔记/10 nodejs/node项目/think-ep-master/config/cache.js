// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

module.exports = {
  // 驱动方式
  type: global.Env('cache.TYPE','session'),
  // redis缓存配置
  redis:{
    // 服务器地址
    host: global.Env('redis.HOSTNAME','127.0.0.1'),
    // 端口
    port: global.Env('redis.PORT','6379'),
    // 密码
    password: global.Env('redis.PASSWORD',''),
    // 数据库 0号数据库
    select: global.Env('redis.SELECT',0),
  },
  // session缓存配置
  session:{
    secret: global.Env('session.SECRET','123456'),
    resave: global.Env('session.RESAVE',true),
    saveUninitialized: global.Env('session.SAVEUNINITIALIZED',true)
  },
  // 默认缓存配置
  default:{

  },

  
}