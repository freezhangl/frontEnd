// const mysql = require('mysql')

// const db = mysql.createPool({
//   host: '127.0.0.1',
//   user: 'root',
//   password: 'admin123',
//   database: 'my_db_01',
// })
// module.exports = db
const mysql = require('mysql')

const db = mysql.createPool({
  host: '124.222.113.11',
  user: 'study-mysql',
  password: 'BiExYLh62Y5F7RAZ',
  database: 'study-mysql',
})

module.exports = db
