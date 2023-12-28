// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

const QRCode=require('qr-image');

/**
 * qr-image服务
 */
 module.exports = class QrcodeService {

  constructor() { }

  /**
   * 生成二维码
   * @param {*} url 
   * @param {*} type 
   * @param {*} size 
   * @param {*} margin 
   * @returns 
   */
  static async qrcode(url,type,size,margin) {
    // 二维码尺寸，输入时为了保证精确性，请确保为21的公倍数，否则按四舍五入处理.
    // 如果为空,默认为5,即尺寸为105*105
    var size = Math.round(size/21) || 5;

    // 白色外边距，输入时为了保证精确性，请确保为5的公倍数，否则按四舍五入处理.
    // 如果为空,默认为2,即尺寸为10
    var margin = Math.round(margin/10) || 2 ;

    // 如果有type参数,返回base64
    if(type){
        var codeStr = QRCode.imageSync( url ,{ type: 'png',size:size, margin:margin});
        var base64='data:image/jpeg;base64,'+ codeStr.toString('base64');
        return base64;
    // 如果没有type参数,返回图片
    }else{
        var code = QRCode.image( url ,{ type: 'png',size:size, margin:margin});
        return code;
    }
  }


}