// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

const InteriorCodeService = require('./InteriorCodeService');

/**
 * 统一的返回结果方法
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = function(req, res, next){

  /**
   * 为res注入成功响应的方法
   * @param {*} data 
   * @param {*} msg 
   * @param {*} code 
   */
	res.resSuccess = (data,msg,code) =>{
    let iData = data;
    let iMsg = msg;
    let iCode = code;
    if(!iCode){
      iCode = InteriorCodeService.REQUEST_OK;
    }
    if(!iMsg){
      iMsg = "请求成功";
    }
    if(!iData){
      iData = [];
    }
    res.json(
    {
      code:iCode,
      msg:iMsg,
      data:iData,
    });
	};

	/**
   * 为res注入失败响应的方法
   * @param {*} msg 
   * @param {*} code 
   */
	res.resFail = (msg,code)=>{
    let iMsg = msg;
    let iCode = code;
    if(!iCode){
      iCode = InteriorCodeService.REQUEST_FAIL;
    }
    if(!iMsg){
      iMsg = "请求失败";
    }
    res.json(
      {
        code: iCode,
        msg: iMsg,
      });
	};
  
  // 给res挂载完统一响应方法后放行
	next();
}

