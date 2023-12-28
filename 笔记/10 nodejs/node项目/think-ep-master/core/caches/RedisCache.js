// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict';

const redis = require('redis');

// 设置为redis缓存的时候连接redis
if(global.Config('cache.type') == 'redis'){
  // 创建客户端
  const redisClient = redis.createClient(
    global.Config('cache.redis.port'), 
    global.Config('cache.redis.host'),
    { auth_pass: global.Config('cache.redis.password') }
  );
  // 连接客户端
  redisClient.connect()
  // 连接成功回调
  redisClient.on('connect', function() {
    console.log('Redis连接成功');
  });
  // 连接失败回调
  redisClient.on('error', function (err) {
    console.log('Redis连接失败' + err);
  });
}

module.exports = class RedisCache{
  /**
   * 设置缓存
   * @param {*} key 主键
   * @param {*} val 值
   * @param {*} exp 过期时间
   * @param {*} nx 布尔值:设置true时库中键不存在才能存储成功
   * @returns 
   */
  static async set(key,val,exp=1000,nx=false){
    // 非redis缓存直接返回null
    if(global.Config('cache.type') != 'redis'){
      return null
    }
    // 进行redis操作
    let objExp = {}
    if(nx) nx = true;
    try {
      if(exp){
        objExp = {
          EX: exp,
          NX: nx
        }
      }
      return await redisClient.set(key, val, objExp);
    } catch (e) {
      console.log(`redis设置缓存异常捕捉Error:${e}`);
    }
  }

  /**
   * 获取缓存
   * @param {*} key 
   * @returns 
   */
  static async get(key){
    // 非redis缓存直接返回null
    if(global.Config('cache.type') != 'redis'){
      return null
    }
    // 进行redis操作
    try {
      return await redisClient.get(key);
    } catch (e) {
      console.log(`redis获取缓存异常捕捉Error:${e}`);
    }
  }
}
