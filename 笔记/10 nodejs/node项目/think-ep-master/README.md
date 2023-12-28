# thinkEp架构



# 简介

thinkEp是使用javascript编写的后端服务架构，主要express框架node框架服务进行封装，采用分层的思想进行封装，层次分明，架构清晰。是一个与主流后端语言架构更为接近的架构形式。

## **主要使用到以下技术:**

```
express (node框架)
body-parser (解析post请求参数)
nodemon (热启动刷新)
sequelize (数据库orm操作)
mysql2 (mysql数据库连接池)
joi (用于验证层)
redis (nosql数据存储)
nodemailer (发送邮件服务)
jsonwebtoken (jwt签名)
formidable (文件上传)
qr-image (二维码)
...
```



# 项目启动

```
1：下载项目到本地
git clone https://gitee.com/damingstore/think-ep.git

2：cd 到项目目录
cd think-ep

3：安装依赖 
npm install

4：启动服务 
node server.js 或者 npm start
```



# 目录结构

```
├── thinkEp/
    ├── app(应用文件夹：可以创建多应用)
    ├──├── index(index应用) 
    ├──├── text(text应用) 
    ├── config(配置文件夹：配置文件自动加载后挂载在global中,可以通过global.Config[文件名][属性])
    ├──├── app.js(app配置文件) 
    ···
    ├── core(核心文件夹)
    ├──├── cache(缓存文件夹) 
    ├──├── exceptions(异常文件夹) 
    ├──├── lib(核心库文件夹) 
    ├──├── logs(日志文件夹) 
    ├──├── services(服务文件夹) 
    ├──├── run.js(启动文件) 
    ├── model(模型文件夹：自动加载和扫描)
    ├──├── index.js(自动加载扫描核心逻辑) 
    ···
    ├── public(静态文件夹)
    ├── route(路由文件夹：自动扫描加载路由)
   	├──├── index.js(路由文件)
    ···
    ├── runtime(运行日志文件夹)
    ├── .env(环境配置文件)
    ├── .env.example(环境配置文件样例)
    ├── .gitignore(git忽略文件)
    ├── LICENSE(协议MIT)
    ├── package-lock.json(依赖配置)
    ├── package.json(依赖配置)
    ├── README.md(说明和文档)
    ├── server.js(入口文件)
```



# 开发计划

```
1、自动加载配置文件          -ok
2、env环境配置文件加载       -ok
3、路由层自动加载            -ok
4、自定义异常接管            -ok
5、控制器层                 -ok
5、参数验证层               -ok
6、dao层				     -ok
7、model层				 -ok
8、日志服务                 -ok
9、 集成服务- jwt           -ok
10、集成服务- 文件上传       -ok
11、集成服务- 邮寄发送       -ok
12、集成服务- 二维码         -ok
13、集成服务- soket长连接    -
14、集成服务- MD5加密        -ok
15、集成服务- 分片上传        -
16、集成服务- 图片验证码      -ok
```





