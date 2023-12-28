// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

module.exports = {
  // 是否开启表同步
  sync: global.Env('database.SYNC', false),
  // 数据库名
  database: global.Env('database.DATABASE', ''),
  // 用户名
  username: global.Env('database.USERNAME', ''),
  // 密码
  password: global.Env('database.PASSWORD', ''),
  // 端口
  options: {
    hostname: global.Env('database.HOSTNAME', '127.0.0.1'),
    hostport: global.Env('database.HOSTPORT', 3306),
    dialect: global.Env('database.TYPE', 'mysql')  // 要连接什么类型的数据库
  }
}