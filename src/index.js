const path = require('path')
const parse = require('./parsers/index')

const sourceMapsCorrections = {}
const DEFAULT_OPTIONS = {
  moduleName: 'styled-components'
}

module.exports = options => ({
  // Get string for stylelint to lint
  code(input, filepath) {
    const absolutePath = path.resolve(process.cwd(), filepath)
    sourceMapsCorrections[absolutePath] = {}
    const { extractedCSS, sourceMap } = parse(
      input,
      absolutePath,
      Object.assign({}, DEFAULT_OPTIONS, options)
    )
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
    const warnings = stylelintResult.warnings.map(warning =>
      Object.assign({}, warning, {
        // Replace "brace" with "backtick" in warnings, e.g.
        // "Unexpected empty line before closing backtick" (instead of "brace")
        text: warning.text.replace(/brace/, 'backtick'),
        line: lineCorrection[warning.line]
      })
    )

    return Object.assign({}, stylelintResult, { warnings })
  }
})
