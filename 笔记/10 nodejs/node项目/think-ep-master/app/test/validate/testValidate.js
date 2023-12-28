// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

const Joi = require("joi");

/**
 *  test验证器
 * 参数验证器可以挂载在中间件的位置也可以放在控制器
 */
module.exports = {
  /**
   * 添加数据验证
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  add(req, res, next) {
    // 验证参数
    let data = {
      content: req.query.content,
    }
    // 验证规则
    let schema = {
      content: Joi.string().required(),
    }
    // 验证
    let { error, value } = Joi.validate(data, schema);
    // 处理验证结果
    if (error) {
      res.send({
        code: 400,
        msg: error.details[0].message
      })
    } else {
      if (next) next();
    }
  },

  /**
   * 更新数据验证
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  update(req, res, next) {
    // 验证参数
    let data = {
      description: req.query.description,
    }
    // 验证规则
    let schema = {
      description: Joi.string().required()
    }
    // 验证
    let { error, value } = Joi.validate(data, schema);
    // 处理验证结果
    if (error) {
      res.send({
        code: 400,
        msg: error.details[0].message
      })
    } else {
      if (next) next();
    }
  }
}