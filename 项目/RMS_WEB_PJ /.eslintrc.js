// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  /*
  下面这些rules是用来设置从插件来的规范代码的规则，使用必须去掉前缀eslint-plugin-
  主要有如下的设置规则，可以设置字符串也可以设置数字，两者效果一致
  "off" -> 0 关闭规则
  "warn" -> 1 开启警告规则
  "error" -> 2 开启错误规则
*/
  rules: {
    eqeqeq: ['error', 'always'], // 强制使用三个等于号
    'semi': 2, // 语句可以不需要分号结尾
    'no-use-before-define': [1, 'nofunc'], // 未定义前不能使用
    'max-lines': ['error', { 'max': 3000, 'skipBlankLines': true }],
    'no-mixed-spaces-and-tabs': 'warn', // 禁止使用空格和tab混合缩进
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }], // promise 以及 数组的链式操作需要另起一行
    // 创建了就不再改变的变量倾向于用const
    // "prefer-const": [
    //   "warn",
    //   {
    //     destructuring: "any",
    //     ignoreReadBeforeAssign: false
    //   }
    // ],
    'vue/attribute-hyphenation': ['error', 'always'], // prop变量使用破折号，而不是驼峰。这里做统一，不然以后全局修改prop有可能碰到要修改不全的情况
    'vue/html-indent': [
      'warn',
      2,
      {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true
      }
    ],
    curly: 2, // 必须使用 if(){} 中的{}
    'vue/prop-name-casing': ['warn', 'camelCase'], //建议使用驼峰命名
    'vue/this-in-template': ['error', 'never'], //不允许在template里面使用this
    'no-trailing-spaces': 1, //一行结束后面不要有空格
    // template里面写的一行多少个prop属性,单行3个，多余3个的必须每行写一个prop，不然不容易看
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'no-catch-shadow': 'error', //禁止catch子句参数与外部作用域变量同名
    'vue/v-bind-style': ['error', 'shorthand'], // 必须使用:来绑定
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 只允许在开发环境中使用debugger
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 0, // 禁止出现未使用过的变量
    'spaced-comment': 0 // 强制在注释中 // 或 /* 使用一致的空格
  }
}
