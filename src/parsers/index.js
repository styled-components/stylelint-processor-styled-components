const estreeParse = require('./babylon-parser')
const typescriptParse = require('./typescript-parser')

const traverse = require('babel-traverse').default
const isStyled = require('../utils/styled').isStyled
const isHelper = require('../utils/styled').isHelper
const isStyledImport = require('../utils/styled').isStyledImport

const wrapSelector = require('../utils/general').wrapSelector
const wrapKeyframes = require('../utils/general').wrapKeyframes
const fixIndentation = require('../utils/general').fixIndentation

const getTTLContent = require('../utils/tagged-template-literal.js').getTaggedTemplateLiteralContent
const parseImports = require('../utils/parse').parseImports
const getSourceMap = require('../utils/parse').getSourceMap

const processStyledComponentsFile = (ast) => {
  const extractedCSS = []
  let importedNames = {
    default: 'styled',
    css: 'css',
    keyframes: 'keyframes',
    injectGlobal: 'injectGlobal',
  }
  let sourceMap = {}
  traverse(ast, {
    noScope: true,
    enter({ node }) {
      if (isStyledImport(node)) {
        importedNames = parseImports(node)
        return
      }
      const helper = isHelper(node, importedNames)
      if (!helper && !isStyled(node, importedNames.default)) return
      const content = getTTLContent(node)
      const fixedContent = fixIndentation(content).text
      const wrapperFn = helper === 'keyframes' ? wrapKeyframes : wrapSelector
      const wrappedContent = wrapperFn(fixedContent)
      extractedCSS.push(wrappedContent)
      sourceMap = Object.assign(sourceMap,
                    getSourceMap(extractedCSS.join('\n'), wrappedContent, node.loc.start.line))
    },
  })

  return {
    extractedCSS: extractedCSS.join('\n'),
    sourceMap,
  }
}

module.exports = (input, absolutePath) => {
  let ast = null
  if (absolutePath.endsWith('.ts') || absolutePath.endsWith('.tsx')) {
    ast = typescriptParse(input)
  } else {
    ast = estreeParse(input)
  }
  return processStyledComponentsFile(ast, absolutePath)
}
