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

const nextNonWhitespaceChar = text => {
  const matches = text.match(/^\s*([^\s])/)
  if (matches) {
    return matches[1]
  } else {
    return null
  }
}

const reverseString = str => str.split('').reverse().join('')

const isLastDeclarationCompleted = text => {
  const reversedText = reverseString(text)
  const lastNonWhitespaceChar = nextNonWhitespaceChar(reversedText)
  if (
    lastNonWhitespaceChar === ';' ||
    lastNonWhitespaceChar === '}' ||
    lastNonWhitespaceChar === null
  ) {
    return true
  } else {
    return false
  }
}

// eslint-disable-next-line no-return-assign
const wrapSelector = content => `.selector${(count += 1)} {${content}}\n`
const wrapKeyframes = content => `@keyframes {${content}}\n`

/**
 * The reason we put a \s before .* in the last part of the regex is to make sure we don't
 * match stylelint-disable-line and stylelint-disable-next-line or, for now, any future extensions
 * as these line specific disables should not be placed outside a css TTL
 */
const isStylelintComment = comment => /^\s*stylelint-(?:enable|disable)(?:\s.*)?$/.test(comment)

exports.wrapKeyframes = wrapKeyframes
exports.wrapSelector = wrapSelector
exports.fixIndentation = fixIndentation
exports.reverseString = reverseString
exports.nextNonWhitespaceChar = nextNonWhitespaceChar
exports.isLastDeclarationCompleted = isLastDeclarationCompleted
exports.isStylelintComment = isStylelintComment
