module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'quote-props':0,
    'vue/valid-template-root':0,
    'vue/no-template-key':0,
    eqeqeq: ['error', 'always'], // 强制使用三个等于号
    'semi': 2, // 语句可以不需要分号结尾
    'no-use-before-define': [1, 'nofunc'], // 未定义前不能使用
    'max-lines': ['error', { 'max': 5000, 'skipBlankLines': true }],
    'no-mixed-spaces-and-tabs': 'warn', // 禁止使用空格和tab混合缩进
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }], // promise 以及 数组的链式操作需要另起一行
    // 创建了就不再改变的变量倾向于用const
    'prefer-const':0,
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
    'no-useless-escape': 0,
    'no-catch-shadow': 'error', //禁止catch子句参数与外部作用域变量同名
    'vue/v-bind-style': ['error', 'shorthand'], // 必须使用:来绑定
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 只允许在开发环境中使用debugger
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 0, // 禁止出现未使用过的变量
    'spaced-comment': 0, // 强制在注释中 // 或 /* 使用一致的空格
    "space-before-function-paren": [0, "always"],//函数定义时括号前面要不要有空格
    "quotes": "off",
    // "indent": ["off", 2],
    // "no-tabs": "off"
  }
}
