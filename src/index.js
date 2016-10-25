const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const isStyled = require('./utils/styled').isStyled
const isHelper = require('./utils/styled').isHelper
const isStyledImport = require('./utils/styled').isStyledImport

const wrapSelector = require('./utils/general').wrapSelector
const wrapKeyframes = require('./utils/general').wrapKeyframes
const fixIndentation = require('./utils/general').fixIndentation

const getTTLContent = require('./utils/tagged-template-literal.js').getTaggedTemplateLiteralContent
const parseImports = require('./utils/parse').parseImports
const getSourceMap = require('./utils/parse').getSourceMap

// TODO Fix ampersand in selectors
// TODO ENFORCE THESE RULES
// value-no-vendor-prefix – don't allow vendor prefixes
// property-no-vendor-prefix – don't allow vendor prefixes

const ignoredRules = [
  // Don't throw if there's no styled-components in a file
  'no-empty-source',
  // We don't care about end-of-source newlines, users cannot control them
  'no-missing-end-of-source-newline',
]

const sourceMapsCorrections = {}

module.exports = (/* options */) => ({
  // Get string for stylelint to lint
  code(input, filepath) {
    const absolutePath = path.resolve(process.cwd(), filepath)
    sourceMapsCorrections[absolutePath] = {}
    const ast = babylon.parse(input, {
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
        'dynamicImport',
      ],
    })

    let extractedCSS = ''
    let importedNames = {
      default: 'styled',
      css: 'css',
      keyframes: 'keyframes',
      injectGlobal: 'injectGlobal',
    }
    traverse(ast, {
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
        extractedCSS += wrappedContent
        // Save source location, merging existing corrections with current corrections
        sourceMapsCorrections[absolutePath] = Object.assign(
          sourceMapsCorrections[absolutePath],
          getSourceMap(extractedCSS, wrappedContent, node.loc.start.line)
        )
      },
    })

    return extractedCSS
  },
  // Fix sourcemaps
  result(stylelintResult, filepath) {
    const lineCorrection = sourceMapsCorrections[filepath]
    const newWarnings = stylelintResult.warnings.reduce((prevWarnings, warning) => {
      if (ignoredRules.includes(warning.rule)) return prevWarnings
      const correctedWarning = Object.assign(warning, {
        // Replace "brace" with "backtick" in warnings, e.g.
        // "Unexpected empty line before closing backtick" (instead of "brace")
        text: warning.text.replace(/brace/, 'backtick'),
        line: lineCorrection[warning.line],
      })
      prevWarnings.push(correctedWarning)
      return prevWarnings
    }, [])

    return Object.assign(stylelintResult, { warnings: newWarnings })
  },
})
