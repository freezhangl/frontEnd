// +----------------------------------------------------------------------
// | User: DaMing
// +----------------------------------------------------------------------
// | Email: 3228985941@qq.com
// +----------------------------------------------------------------------
// | Date: 2022
// +----------------------------------------------------------------------

'use strict',

  module.exports = {
    // +----------------------------------------------------------------
    // | HTTP状态码
    // +----------------------------------------------------------------
    HTTP_CONTINUE: 100,                      // 继续，客户端应继续其请求
    HTTP_SWITCHING_PROTOCOLS: 101,           // 切换协议
    HTTP_OK: 200,                            // 请求成功，一般用于GET和POST请求
    HTTP_CREATED: 201,                       // 已创建。成功请求并创建了新的资源
    HTTP_ACCEPTED: 202,                      // 已接受。已经接受请求，但未处理完成
    HTTP_NON_AUTHORITATIVE_INFORMATION: 203, // 非授权信息。请求成功。但返回的meta信息不在原始的服务器，而是一个副本
    HTTP_NO_CONTENT: 204,                    // 无内容。服务器成功处理，但未返回内容。在未更新网页的情况下，可确保浏览器继续显示当前文档
    HTTP_RESET_CONTENT: 205,                 // 重置内容。服务器处理成功，用户终端（例如：浏览器）应重置文档视图。可通过此返回码清除浏览器的表单域
    HTTP_PARTIAL_CONTENT: 206,               // 部分内容。服务器成功处理了部分GET请求
    HTTP_MULTIPLE_CHOICES: 300,              // 多种选择。请求的资源可包括多个位置，相应可返回一个资源特征与地址的列表用于用户终端（例如：浏览器）选择
    HTTP_MOVED_PERMANENTLY: 301,             // 永久移动。请求的资源已被永久的移动到新URI，返回信息会包括新的URI，浏览器会自动定向到新URI。今后任何新的请求都应使用新的URI代替
    HTTP_FOUND: 302,                         // 临时移动。与301类似。但资源只是临时被移动。客户端应继续使用原有URI
    HTTP_SEE_OTHER: 303,                     // 查看其它地址。与301类似。使用GET和POST请求查看
    HTTP_NOT_MODIFIED: 304,                  // 未修改。所请求的资源未修改，服务器返回此状态码时，不会返回任何资源。客户端通常会缓存访问过的资源，通过提供一个头信息指出客户端希望只返回在指定日期之后修改的资源
    HTTP_USE_PROXY: 305,                     // 使用代理。所请求的资源必须通过代理访问
    HTTP_UNUSED: 306,                        // 已经被废弃的HTTP状态码
    HTTP_TEMPORARY_REDIRECT: 307,            // 临时重定向。与302类似。使用GET请求重定向
    HTTP_BAD_REQUEST: 400,                   // 客户端请求的语法错误，服务器无法理解
    HTTP_UNAUTHORIZED: 401,                  // 请求要求用户的身份认证
    HTTP_FORBIDDEN: 403,                     // 服务器理解请求客户端的请求，但是拒绝执行此请求
    HTTP_NOT_FOUND: 404,                     // 服务器无法根据客户端的请求找到资源（网页）
    HTTP_METHOD_NOT_ALLOWED: 405,            // 客户端请求中的方法被禁止
    HTTP_NOT_ACCEPTABLE: 406,                // 服务器无法根据客户端请求的内容特性完成请求
    HTTP_PROXY_AUTHENTICATION_REQUIRED: 407, // 请求要求代理的身份认证，与401类似，但请求者应当使用代理进行授权
    HTTP_REQUEST_TIME_OUT: 408,              // 服务器等待客户端发送的请求时间过长，超时
    HTTP_CONFLICT: 409,                      // 服务器完成客户端的 PUT 请求时可能返回此代码，服务器处理请求时发生了冲突
    HTTP_GONE: 410,                          // 客户端请求的资源已经不存在。410不同于404，如果资源以前有现在被永久删除了可使用410代码，网站设计人员可通过301代码指定资源的新位置
    HTTP_LENGTH_REQUIRED: 411,               // 服务器无法处理客户端发送的不带Content-Length的请求信息
    HTTP_PRECONDITION_FAILED: 412,           // 客户端请求信息的先决条件错误
    HTTP_REQUEST_ENTITY_TOO_LARGE: 413,      // 由于请求的实体过大，服务器无法处理，因此拒绝请求。为防止客户端的连续请求，服务器可能会关闭连接。如果只是服务器暂时无法处理，则会包含一个Retry-After的响应信息
    HTTP_REQUEST_URI_TOO_LARGE: 414,         // 请求的URI过长（URI通常为网址），服务器无法处理
    HTTP_UNSUPPORTED_MEDIA_TYPE: 415,        // 服务器无法处理请求附带的媒体格式
    HTTP_REQUESTED_RANGE_NOT_SATISFIABLE: 416, // 客户端请求的范围无效
    HTTP_EXPECTATION_FAILED: 417,            // 服务器无法满足Expect的请求头信息
    HTTP_INTERNAL_SERVER_ERROR: 500,         // 服务器内部错误，无法完成请求
    HTTP_NOT_IMPLEMENTED: 501,               // 服务器不支持请求的功能，无法完成请求
    HTTP_BAD_GATEWAY: 502,                   // 作为网关或者代理工作的服务器尝试执行请求时，从远程服务器接收到了一个无效的响应
    HTTP_SERVICE_UNAVAILABLE: 503,           // 由于超载或系统维护，服务器暂时的无法处理客户端的请求。延时的长度可包含在服务器的Retry-After头信息中
    HTTP_GATEWAY_TIME_OUT: 504,              // 充当网关或代理的服务器，未及时从远端服务器获取请求
    HTTP_VERSION_NOT_SUPPORTED: 505,         // 服务器不支持请求的HTTP协议的版本，无法完成处理


    // +----------------------------------------------------------------
    // | 系统内部错误码，自定义
    // +----------------------------------------------------------------
    REQUEST_OK: 0,                   // 请求成功
    REQUEST_FAIL: 1,                 // 请求失败
    SYSTEM_ERROR: 9999,              // 系统错误
    ILLEGAL_REQUEST: 9600,           // 非法请求
    RUNTIME_ERROR: 9500,             // 运行时错误
    DOMAIN_NOT_ALLOW: 9000,          // 域名不符合接收方
    TOKEN_EXPIRED: 1001,             // 签名过期
    TOKEN_INVALID_ARGUMENT: 1002,    // 缺少签名
    TOKEN_SIGNATURE_INVALID: 1003,   // 签名错误
    TOKEN_BEFORE_VALID: 1004,        // 签名未生效
    INVALID_PARAMS: 1005,            // 参数错误
    MODEL_NOT_FOUND: 1006,           // 模型异常
    DATA_NOT_FOUND: 1007,            // 数据不存在
    DB_ERROR: 1008,                  // 数据库异常
    PASSWORD_INVALID: 1009,          // 密码错误
    MODEL_UPDATE_FAILED: 1010,       // 模型更新失败
    VALIDATE_FAILED: 1011,           // 参数有效性效验失败
    REQUEST_FAILED: 1012,            // 请求错误
  }