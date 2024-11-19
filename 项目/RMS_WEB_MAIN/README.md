## 项目说明

- 项目名称： 集中化研发项目管理系统

### 涉及主题色样式的相关配置
页面中的颜色如果需要需要跟随主题色切换，则进行如下配置：
在`src/assets/scss/variable.scss`中配置@mixin指令，随后在页面中使用：
**各子模块的`src/assets/scss/variable.scss`需与MAIN模块的`src/assets/asss/variable.scss`文件保持一致**
1、若`src/assets/asss/variable.scss`里无对应的样式则需先增加，否则直接跳到第2步：
```scss
@mixin background-color($color:$color-blue, $opacity: 1){
    background-color: rgba($color, $opacity);
    [data-theme="blue"] & {
        background-color: rgba($color-blue, $opacity);
    } 
    [data-theme="red"] & {
        background-color: rgba($color-red, $opacity);
    } 
    [data-theme="green"] & {
        background-color: rgba($color-green, $opacity);
    }
}
```
2、页面style中使用：
```scss
<style lang="scss" scoped>
    .div{
        @include background-color();
    }
</style>
```

### 图标涉及主题色的切换
如果UI提供的某个图标的颜色需要跟随主题色进行切换，则需要将图标转换成字体类型，转换后将图标当成字体来使用，这里使用插件svgtofont.js来实现转换：
1、将需要转换的图标放入`src/assets/image/svg`文件夹下；
2、使用node执行根目录下的`svgtofont.js`(VSCode可借助code runner插件快速运行)；
3、第2步执行后`src/assets/svgFont`文件夹中的文件会更新，打开`src/assets/svgFont/index.html`可查看图标的具体使用方式；
4、若svg图标名称为`example.svg`，使用方式如下：
```html
<span class="funcIcon svgfont-example"></span>
<style lang="scss" scoped>
.funcIcon{
    display: inline-block;
    min-width: 44px;
    height: 44px;
    font-size: 44px;
    @include color(); /*将图标的颜色设置为跟随主题色动态切换。*/
}
</style>
```


### 公用组件使用
公用组件的封装统一放置主模块的packages-->common-->selfComponents
步骤：
    1、将封装好的组件放置packages-->common-->selfComponents；
    2、在selfComponents中的index文件进行引入并暴露给其他子模块；
    3、在其他子模块使用时，直接使用组件的name即可；
例如：
    主模块:(packages-->common-->selfComponents-->index)
        import SpTable from './table'
        let components = {}--->加上SpTable
    子模块使用时：
        <sp-table
          :table-data="testData"
          :table-cols="testTableHead"
          :height="'calc(100vh - 400px)'"
          :max-height="'calc(100vh - 400px)'"
          :loading="loading"
          :is-index="true"
          :index-title="'序号'"></sp-table>
        

### dialog组件实现拖拽移动功能说明：
使用dialog组件时，如需实现拖拽移动，则在使用时需要添加"v-dialogDrag"属性，使用方法如下：
<el-dialog  v-dialogDrag></el-dialog> 
功能实现方法分装于（packages-->common-->util-->dialogDrag）


## npm包方式前端开发、调试、发布、部署等注意事项

### 开发

- 在各子模块开发时，请使用主模块统一封装的axios请求方法，避免重复引入axios依赖导致子模块打包体积增大
- 代码入库前需要通过eslint检测，执行npm run lint
- 全局文件的修改需要说明修改原因，充分验证是否影响其他业务模块
- 引入第三方依赖时，需要提前报备评估，避免引入不必要的依赖影响系统性能
- 如果公共组件使用场景不多，不建议全局注册，全局注册组件需要在首屏加载，影响性能
- 开发时尽量抽离组件，减少重复代码
- lodash使用请按需引入：import { xxx, xxx } from 'lodash'
- svg图标建议尽量转换为字体图标，减少http请求次数
- 页面路由使用懒加载方式

### 调试

- 采用npm link方式将子模块挂载到主模块以调试相应子模块，具体方式参见各子模块README.md
- 注意vue.config.js中devServe代理的接口请求地址是否正确

### 发布

- 子模块npm包发布参见子模块README.md
- 子模块npm run build前需要更新package.json中的版本号
- npm publish前不需要每次都执行登录操作，在登录时添加--always-auth即可记录登录状态，可在用户下的.npmrc文件里查看是否记录了登录信息

### 部署

- 子模块npm包发布后，需要在主模块package.json里更新对应版本，然后npm run build
- 部署文件为主模块打包dist文件，每次打包部署均为全量前端代码，故每次打包部署时要注意控制其他子模块版本，切记不要影响到其他子模块
