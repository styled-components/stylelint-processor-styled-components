const estreeParse = require('./babylon-parser')

const traverse = require('babel-traverse').default
const isStyled = require('../utils/styled').isStyled
const isHelper = require('../utils/styled').isHelper
const isStyledImport = require('../utils/styled').isStyledImport
const hasAttrsCall = require('../utils/styled').hasAttrsCall
const getAttrsObject = require('../utils/styled').getAttrsObject
const isExtendCall = require('../utils/styled').isExtendCall
const wrapSelector = require('../utils/general').wrapSelector
const wrapKeyframes = require('../utils/general').wrapKeyframes
const fixIndentation = require('../utils/general').fixIndentation
const removeBaseIndentation = require('../utils/general').removeBaseIndentation
const isStylelintComment = require('../utils/general').isStylelintComment

const getTTLContent = require('../utils/tagged-template-literal.js').getTaggedTemplateLiteralContent
const parseImports = require('../utils/parse').parseImports
const getSourceMap = require('../utils/parse').getSourceMap

const processStyledComponentsFile = (ast, absolutePath, options) => {
  const extractedCSS = []
  let ignoreRuleComments = []
  let importedNames = {
    default: 'styled',
    css: 'css',
    keyframes: 'keyframes',
    injectGlobal: 'injectGlobal'
  }
  let sourceMap = {}
  traverse(ast, {
    noScope: true,
    enter({ node }) {
      if (node.type !== 'Program' && node.leadingComments) {
        node.leadingComments.forEach(comment => {
          if (isStylelintComment(comment.value)) {
            ignoreRuleComments.push(`/*${comment.value}*/`)
          }
        })
      }
      if (isStyledImport(node, options.moduleName)) {
        importedNames = parseImports(node)
        return
      }
      const helper = isHelper(node, importedNames)
      const processedNode = Object.assign({}, node)
      if (hasAttrsCall(node)) {
        processedNode.tag = getAttrsObject(node)
      }
      if (!helper && !isStyled(processedNode, importedNames.default) && !isExtendCall(node)) {
        return
      }
      const content = getTTLContent(node, absolutePath)
      const fixedContent = fixIndentation(content).text
      let wrappedContent
      switch (helper) {
        case 'keyframes':
          // wrap it in a @keyframes block
          wrappedContent = wrapKeyframes(fixedContent)
          break

        case 'injectGlobal':
          // Don't wrap it as it goes in global scope, but put it to
          // base line to avoid indentation errors
          wrappedContent = removeBaseIndentation(fixedContent)
          break

        default:
          // Wrap it in a dummy selector as this is what Styled Components would do
          wrappedContent = wrapSelector(fixedContent)
      }
      const stylelintCommentsAdded = ignoreRuleComments.length > 0
        ? `${ignoreRuleComments.join('\n')}\n${wrappedContent}`
        : wrappedContent
      extractedCSS.push(stylelintCommentsAdded)
      sourceMap = Object.assign(
        sourceMap,
        getSourceMap(extractedCSS.join('\n'), wrappedContent, processedNode.loc.start.line)
      )
      /**
       * All queued comments have been added to the file so we don't need to, and actually shouldn't
       * add them to the file more than once
       */
      ignoreRuleComments = []
    }
  })

  return {
    extractedCSS: extractedCSS.join('\n'),
    sourceMap
  }
}

module.exports = (input, absolutePath, options) => {
  let ast = null
  if (absolutePath.endsWith('.ts') || absolutePath.endsWith('.tsx')) {
    // We import it dynamically in order to be able to not include typescript as a dependency
    // but merely as a devDependency
    // eslint-disable-next-line global-require
    const typescriptParse = require('./typescript-parser')
    ast = typescriptParse(input)
  } else {
    ast = estreeParse(input)
  }
  return processStyledComponentsFile(ast, absolutePath, options)
}
