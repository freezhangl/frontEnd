// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

const fs = require('fs')
const path = require('path')

const dotoenv = {
  config,
  parse,
  Env
}

var chunkConf = '';
var obj = {}

// 将字符解析为对象
function parse (src) {
  // 转换为字符串
  let lines = src.toString()

  // 将换行符转换为相同格式
  lines = lines.replace(/\r\n?/mg, '\n')

  // 替换调空格replace(/^\s+|\s+$/g, '')
  let arr = lines.split('\n');

  // 过滤空行和注释和句尾注释
  arr.forEach(function( item, index){
    if(item != '' && trim(item).indexOf('#') !=0){
      let i = item.replace(/(^\s*)|(\s*$)/g, "").indexOf('#')
      if(i>0){
        makeForObj(item.replace(/(^\s*)|(\s*$)/g, "").substring(0,i-1));
      }else{
        makeForObj(item)
      }
    }
  });
  return obj
}

// 处理obj成为对象
function makeForObj(item){
  if(trim(item).indexOf('[') == 0 && trim(item)[trim(item).length-1] == ']'){
    let str = trim(item).slice(1,trim(item).length-1).toLowerCase();
    if(obj[str]){
      chunkConf = str
    }else{
      obj[str] = {}
      chunkConf = str
    }
  }else{
    let tempArr = trim(item).split('=')
    if(chunkConf != ''){
      obj[chunkConf][trim(tempArr[0])] = trim(tempArr[1])
    }else{
      obj[trim(tempArr[0])] =trim(tempArr[1])
    }
  }
}

// 去除空格
function trim(char) {
  if (char) {
    return char.replace(/(^\s*)|(\s*$)/g, '');
  }
  return char;
}

function _resolveHome (envPath) {
  return envPath[0] === '~' ? path.join(os.homedir(), envPath.slice(1)) : envPath
}

// 根据配置信息读取.env配置文件
function config (options) {
  let dotenvPath = path.resolve(process.cwd(), '.env')
  let encoding = 'utf8'
  const debug = Boolean(options && options.debug)
  const override = Boolean(options && options.override)
  if (options) {
    if (options.path != null) {
      dotenvPath = _resolveHome(options.path)
    }
    if (options.encoding != null) {
      encoding = options.encoding
    }
  }

  try {
    if (fs.existsSync(dotenvPath)){
      // 将字符解析为对象
       const parsed = dotoenv.parse(fs.readFileSync(dotenvPath, { encoding }))
       if (options && options.glo == true) {
          global.envValue = parsed
       }
       return parsed
    }else{
      return {};
    }
  } catch (e) {
    if (debug) {
      _log(`Failed to load ${dotenvPath} ${e.message}`)
    }
    return { error: e }
  }
}

/**
 * 读取env的方法
 * @param {*} str 
 * @param {*} val 
 * @returns 
 */
function Env(str,val=''){
  if(!str || str =='' || !global.envValue){
    return val;
  }
  const arr = str.split('.')
  let obj = JSON.parse(JSON.stringify(global.envValue));
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
    if(obj == 'true'){ 
      return true;
    }
    if(obj == 'false'){
      return false;
    }
    return obj;
  }else{
    return val;
  }
}

module.exports.config = dotoenv.config
module.exports.parse = dotoenv.parse
module.exports.parse = dotoenv.Env
module.exports = dotoenv
