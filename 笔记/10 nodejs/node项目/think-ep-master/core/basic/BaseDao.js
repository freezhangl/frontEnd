// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

const dbQuery = require('../../model/index').sequelize;
const Op = require('../../model/index').Sequelize.Op;

/**
 * 基本道层用于定义通用的查询方法
 */
module.exports = class BaseDao {

  constructor() { }

  /**
   * 按条件查询
   * @param {*} model 
   * @param {*} where 
   * @param {*} limit 
   * @param {*} order 
   * @param {*} include 
   * @param {*} attributes 
   * @returns 
   */
  static async select(model, where = {}, limit = {}, order = [], include, attributes) {
    if (!model) {
      return false;
    }
    // 查询
    let result = await model.findAndCountAll(await this.queryConditions(where, limit, order, include, attributes));
    // 返回结果对象
    let obj = {}
    if (JSON.stringify(limit) != '{}' && typeof limit.page != 'undefined') {
      obj.pageNum = limit.page;
    }
    if (JSON.stringify(limit) != '{}' && typeof limit.limit != 'undefined') {
      obj.pageSize = limit.limit;
    }
    if (result && typeof result.count != 'undefined') {
      obj.total = result.count;
      obj.rows = result.rows;
    } else {
      obj.total = 0;
      obj.rows = [];
    }
    return obj;
  }

  /**
   * 查询条件处理
   * @param {*} where 
   * @param {*} limit 
   * @param {*} order 
   * @param {*} include 
   * @param {*} attributes 
   * @returns 
   */
  static async queryConditions(where = {}, limit = {}, order = [], include, attributes) {
    // 构建查询条件对象
    let queryCon = {}
    if (where && JSON.stringify(where) != '{}') {
      queryCon.where = where;
    }
    // 每页条数
    if (limit && JSON.stringify(limit) != '{}' && typeof limit.limit != 'undefined') {
      queryCon.limit = parseInt(limit.limit)
    }
    // 当前页码
    if (limit && JSON.stringify(limit) != '{}' && typeof limit.page != 'undefined') {
      queryCon.offset = limit.limit * (limit.page - 1) || 0
    }
    //默认按插入时间进行升序
    if (order && Array.isArray(order) && order.length > 0) {
      queryCon.order = order
    }
    //关联模型
    if (include) {
      queryCon.include = include

      queryCon.distinct = true; // 去重
      queryCon.required = false // 
      // queryCon.raw = true;   // 输出model.attribute='value'
    }
    //筛选属性
    if (attributes) {
      queryCon.attributes = attributes
    }
    return queryCon
  }

  /**
   * 计统数量
   * @param {*} model 
   * @param {*} where 
   * @param {*} limit 
   * @param {*} include 
   * @param {*} attributes 
   * @returns 
   */
  static async count(model, where = {}, limit = {}, include, attributes) {
    if (!model) {
      return false;
    }
    if (!where) {
      return false;
    }
    let result = await model.findAndCountAll(await this.queryConditions(where, limit, order = [], include, attributes));
    if (result && result.count) {
      return result.count;
    } else {
      return 0;
    }
  }


  /**
   * 查找一条数据
   * @param {*} model 
   * @param {*} where 
   * @returns 
   */
  static async find(model, where) {
    if (!model) {
      return false;
    }
    if (!where || JSON.stringify(where) == '{}') {
      return false;
    }
    return await model.findOne({ where: where });
  }

  /**
   * 通过id查找
   * @param {*} model // 模型
   * @param {*} id    // 主键
   * @returns 
   */
  static async findPk(model, id) {
    if (!model) {
      return false;
    }
    if (!id) {
      return false;
    }
    return await model.findByPk(id);
  }

  /**
   * 新增数据
   * @param {*} model 
   * @param {*} obj 
   * @returns 
   */
  static async create(model, obj) {
    if (!model) {
      return false;
    }
    if (!obj || JSON.stringify(obj) == '{}') {
      return false;
    }
    return await model.create(obj);
  }

  /**
   * 更新数据
   * @param {*} model 
   * @param {*} obj 
   * @param {*} where 
   * @returns 
   */
  static async update(model, obj, where) {
    if (!model) {
      return false;
    }
    if (!obj) {
      return false;
    }
    if (!where || JSON.stringify(where) == '{}') {
      return false;
    }
    return await model.update(obj, { where: where });
  }

  /**
   * 通过删除
   * @param {*} model 
   * @param {*} where 
   * @returns 
   */
  static async delete(model, where) {
    if (!model) {
      return false;
    }
    if (!where || JSON.stringify(where) == '{}') {
      return false;
    }
    return await model.destroy({ where: where });
  }

  /**
   * 原生查询(查询数据时可以去下标为0的那个)
   * @param {*} sql 
   * @returns 
   */
  static async query(sql) {
    if (!sql) {
      return false;
    }
    return await dbQuery.query(sql);
  }

}