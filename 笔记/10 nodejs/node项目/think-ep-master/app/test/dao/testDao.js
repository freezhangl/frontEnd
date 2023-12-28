// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

const Model = require("../../../model")
const BaseDao = require("../../../core/basic/BaseDao")

/**
 * test道层
 */
module.exports = class TestDao extends BaseDao{
  /**
   * 获取getTest
   */
  static async getTest(param) {
    try {
      // 查询数据
      let b = await Model.Blog.findAll()
      let pb = await Model.Blog.findByPk(param.id || 2)
      // 组装数据
      let data = { data: "testGet 获取到的id是" + param.id, val: b, pb: pb }
      // 返回结果
      return data;
    } catch (e) {
      console.log(`同步异常捕捉_error:${e}`);
      // todo 抛出异常由handle统一处理
    }
  }

  static async te() {
    let ob = {
      // "content": "2222222225555555222",
      "description": "更改的"
    }
    // let d = this.create(Model.Blog,ob);

    // let d = this.delete(Model.Blog,{id:3});

    // let d = await this.findPk(Model.Blog,2);
    
    // let d = await this.find(Model.Blog,{content:'2222222225555555222'});

    // let d = this.update(Model.Blog,ob,{id:'2222222225555555222'})


    // let sql = 'select id, content, description from t_blog';
    // let d =  await this.query(sql)
    // let d =  await this.count(Model.Blog,{})
    // console.log('model', Model)


    // foreignKey是括号里面的 sourceKey括号外面的
    Model.Blog.hasMany(Model.Chapter, { foreignKey: 'blog_id', sourceKey:'id' })

    // Model.Blog.hasOne(Model.Chapter, { foreignKey: 'blog_id', sourceKey:'id' })

    // Model.Blog.hasOne(Model.Chapter, { foreignKey: 'blog_id', sourceKey:'id' })
    // Model.Chapter.belongsTo(Model.Blog, { foreignKey: 'id', sourceKey:'blog_id' })
    
    let limit = {page:1,limit:10};

    let includes =  [
      { model:Model.Chapter },
    ]

    let attributes = ['id','content'];



    let d =  await this.select(Model.Blog,{},limit,[],includes,attributes)
    // 关联查询

    console.log(d)
    return d;
  }

}