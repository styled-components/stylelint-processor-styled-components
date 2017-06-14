const parser = require('typescript-eslint-parser')

module.exports = input => {
  const ast = parser.parse(input, {
    loc: true,
    range: true,
    tokens: true,
    comment: true,
    useJSXTextNode: true,
    ecmaFeatures: { jsx: true }
  })
  delete ast.tokens
  return ast
}
