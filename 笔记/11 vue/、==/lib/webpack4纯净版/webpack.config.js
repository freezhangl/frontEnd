
const path=require('path')
const htmlWebpackPlugin=require('html-webpack-plugin')
module.exports={
    mode:"development",
    entry:path.join(__dirname,'./src/main.js'),
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'bundle.js'
    },
    plugins:[
        new htmlWebpackPlugin({
            template:path.join(__dirname,'./src/index.html'),
            filename:'index.html'
        })
    ],
    module:{
        rules:[
            {test:/\.css$/,use:['style-loader','css-loader']}, //配置css文件loader
            {test:/\.less$/,use:['style-loader','css-loader','less-loader']},//配置less文件loader
            {test:/\.scss$/,use:['style-loader','css-loader','sass-loader']},//配置scss文件loader
            {test:/\.(jpg|png|jpeg|gif|bmp)$/,use:'url-loader?limit=129480&name=[hash:8]-[name].[ext]'},//处理图片路径loader
            { test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader' }, // 处理 字体文件的 loader 
            { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }, // 配置 Babel 来转换高级的ES语法
        ]
    }
}