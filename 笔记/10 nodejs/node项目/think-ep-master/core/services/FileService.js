// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

// 引入依赖
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

/**
 * formidable文件处理服务
 */
module.exports = class FileService {

  constructor() { }

  /**
   * 文件上传方法
   * @param {*} req 
   * @param {*} uplaodFile 
   * @param {*} uploadDir 
   * @returns 
   */
  static async upload(req, uplaodFile, uploadDir) {
    uploadDir = uploadDir ? 'public/' + uploadDir : 'public/upload';
    // 如果文件夹不存在则创建
    let status = await this.dirExists(__dirname + '\/..\/..\/' + uploadDir);
    if(!status){
      // todo 生成文件夹失败
      return
    }
    if(!uplaodFile){
      return
    }
    console.log('status',status)
    var form = formidable({ multiples: true });
    // 设置编码
    form.encoding = 'utf-8';
    // 设置上传目录
    form.uploadDir = uploadDir + '/';
    // 保留后缀
    form.keepExtensions = true;
    // 设置最大上传文件大小（默认20M）     
    // form.maxFieldsSize = 2 * 1024 * 1024;     
    return await new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        try {
          if (err) {
            resolve(null);
            return;
          };
          if(JSON.stringify(files) == "{}"){
            resolve(null);
            return;
          }
          // 文件类型
          let mimetype = files[uplaodFile].mimetype
          // 文件大小
          let size = files[uplaodFile].size;
          // 若文件流的键名为uplaodFile，则filename = files.uplaodFile.name
          let filename = files[uplaodFile].originalFilename;
          // 上传的文件名
          let nameArray = filename.split('.');
          // 文件后缀
          let type = nameArray[nameArray.length - 1];
          // 拿原来的文件名
          let name = '';
          for (var i = 0; i < nameArray.length - 1; i++) {
            name = name + nameArray[i];
          }
          // 随机数
          let rand = Math.random() * 100 + 900;
          let num = parseInt(rand, 10);
          // 文件名
          let avatarName = name + num + '.' + type;
          // 保存的新路径
          let newPath = form.uploadDir + avatarName;
          // 移动文件另存
          fs.renameSync(files[uplaodFile].filepath, newPath);
          // 返回值;
          let uplaod_msg = {
            type: type,
            mimetype: mimetype,
            size: size,
            url: newPath.slice(6, newPath.length),
          }
          resolve(uplaod_msg)
          return;
        } catch (err) {
          reject(err);
          return;
        }
      })
    });
  }

  /**
   * 文件下载方法
   */
  static async download() {
    try {
      // 获取文件路径
      let filePath = path.join(__dirname, '../public/upload/' + req.query.name);
      // fs.readFile 和 fs.writeFile有内存限制问题，下载大文件时，会提示"ERR_FS_FILE_TOO_LARGE"，因此大文件采用createReadStream
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.send({
            status: 201,
            message: err
          });
          return;
        }
        // 获取文件大小
        const size = fs.statSync(filePath).size;
        res.writeHead(200, {
          // 告诉浏览器这是一个需要以附件形式下载的文件（浏览器下载的默认行为，前端可以从这个响应头中获取文件名：前端使用ajax请求下载的时候，后端若返回文件流，此时前端必须要设置文件名-主要是为了获取文件后缀，否则前端会默认为txt文件）
          'Content-Disposition': 'attachment; filename=' + encodeURIComponent(req.query.name),
          // 告诉浏览器是二进制文件，不要直接显示内容
          'Content-Type': 'application/octet-stream',
          // 下载文件大小
          'Content-Length': size,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'X-Requested-With',
          'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
          //如果不暴露header，那就Refused to get unsafe header "Content-Disposition"
          "Access-Control-Expose-Headers": 'Content-Disposition'
        });
        fs.createReadStream(filePath).pipe(res);
      })
    } catch (err) {
      res.send({
        status: 201,
        message: err
      })
      return;
    }
  }


  /**
 * 读取路径信息
 * @param {string} path 路径
 */
  static async getStat(path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if (err) {
          resolve(false);
        } else {
          resolve(stats);
        }
      })
    })
  }

  /**
   * 创建路径
   * @param {string} dir 路径
   */
  static async mkdir(dir) {
    return new Promise((resolve, reject) => {
      fs.mkdir(dir, err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
    })
  }


  /**
   * 路径是否存在，不存在则创建
   * @param {string} dir 路径
   */
  static async dirExists(dir) {
    let isExists = await this.getStat(dir);
    //如果该路径且不是文件，返回true
    if (isExists && isExists.isDirectory()) {
      return true;
    } else if (isExists) {     //如果该路径存在但是文件，返回false
      return false;
    }
    //如果该路径不存在
    let tempDir = path.parse(dir).dir;      //拿到上级路径
    //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
    let status = await this.dirExists(tempDir);
    let mkdirStatus;
    if (status) {
      mkdirStatus = await this.mkdir(dir);
    }
    return mkdirStatus;
  }

}