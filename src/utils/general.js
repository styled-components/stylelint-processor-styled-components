// selector count
let count = 0

/**
 * Based on https://github.com/mapbox/stylelint-processor-markdown
 * @author @davidtheclark
 * @author @sindresorhus
 */
const fixIndentation = str => {
  // Get whitespaces
  let match = str.match(/^[ \t]*(?=\S|$)/gm)
  // Remove first, empty item
  match.splice(0, 1)
  // Remove empty lines
  match = match.map(x => (x.length < match[match.length - 1].length ? '  ' : x))

  if (!match) {
    return {
      text: str,
      indentColumns: 0
    }
  }

  // Get the minimum amount of indentation
  const indent = Math.min(...match.map(x => x.length))
  const re = new RegExp(`^[ \\t]{${indent}}`, 'gm')

  return {
    // Remove the min indentation from every line
    text: indent > 0 ? str.replace(re, '') : str,
    indentColumns: indent
  }
}

/**
 * Checks if last line of text has whitespaces only
 */
const isLastLineWhitespaceOnly = text => {
  for (let i = text.length - 1; i >= 0; i -= 1) {
    const char = text.charAt(i)
    if (char === '\n') {
      return true
    }
    if (char !== '\t' && char !== ' ') {
      return false
    }
  }
  return false
}

// eslint-disable-next-line no-return-assign
const wrapSelector = content => `.selector${(count += 1)} {${content}}\n`
const wrapKeyframes = content => `@keyframes {${content}}\n`

exports.wrapKeyframes = wrapKeyframes
exports.wrapSelector = wrapSelector
exports.fixIndentation = fixIndentation
exports.isLastLineWhitespaceOnly = isLastLineWhitespaceOnly
