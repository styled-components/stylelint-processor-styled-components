const babylon = require('babylon')
const traverse = require('babel-traverse').default

// TODO ignore any rules related to selectors or braces

const isTTL = (node) => node.type === 'TaggedTemplateExpression'
// TODO Make this dependent on import name
// TODO Make this be any tagname, not just button
const isStyledShorthand = (node) => node.tag && node.tag.object && node.tag.object.name === 'styled' && node.tag.property && node.tag.property.name === 'button'
// TODO Make this dependent on import name
const isStyledCall = (node) => node.tag && node.tag.callee && node.tag.callee.name === 'styled'

const getTTLContent = (node) => node.quasi.quasis[0].value.raw

const isStyled = (node) => isTTL(node) && (isStyledCall(node) || isStyledShorthand(node))

module.exports = (/* options */) => ({
  // Get string for stylelint to lint
  code(input) {
    const ast = babylon.parse(input, {
      sourceType: 'module',
    })
    let extractedCSS = ''
    traverse(ast, {
      enter(path) {
        if (isStyled(path.node)) {
          extractedCSS += `.selector { ${getTTLContent(path.node)} }\n\n`
        }
      },
    })

    return extractedCSS
  },
  // Fix sourcemaps
  result(stylelintResult) {
    console.log(stylelintResult)
  },
})
