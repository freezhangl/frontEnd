// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

module.exports = {
  // jwt加密密钥
  jwt_secret: 'think-ep',
  // 容错时间(秒)，宽限期
  jwt_leeway: 60,
  // 声明算法 RS256|HS256|ES256|HS384|HS512|RS384|RS512
  jwt_alg: 'HS256',
  // jwt签发者
  jwt_iss: 'http://think-ep.com',
  // 接收jwt方
  jwt_aud: 'http://think-ep.com',
  // jwt签发时间
  jwt_iat: Math.floor(Date.now() / 1000),
  // jwt生效时间
  jwt_nbf: Math.floor(Date.now() / 1000),
  // token过期时间(秒)
  jwt_exp: 7200,
  // refresh_token过期时间(秒)
  jwt_refresh_exp: 604800,
}