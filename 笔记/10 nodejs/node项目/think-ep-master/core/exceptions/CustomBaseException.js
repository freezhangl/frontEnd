// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

const InteriorCodeService = require('../services/InteriorCodeService');

module.exports = class CustomBaseException extends Error {
  constructor(message) {
    if (!message) {
      message = '服务器内部错误';
    }
    super(message);
    this.statusCode = InteriorCodeService.SYSTEM_ERROR;
  }
}