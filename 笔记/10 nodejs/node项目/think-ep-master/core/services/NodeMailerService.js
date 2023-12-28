// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

// 引入依赖
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: global.Config('email.host'),
  port: global.Config('email.port'),
  secure: false,
  auth: {
    user: global.Config('email.username'),
    pass: global.Config('email.password'),
  },
});

/**
 * nodemailer邮件发送服务
 */
module.exports = class NodeMailerService {

  constructor() { }

  /**
   * 发送邮件方法
   * @param {*} to 
   * @param {*} title 
   * @param {*} content 
   * @returns 
   */
  static async sendEMail(to, title, content) {
    return await transporter.sendMail({
      from: global.Config('email.username'),
      to: to,
      subject: title, // 邮件标题
      // text: content || '测试邮件文本邮件内容', 
      // html: "<b>测试邮件HTML邮件内容</b>",
      html: content,
    });
  }

}