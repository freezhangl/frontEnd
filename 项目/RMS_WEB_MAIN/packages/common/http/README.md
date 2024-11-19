http 接口工具

1.批量创建接口


```
// API创建接口配置信息
const apiList = [
  {
    name: 'selectList',  //api方法名称
    url: baseUrl + '/test/selectList',//请求URL地址
    method: 'post', //post方法
    config: { loading: false }
  },
  {
    //查看详情
    name: 'detail',
    url: baseUrl + '/test/detail',
    method: 'get/params' //get方法，restful风格,参数拼接在url后面
  }
]

export default Http.createHttpServe(apiList)

```

method说明：
可选值：['get','post','get/params']

config说明：
{
  loading：Boolean, //是否显示加载状态，默认显示，可选参数
  loadingText：String, //接口请求时显示的String,可选参数
  responseType：String, //response数据类型，默认json,可选参数
  responseProp：Array, //配置可见的response属性，默认['data'],可选参数
  filters：Array, //需要过滤的无效参数，默认['', null, 'null', undefined, 'undefined', NaN, 'NaN']，可选参数
  isfilter:Boolean, //是否开启参数过滤,默认开启
} 可传可不传，不传使用默认配置


2.单接口创捷

```
export default {
  getProcUnitList (params) {
    return Http.['get|post|put|delete']('接口地址', params, 'config/说明同上')
      .then(res => {
        return Promise.resolve(res)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
}
```

3.接口异常处理
```
catch(e => {
  if (e.message) {
    this.$message.error('用户列表获取失败，' + e.message)
  } else {
    <!-- console.log(e) -->
  }
})
```
- response.status == 200 接口正常连通时，走if，接口返回的报错信息在message中
- response.status == 401 || 500 || 404 接口无权限或未正常连接时，走else，此时在响应拦截器中已做处理和报错提示，无需再返回到catch中做重复处理和用户提示