const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const isStyled = require('./utils/styled').isStyled
const isHelper = require('./utils/styled').isHelper
const isStyledImport = require('./utils/styled').isStyledImport
const getCSS = require('./utils/general').getCSS
const getKeyframes = require('./utils/general').getKeyframes
const parseImports = require('./utils/parse').parseImports

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
        }

        const helper = isHelper(node, importedNames)

        const addCSSFromNode = (contentGetter) => {
          const css = contentGetter(node)
          extractedCSS += css
          // Save which line in the extracted CSS is which line in the source
          const fullCSSLength = extractedCSS.split(/\n/).length
          const currentCSSLength = css.split(/\n/).length
          const currentCSSStart = (fullCSSLength - currentCSSLength) + 1
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < currentCSSLength + 1; i++) {
            sourceMapsCorrections[absolutePath][currentCSSStart + i] = node.loc.start.line + i
          }
        }

        if (helper === 'keyframes') {
          addCSSFromNode(getKeyframes)
          return
        }

        if (isStyled(node, importedNames.default) || helper === 'css' || helper === 'injectGlobal') {
          addCSSFromNode(getCSS)
          return
        }
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
