const log4js = require('log4js');
const LogFormat = require("./LogFormat");

log4js.configure({
  appenders: {
    console: { type: 'console' },             // 设置控制台输出 （默认日志级别是关闭的（即不会输出日志）
    debug: {                                  // debug日志
      type: 'file',                         // 日志类型 file/dateFile
      filename: 'runtime/logs/debug',       // 首先手动建好目录，写入日志文件的路径
      maxLogSize: 1024,                     // 只在 type: 'file' 中才支持
      pattern: 'yyyy-MM-dd.log',            // 指定pattern后无限备份,pattern精确到ss(秒)就是一秒一个文件,精确到mm(分)就是一分一个文件,hh(小时),dd(天),MM(月),yyyy(年)
      encoding: 'utf-8',                    // 文件的编码
      alwaysIncludePattern: true,           // 不指定pattern时若为true会使用 默认值'.yyyy-MM-dd'
      daysToKeep: 10,                        // 时间文件 保存多少天，以前的log将被删除
      //compress : true,                    //（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
    },
    err: {  //err日志
      type: 'dateFile',
      filename: 'runtime/logs/err',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    info: {  //info日志
      type: 'dateFile',
      filename: 'runtime/logs/info',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    fatal: {  //fatal日志
      type: 'dateFile',
      filename: 'runtime/logs/fatal',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    //appenders:采用的appender,取appenders项,level:设置级别
    default: { appenders: ['console', 'debug', 'err', 'info', 'fatal'], level: 'all' },
    debug: { appenders: ['console', 'debug'], level: 'debug' },
    err: { appenders: ['console', 'err'], level: 'error' },
    info: { appenders: ['console', 'info'], level: 'info' },
    fatal: { appenders: ['console', 'fatal'], level: 'fatal' },
  }
});

module.exports = class LogHelper extends LogFormat {
  constructor() {
    super()
  }

  // // 请求日志
  // static reqLogger(ctx){
  //     log4js.getLogger('reqLogger').info(this.formatReqLog(ctx))
  // }

  // // 相应日志
  // static resLogger(ctx, time){
  //     log4js.getLogger('resLogger').info(this.formatResLog(ctx,time))
  // }

  // 错误日志
  static errorLogger(req, error, time) {
    console.log("----------------------------")
    // console.log(this.formatErrorLog(req,error,time))
    log4js.getLogger('err').error(this.formatErrorLog(req, error, time))
  }

}