const babylon = require('babylon')
const traverse = require('babel-traverse').default
const getTaggedTemplateLiteralContent = require('./utils/tagged-template-literal').getTaggedTemplateLiteralContent
const isStyled = require('./utils/styled').isStyled
const isStyledImport = require('./utils/styled').isStyledImport

const getCSS = (node) => `
.selector {
  ${getTaggedTemplateLiteralContent(node)}
}
`

// TODO add support for injectGlobal, keyframes and css helpers
// TODO Fix sourcemaps in result
// TODO ignore any rules related to selectors or braces
// TODO ENFORCE THESE RULES
// value-no-vendor-prefix – don't allow vendor prefixes
// property-no-vendor-prefix – don't allow vendor prefixes

module.exports = (/* options */) => ({
  // Get string for stylelint to lint
  code(input) {
    const ast = babylon.parse(input, {
      sourceType: 'module',
    })

    let extractedCSS = ''
    let importedName = ''
    traverse(ast, {
      enter(path) {
        if (isStyledImport(path.node)) {
          const defaultSpecifier = path.node.specifiers.filter((specifier) => specifier.type === 'ImportDefaultSpecifier')

          // TODO Make this work for keyframes, injectGlobal and css
          if (!defaultSpecifier) return

          importedName = defaultSpecifier[0].local.name
        }
        if (!importedName || !isStyled(path.node, importedName)) return

        extractedCSS += getCSS(path.node)
      },
    })

    return extractedCSS
  },
  // Fix sourcemaps
  result(stylelintResult) {
    // console.log(stylelintResult)
  },
})
