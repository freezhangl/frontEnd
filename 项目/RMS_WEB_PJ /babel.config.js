const env = process.env.NODE_ENV

module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset',
      {
        useBuiltIns: 'entry',
        polyfills: [
          'es6.promise',
          'es6.symbol',
          'es7.object.entries',
          'es7.array.includes',
          'es7.symbol.async-iterator'
        ]
      }]
  ],
  'plugins': env === 'production' ? ['transform-remove-debugger'] : []
}
