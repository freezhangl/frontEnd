// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

// 引入依赖
const jwt = require("jsonwebtoken");


/**
 * jsonwebtoken服务
 */
module.exports = class NodeMailerService {

  constructor() { }

  /**
   * 创建token
   * @param {*} data 
   * @param {*} expiresIn 
   * @returns 
   */
  static async createToken(data) {
    let obj = {};
    // 存入token的数据
    obj.data = data || {};
    // token的创建时间             
    obj.iat = global.Config('jwt.jwt_iat');
    // 设定的过期时间
    obj.exp = Math.floor(Date.now() / 1000) + global.Config('jwt.jwt_exp');
    // token签名   
    let token = await jwt.sign(obj, global.Config('jwt.jwt_secret'))
    return token;
  }


  /**
   * 验证token
   * @param {*} token 
   * @returns 
   */
  static async varifyToken(token) {
    let result = null;
    try {
      // data中包含 data加密进去的数据,iat生成事件,exp过期事件
      let data = await jwt.verify(token, global.Config('jwt.jwt_secret'));
      let nowTime = Math.floor(Date.now() / 1000);
      // 没过期的话返回数据
      if (data && nowTime < data.exp) {
        result = data;
      }
    } catch (err) {
      // 解析异常处理
    }
    return result;
  }

}