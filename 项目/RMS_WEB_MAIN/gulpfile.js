var path = require('path')
var gulp = require('gulp')
var cleanCSS = require('gulp-clean-css')
var cssWrap = require('gulp-css-wrap')
/* gulp.task('css-wrap', function () {
  return gulp.src(path.resolve('./src/assets/customTheme/style-green/theme/index.css'))
    // 找需要添加命名空间的css文件，支持正则表达式
    .pipe(cssWrap({
      selector: '.custom-green' //添加的命名空间
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./src/assets/customTheme/green')) //存放的目录
}) */

/* gulp.task('css-wrap', function () {
  return gulp.src(path.resolve('./src/assets/customTheme/style-red/theme/index.css'))
    // 找需要添加命名空间的css文件，支持正则表达式
    .pipe(cssWrap({
      selector: '.custom-red' //添加的命名空间
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./src/assets/customTheme/red')) //存放的目录
}) */

gulp.task('css-wrap', function () {
  return gulp.src(path.resolve('./src/assets/customTheme/style-blue/theme/index.css'))
    // 找需要添加命名空间的css文件，支持正则表达式
    .pipe(cssWrap({
      selector: '.custom-blue' //添加的命名空间
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./src/assets/customTheme/blue')) //存放的目录
})

//https://blog.csdn.net/youlinaixu/article/details/83447527
//gulp css-wrap
