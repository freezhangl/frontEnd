const mysql = require('mysql')

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root', 
  password: 'Like1050762931',
  database: 'my_ku',
})

module.exports = db
