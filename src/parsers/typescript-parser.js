const parser = require('typescript-eslint-parser')
const includeShebang = require('./parser-include-shebang')

module.exports = (input) => {
  const ast = parser.parse(input, {
    loc: true,
    range: true,
    tokens: true,
    comment: true,
    useJSXTextNode: true,
    ecmaFeatures: { jsx: true },
  })
  delete ast.tokens
  ast.comments = includeShebang(input, ast)
  return ast
}
