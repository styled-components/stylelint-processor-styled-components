exports.isCausedBySubstitution = (warning, line, interpolationLines) =>
  interpolationLines.some(({ start, end }) => {
    if (line > start && line < end) {
      // Inner interpolation lines must be
      return true
    } else if (line === start) {
      return ['value-list-max-empty-lines', 'comment-empty-line-before'].indexOf(warning.rule) >= 0
    } else if (line === end) {
      return ['comment-empty-line-before', 'indentation'].indexOf(warning.rule) >= 0
    } else {
      return false
    }
  })
