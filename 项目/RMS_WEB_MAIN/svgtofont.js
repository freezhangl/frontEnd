//安装插件Code Runner
//右键运行
//生成svg字体图标
const svgtofont = require('svgtofont')
const path = require('path')
svgtofont({
  src: path.resolve(process.cwd(), './src/assets/image/svg'), // svg path
  dist: path.resolve(process.cwd(), './src/assets/svgFont'), // output path
  fontName: 'svgfont', // font name
  css: true, // Create CSS files.,
  svgicons2svgfont: {
    fontHeight: 1000,
    normalize: true
  },
  // website = null, 没有演示html文件
  website: {
    title: 'svgfont',
    // Must be a .svg format image.
    logo: path.resolve(process.cwd(), 'svg', 'git.svg'),
    version: '0.1',
    meta: {
      description: 'Converts SVG fonts to TTF/EOT/WOFF/WOFF2/SVG format.',
      keywords: 'svgtofont,TTF,EOT,WOFF,WOFF2,SVG'
    },
    description: ``,
    links: [
      {
        title: 'GitHub',
        url: 'https://github.com/jaywcjlove/svgtofont'
      },
      {
        title: 'Feedback',
        url: 'https://github.com/jaywcjlove/svgtofont/issues'
      },
      {
        title: 'Font Class',
        url: 'index.html'
      },
      {
        title: 'Unicode',
        url: 'unicode.html'
      }
    ],
    footerInfo: `Licensed under MIT. (Yes it's free and <a href="https://github.com/jaywcjlove/svgtofont">open-sourced</a>`
  }
})
  .then(() => {
    // console.log('done!')
  })
