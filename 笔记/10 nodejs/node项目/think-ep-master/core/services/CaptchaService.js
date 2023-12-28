// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

// 导入
const svgCaptcha = require('svg-captcha')

/**
 * svg-captcha图片验证码服务
 */
module.exports = class CaptchaService {

  constructor() { }

  static async captcha(str) {
    // 下面这行代码是随机生成验证码图片和文本并返回给客户端 
    const img = await svgCaptcha.create({
      size: 6, // 验证码长度
      ignoreChars: '0o1i', // 验证码字符中排除 0o1i
      color: true, // 验证码是否有彩色
      noise: 3, //干扰线
      background: '#666' // 背景颜色
    })
    // 返回
    return img;
  }
}