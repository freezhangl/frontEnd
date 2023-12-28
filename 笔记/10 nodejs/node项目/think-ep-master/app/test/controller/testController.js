// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

const TestDao = require("../dao/TestDao");
const TestValidate = require('../validate/TestValidate');
const CustomParameterException = require('../../../core/exceptions/CustomParameterException');
const NodeMailerService = require('../../../core/services/NodeMailerService');
const JwtService = require('../../../core/services/JwtService');
const RedisCache = require('../../../core/caches/RedisCache');
const FileService = require('../../../core/services/FileService');
const QrcodeService = require('../../../core/services/QrcodeService');
const Md5Service = require('../../../core/services/Md5Service');
const CaptchaService = require('../../../core/services/CaptchaService');

/**
 * test控制器
 */
module.exports = {

  sessionGet(req, res){
    let data = {
      a:req.session["userId"],
    }
    // 返回结果
    res.send(data);
  },

  sessionSet(req, res){
    req.session["userId"] = 888888111555;
    let data = {
      a:'设置成功'
    }
    // 返回结果
    res.send(data);
  },


  /**
   * get方法测试
   * @param {*} req 
   * @param {*} res 
   */
  async testGet(req, res) {
    // console.log(global.Config('app.port'))
    // redis缓存
    // let r = await RedisCache.set('name1','111',20);
    // console.log('r',r);
    // let rg = await RedisCache.get('name1');
    // console.log('rg',rg);
    // console.log('req.user.id',req.user.id)

    // 参数验证
    // TestValidate.update(req, res)
    // 查询字符串的形式获取参数
    let param = req.query;
    // 处理数据
    // let data = await TestDao.getTest(param)
    let data = {
      a:66666666666,
    }
    // console.log(data)
    // 返回结果
    res.send(data);
  },


  /**
   * post方法测试
   * @param {*} req 
   * @param {*} res 
   */
  async testPost(req, res) {
    let body = req.body;
    console.log('222222', body)
    var data = {
      "data": "这是测试控制器的post方法"
    }
    res.send(data);
  },

  /**
   * 测试自定义异常
   * @param {*} req 
   * @param {*} res 
   */
  async excep(req, res) {
    if (true) {
      throw new CustomParameterException()
    }
  },

  /**
   * 上传文件测试
   * @param {*} req 
   * @param {*} res 
   */
  async upload(req, res) {
    // 上传文件测试,上传的文件信息
    let data = await FileService.upload(req, 'file', 'a/b');
    if (!data) {
      data = '上传失败'
    }
    console.log('data', data)
    res.send({ status: 200, message: '文件上传成功', date: data });
  },

  /**
   * 上传文件测试
   * @param {*} req 
   * @param {*} res 
   */
  async qrcode(req, res) {
    // 上传文件测试,上传的文件信息
    let type = true;
    let code = await QrcodeService.qrcode('http://taobao.com', type);

    if (!type) {
      res.writeHead(200, { 'Content-Type': 'image/png;charset=UTF-8' });
      code.pipe(res);
    } else {
      res.send({ status: 200, message: 'base64二维码', date: code });
    }
  },

  /**
   * 生成token
   * @param {*} req 
   * @param {*} res 
   */
  async jwtSetToken(req, res) {
    // 生成token
    let result = await JwtService.createToken();
    let data = {
      token: result,
    }
    res.send(data);
  },

  /**
   * 检验token
   * @param {*} req 
   * @param {*} res 
   */
  async jwtCheckToken(req, res) {
    let tk = await JwtService.createToken()
    let result = await JwtService.varifyToken(tk);
    console.log('tk', result)
    let data = {
      token: result,
    }
    res.send(data);
  },

  /**
   * 发送邮件
   * @param {*} req 
   * @param {*} res 
   */
  async sendEmail(req, res) {
    console.log(11111111)
    let to = '3228985941@qq.com';
    let title = '邮件标题';
    let content = '邮件内容';
    let result = await NodeMailerService.sendEMail(to, title, content)
    console.log('email', result)
    let data = {
      token: result,
    }
    res.send(data);
  },

  /**
   * 加密测试
   * @param {*} req 
   * @param {*} res 
   */
  async encry(req, res) {
    let m5 = await Md5Service.md5('http://taobao.com111');
    console.log('11f2405603bbbedcee85ea01a0a736a6', m5 == '11f2405603bbbedcee85ea01a0a736a6')
    res.send({ status: 200, message: '加密结果', date: m5 });
  },

  /**
   * 测试统一响应方法
   * @param {*} req 
   * @param {*} res 
   */
  async resp(req, res) {
    let t = new TestDao()
    let data = await TestDao.te()
    res.resSuccess(data, '成功');
    // res.resFail('hahaha',8)

  },

  /**
   * 测试生成验证码方法
   * @param {*} req 
   * @param {*} res 
   */
  async captcha(req, res) {
    // {'text':'文本','data':'svg验证码图片'}
    let t = await CaptchaService.captcha()
    res.resSuccess(t, '成功');
  }



}