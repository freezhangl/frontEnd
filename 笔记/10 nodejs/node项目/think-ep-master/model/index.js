// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

// 基本模型
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const Model = {}

const sequelize = new Sequelize(
  global.Config('database.database'),
  global.Config('database.username'),
  global.Config('database.password'),
  global.Config('database.options'),
)

fs
  .readdirSync(__dirname)
  .filter((file) =>
    file != 'index.js'
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    Model[model.name] = model;
  })

Model.sequelize = sequelize;
Model.Sequelize = Sequelize;

module.exports = Model;