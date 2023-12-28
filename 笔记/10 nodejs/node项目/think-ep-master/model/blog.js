// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

// 测试模型
module.exports = (sequelize, DateTypes) =>
  sequelize.define('Blog', {
    content: {
      type: DateTypes.STRING,
      unique: true
    },
    description: DateTypes.STRING
  }, {
    timestamps: false,
    tableName: 't_blog'
  })

  
  