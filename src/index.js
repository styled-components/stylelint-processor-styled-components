const path = require('path')
const parse = require('./parsers/index')
// TODO Fix ampersand in selectors
// TODO ENFORCE THESE RULES
// value-no-vendor-prefix – don't allow vendor prefixes
// property-no-vendor-prefix – don't allow vendor prefixes

const ignoredRules = [
  // Don't throw if there's no styled-components in a file
  'no-empty-source',
  // We don't care about end-of-source newlines, users cannot control them
  'no-missing-end-of-source-newline'
]

const sourceMapsCorrections = {}

module.exports = (/* options */) => ({
  // Get string for stylelint to lint
  code(input, filepath) {
    const absolutePath = path.resolve(process.cwd(), filepath)
    sourceMapsCorrections[absolutePath] = {}
    const { extractedCSS, sourceMap } = parse(input, absolutePath)
    // Save source location, merging existing corrections with current corrections
    sourceMapsCorrections[absolutePath] = Object.assign(
      sourceMapsCorrections[absolutePath],
      sourceMap
    )
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
        line: lineCorrection[warning.line]
      })
      prevWarnings.push(correctedWarning)
      return prevWarnings
    }, [])

    if (newWarnings.length === 0) {
      // eslint-disable-next-line no-param-reassign
      stylelintResult.errored = false
    }

    return Object.assign(stylelintResult, { warnings: newWarnings })
  }
})
