// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

// 导入 node 的 crypto 库（node 自带）
const crypto = require('crypto'); 

/**
 * qr-image服务
 */
 module.exports = class Md5Service {

  constructor() { }

  static async md5(str) {
    // 调用加密算法的函数，使用 md5 加密的方式
    let md5 = crypto.createHash('md5'); // 这是一个对象
    // 利用 md5 对象进行加密
    const result = md5.update(str).digest('hex');
    // 返回
    return result; 
  }
}