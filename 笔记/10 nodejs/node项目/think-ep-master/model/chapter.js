// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

// 测试模型
module.exports = (sequelize, DateTypes) =>
  sequelize.define('Chapter', {
    'blog_id': {
      type: DateTypes.STRING,
      unique: true
    },
    'c': DateTypes.STRING
  }, {
    timestamps: false,
    tableName: 't_chapter'
  })

  
  