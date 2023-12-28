// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

// 导入统一系统错误码
const InteriorCodeService = require('../services/InteriorCodeService');
// 导入异常处理
const CustomParameterException = require('./CustomParameterException');
// 导入日志处理
const LogHelper = require('../logs/LogHelper');


module.exports = (err, req, res, next) => {
  console.log(999)
  /**
   * 处理日志
   */
  LogHelper.errorLogger(req, err, 1)

  // 是否开启错误调试
  if (global.Config(app.debug)) {
    return;
  }

  // 处理各类异常
  if (err instanceof CustomParameterException) { // 参数错误异常处理
    console.log(6666666)
    return res.status(200).json({
      code: err.statusCode || InteriorCodeService.INVALID_PARAMS,
      msg: err.message
    });
  }
  else if (err.status == 404) { // 非法路由处理
    return res.status(200).json({
      code: InteriorCodeService.ILLEGAL_REQUEST,
      msg: '错误的请求'
    });
  }
  else { // 服务器内部错误
    return res.status(200).json({
      code: InteriorCodeService.SYSTEM_ERROR,
      msg: '服务器内部错误',
    });
  }

}