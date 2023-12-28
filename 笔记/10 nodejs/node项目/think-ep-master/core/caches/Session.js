// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022-2023
// +----------------------------------------------------------------------

'use strict';

const Session = require('express-session')

// 初始换session
const session = Session({
  secret: global.Config('cache.session.secret'),
  resave: global.Config('cache.session.resave'),
  saveUninitialized: global.Config('cache.session.saveUninitialized'),
})

// 导出session对象
module.exports = session;