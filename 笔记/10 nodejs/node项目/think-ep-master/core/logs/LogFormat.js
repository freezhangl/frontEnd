module.exports = class LogFormat {
  constructor() { }
  // // 格式化请求日志
  // static formatReqLog(ctx, time){
  //   let text = '------------request start------------'
  //   let method = ctx.method
  //   text += `request method:  ${method} \n request url: ${ctx.originalUrl } \n`

  //   if(method = 'GET'){
  //       text += `request data: ${JSON.stringify(ctx.query)} \n`
  //   }else{
  //       text += `request data: ${JSON.stringify(ctx.body)} \n`
  //   }
  //   text += `ctx all: ${JSON.stringify(ctx)}`
  //   return text
  // }
  // // 格式化相应日志
  // static formatResLog(ctx,time){
  //   let text = '------------response start------------'
  //   text += `response result: ${JSON.stringify(ctx)} \n`

  //   text += `response all: ${JSON.stringify(ctx)} \n`

  //   text += `response time: ${time} \n`
  //   return text
  // }
  // 格式化错误日志
  static formatErrorLog(ctx, error, time) {
    let text = '------------error start------------'
    // text += this.formatResLog(ctx,time)
    text += `error content: ${JSON.stringify(error)}`
    return text

  }
}