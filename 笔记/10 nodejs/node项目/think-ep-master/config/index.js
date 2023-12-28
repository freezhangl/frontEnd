// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

// 基本配置
const fs = require("fs");
const path = require("path");
const configObj = {}
const config = {}

fs
  .readdirSync(__dirname)
  .filter((file) =>
    file != 'index.js'
  )
  .forEach((file) => {
    let conf = require(path.join(__dirname, file));
    let index = file.lastIndexOf("\.");
    config[file.substring(0, index)] = conf;
  })

/**
 * 此方法用于读取配置文件夹的配置项
 * @param {*} str 
 * @param {*} val 
 * @returns 
 */  
const Conf = (str,val='')=>{
  if(!str || str =='' || !global.configValue){
    return val;
  }
  const arr = str.split('.')
  let obj = JSON.parse(JSON.stringify(global.configValue));
  let flag = 0
  for(let i in arr){
    if(obj[arr[i]] || obj[arr[i]]==''){
      obj = obj[arr[i]];
    }else{
      flag = 1
      break;
    }
  }
  if(flag == 0){
    return obj;
  }else{
    return val;
  }
}

global.configValue = config;
configObj.config = config;
configObj.Conf = Conf;

module.exports = configObj;