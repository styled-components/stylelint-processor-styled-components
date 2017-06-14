const babylon = require('babylon')

module.exports = input =>
  babylon.parse(input, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'flow',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'exportExtensions',
      'asyncGenerators',
      'functionBind',
      'functionSent',
      'dynamicImport'
    ]
  })
