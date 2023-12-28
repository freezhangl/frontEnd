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
// 导入基本异常类
const CustomBaseException = require('./CustomBaseException');

module.exports = class CustomParameterException extends CustomBaseException {
  constructor(message) {
    if (!message) {
      message = '参数错误';
    }
    super(message);
    this.statusCode = InteriorCodeService.INVALID_PARAMS;
  }
}