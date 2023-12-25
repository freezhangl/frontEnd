// 文章的处理函数模块
const path = require('path')
const db = require('../db/index')
const fs=require('fs')
// 发布文章的处理函数
exports.addArticle = (req, res) => {
  console.log(req.file,'我是请求的信息')
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')

  // TODO：证明数据都是合法的，可以进行后续业务逻辑的处理
  // 处理文章的信息对象
  const articleInfo = {
    // 标题、内容、发布状态、所属分类的Id
    ...req.body,
    // 文章封面的存放路径
    cover_img: path.join('/public/uploads', req.file.filename),
    // 文章的发布时间
    pub_date: new Date().getTime(),
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
  let title = req.body?.title
  let pagesize = req.body.pagesize || 5 // 页大小
  let pagenum = req.body.pagenum || 1 // 当前页
  let start = (pagenum - 1) * pagesize; // 起始位置
  // let sql1=`SELECT *  FROM ev_articles WHERE content LIKE '%${name}%' LIMIT ${start},${pagesize}`
  let searchSql1 = ''
  if (req.body.cateId) {
    searchSql1 = `and cate_id=${req.body.cateId}`
  }
  let searchSql2 = ''
  if (req.body.state) {
    searchSql2 = `and state=${req.body.state}`
  }
  let searchSql3 = ''
  if(title.length){
    searchSql3 = `and title LIKE '%${title}%'`
  }
  let sql1 = `SELECT *  FROM ev_articles where is_delete = 0 ${searchSql1} ${searchSql2} ${searchSql3} order by pub_date desc LIMIT ${start},${pagesize}`
  const totalSql = `select count(*) as total from ev_articles where is_delete=0 ${searchSql3}`;
  db.query(sql1, [start, pagesize], (err, results) => {
    if (err) return res.cc(err)
    db.query(totalSql, (err, results1) => {
      if (err) return res.cc(err)
      console.log(results1)
      res.send({
        // sql1,
        status: 0,
        message: "获取文章据成功！",
        data: {
          records: results,
          total: results1[0].total,
          // pages: 0
        },
      });
    })
  })
}

// 删除文章的处理函数
exports.deleteIcleById = (req, res) => {
  console.log(req,'你翻翻个1')
  const sql = 'update ev_articles set is_delete = 1 where Id = ?'
  db.query(sql, req.body.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除文章失败!')
    res.cc('删除文章成功!', 0)
  })
}
exports.downById=(req,res)=>{
  console.log(req,'你翻翻个1')
  const sql= `select * from ev_articles where id =?`
  db.query(sql,req.body.id,(err,results)=>{
    if (err) return res.cc(err)
    if (results.length == 1){
      let cover_img=JSON.parse(results[0].cover_img)[0].path
      console.log(path.join(__dirname,'../',cover_img) ,'af刚发的1')
      const readStream = fs.createReadStream(path.join(__dirname,'../',cover_img));
      res.setHeader('Access-Control-Expose-Headers','Content-Disposition');
      res.set({
        'Content-Type': 'application/octet-stream',// 告诉浏览器这是一个二进制文件
        'Content-Disposition': 'attachment; filename=' + JSON.parse(results[0].cover_img)[0].name// 告诉浏览器这是一个需要下载的文件
      });
      readStream.pipe(res);
      readStream.on('finish', () => {
          readStream.close();
      });
    }
  })
}
// 获取文章详情的处理函数
exports.getArticleById = (req, res) => {
  const sql = 'select * from ev_articles where id = ? and is_delete = 0'
  db.query(sql, req.query.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('获取文章详情失败!')
    res.send({
      status: 0,
      message: '获取文章详情成功!',
      data: results[0]
    })
  })
}
// 更新文章信息的处理函数
exports.updateIcleById = (req, res) => {
  console.log(req.files,'分解结构1234')
  req.body={
    ...req.body,
    cover_img:JSON.stringify(req.files.cover_img.map(item=>{
      return {
        name:item.originalname,
        path:path.join('/public/uploads', item.originalname)
      }
    })),
    fileList:JSON.stringify(req.files.fileList.map(item=>{
      return {
        name:item.originalname,
        path:path.join('/public/uploads', item.originalname)
      }
    }))
    // cover_img: path.join('/public/uploads', req.file.originalname),
  }
  req.files.cover_img.forEach(item=>{
    fs.renameSync(item.path,path.join(__dirname,'../public/uploads', item.originalname))
  })
  req.files.fileList.forEach(item=>{
    fs.renameSync(item.path,path.join(__dirname,'../public/uploads', item.originalname))
  })
  const sql = 'update ev_articles set ? where Id = ? and is_delete = 0'
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新文章信息失败!')
    res.cc('更新文章信息成功!', 0)
  })
}