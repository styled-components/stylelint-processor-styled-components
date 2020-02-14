const traverse = require('@babel/traverse').default

const estreeParse = require('./babylon-parser')

const {
  isStyled,
  isHelper,
  isStyledImport,
  hasAttrsCall,
  getAttrsObject,
  isExtendCall
} = require('../utils/styled')
const {
  wrapSelector,
  wrapKeyframes,
  fixIndentation,
  removeBaseIndentation,
  isStylelintComment
} = require('../utils/general')

const {
  getTaggedTemplateLiteralContent: getTTLContent
} = require('../utils/tagged-template-literal.js')
const { parseImports, getSourceMap } = require('../utils/parse')

const processStyledComponentsFile = (ast, absolutePath, options) => {
  const extractedCSS = []
  let ignoreRuleComments = []
  let importedNames = {
    default: 'styled',
    css: 'css',
    keyframes: 'keyframes',
    injectGlobal: 'injectGlobal',
    createGlobalStyle: 'createGlobalStyle'
  }
  let sourceMap = {}
  const taggedTemplateLocs = []
  const interpolationLines = []
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
      const helper = !options.strict
        ? isHelper(node, importedNames)
        : isHelper(node, [importedNames[options.importName]])
      const processedNode = { ...node }
      if (hasAttrsCall(node)) {
        processedNode.tag = getAttrsObject(node)
      }
      if (
        !helper &&
        !isStyled(processedNode, importedNames[options.importName]) &&
        !isExtendCall(node)
      ) {
        return
      }
      const content = getTTLContent(node, absolutePath)
      if (!content) return

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
      const stylelintCommentsAdded =
        ignoreRuleComments.length > 0
          ? `${ignoreRuleComments.join('\n')}\n${wrappedContent}`
          : wrappedContent
      extractedCSS.push(stylelintCommentsAdded)
      sourceMap = Object.assign(
        sourceMap,
        getSourceMap(extractedCSS.join('\n'), wrappedContent, processedNode.quasi.loc.start.line)
      )
      // Save `loc` of template literals
      taggedTemplateLocs.push({
        wrappedOffset: wrappedContent.indexOf(fixedContent),
        start: node.quasi.loc.start
      })
      // Save dummy interpolation lines
      node.quasi.expressions.forEach((expression, i) => {
        interpolationLines.push({
          start: node.quasi.quasis[i].loc.end.line,
          end: node.quasi.quasis[i + 1].loc.start.line
        })
      })

      /**
       * All queued comments have been added to the file so we don't need to, and actually shouldn't
       * add them to the file more than once
       */
      ignoreRuleComments = []
    }
  })

  return {
    extractedCSS: extractedCSS.join('\n'),
    taggedTemplateLocs,
    interpolationLines,
    sourceMap
  }
}

module.exports = (input, absolutePath, options) => {
  const typedParser =
    absolutePath.endsWith('.ts') || absolutePath.endsWith('.tsx') ? 'typescript' : 'flow'
  const ast = estreeParse(typedParser, options.parserPlugins)(input)
  return processStyledComponentsFile(ast, absolutePath, options)
}
