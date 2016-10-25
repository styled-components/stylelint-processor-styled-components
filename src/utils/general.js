/**
 * Based on https://github.com/mapbox/stylelint-processor-markdown
 * @author @davidtheclark
 * @author @sindresorhus
 */
const fixIndentation = (str) => {
  const match = str.match(/^[ \t]*(?=\S|$)/gm)
  match.splice(0, 1)

  if (!match) {
    return {
      text: str,
      indentColumns: 0,
    }
  }

  const indent = Math.min(...match.map((x) => x.length))
  const re = new RegExp(`^[ \\t]{${indent}}`, 'gm')

  return {
    text: indent > 0 ? str.replace(re, '') : str,
    indentColumns: indent,
  }
}

const wrapSelector = (content) => `.selector {${content}}\n`
const wrapKeyframes = (content) => `@keyframes {${content}}\n`

exports.wrapKeyframes = wrapKeyframes
exports.wrapSelector = wrapSelector
exports.fixIndentation = fixIndentation
