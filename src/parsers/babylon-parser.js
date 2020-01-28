const babylon = require('@babel/parser')

module.exports = (type, plugins) => input =>
  babylon.parse(input, {
    sourceType: 'module',
    plugins: [type].concat(
      plugins || [
        'jsx',
        ['decorators', { decoratorsBeforeExport: true }],
        'classProperties',
        'exportExtensions',
        'functionBind',
        'functionSent'
      ]
    )
  })
