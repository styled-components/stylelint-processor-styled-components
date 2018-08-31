const babylon = require('@babel/parser')

module.exports = type => input =>
  babylon.parse(input, {
    sourceType: 'module',
    plugins: [
      'jsx',
      type,
      'objectRestSpread',
      ['decorators', { decoratorsBeforeExport: true }],
      'classProperties',
      'exportExtensions',
      'asyncGenerators',
      'functionBind',
      'functionSent',
      'dynamicImport',
      'optionalCatchBinding',
      'optionalChaining'
    ]
  })
