// 文章的处理函数模块
const path = require('path')
const db = require('../db/index')

// 发布文章的处理函数
exports.addArticle = (req, res) => {
  console.log(req.file)
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')

  // TODO：证明数据都是合法的，可以进行后续业务逻辑的处理
  // 处理文章的信息对象
  const articleInfo = {
    // 标题、内容、发布状态、所属分类的Id
    ...req.body,
    // 文章封面的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章的发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.user.id,
  }

  const sql = `insert into ev_articles set ?`
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('发布新文章失败！')
    res.cc('发布文章成功！', 0)
  })
}
// 获取文章列表数据的处理函数
exports.getArticles = (req, res) => {
  let name = req.body?.name
  let pageSize = req.body.pageSize ||5 // 页大小
  let pageNo = req.body.pageNo ||1 // 当前页
  let start=(pageNo-1)*pageSize; // 起始位置
  // let sql1=`SELECT *  FROM ev_articles WHERE content LIKE '%${name}%' LIMIT ${start},${pageSize}`
  let searchSql1=''
  if(req.body.cateId){
    searchSql1=`and cate_id=${req.body.cateId}`
  }
  let searchSql2=''
  if(req.body.state){
    searchSql2=`and state=${req.body.state}`
  }
  let sql1=`SELECT *  FROM ev_articles where is_delete = 0 ${searchSql1} ${searchSql2} order by id LIMIT ${start},${pageSize}`
  const totalSql = `select count(*) as total from ev_articles where is_delete=0 ${title}`;
  console.log(sql1,'哦发的就')
  db.query(sql1,[start,pageSize],(err,results)=>{
    if (err) return res.cc(err)
    res.send({
      sql1,
      body:req.body,
      status: 0,
      message: '获取文章据成功！',
      data: results,
    })
  })
  // //查询课程列表sql
  // const pageSql = `select * from video where del=0 ${title} order by id limit ${page},${size}`;
  // //查询课程总数的sql
  // const totalSql = `select count(*) as total from video where del=0 ${title}`;

  // db.query(pageSql, (err, pageData) => {
  //   if (err) {
  //     throw new Error(err.message);
  //   }
  //   db.query(totalSql, (err, count) => {
  //     if (err) {
  //       throw new Error(err.message);
  //     }
  //     res.send({
  //       code: 200,
  //       msg: "",
  //       data: {
  //         data: pageData,
  //         total: count[0].total,
  //         pages:0
  //       },
  //     });
  //   });
  // const sql = 'select * from ev_articles where is_delete = 0'
  // db.query(sql, (err, results) => {
  //   if(err) return res.cc(err)
  //   if(results.length === 0) return res.cc('获取文章列表数据失败!')
  //   res.send({
  //     status: 0,
  //     message: '获取文章列表数据成功!',
  //     data: results
  //   })
  // })
}

// 删除文章的处理函数
exports.deleteIcleById = (req, res) => {
  const sql = 'update ev_articles set is_delete = 1 where Id = ?'
  db.query(sql, req.params.id, (err, results) => {
    if(err) return res.cc(err)
    if(results.affectedRows !== 1) return res.cc('删除文章失败!')
    res.cc('删除文章成功!', 0)
  })
}

// 获取文章详情的处理函数
exports.getArticleById = (req, res) => {
  const sql = 'select * from ev_articles where id = ? and is_delete = 0'
  db.query(sql, req.params.id, (err, results) => {
    if(err) return res.cc(err)
    if(results.length !== 1) return res.cc('获取文章详情失败!')
    res.send({
      status: 0,
      message: '获取文章详情成功!',
      data: results[0]
    })
  })
}

// 更新文章信息的处理函数
exports.updateIcleById = (req, res) => {
  const sql = 'update ev_articles set ? where Id = ? and is_delete = 0'
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if(err) res.cc(err)
    if(results.affectedRows !== 1) return res.cc('更新文章信息失败!')
    res.cc('更新文章信息成功!', 0)
  })
}