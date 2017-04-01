const isLastLineWhitespaceOnly = require('./general').isLastLineWhitespaceOnly

/**
 * Check if a node is a tagged template literal
 */
const isTaggedTemplateLiteral = (node) => node.type === 'TaggedTemplateExpression'

/**
 * Check if a tagged template literal has interpolations
 */
const hasInterpolations = (node) => !node.quasi.quasis[0].tail

/**
 * Merges the interpolations in a parsed tagged template literals with the strings
 */
const interleave = (quasis, expressions) => {
  let css = ''
  for (let i = 0, l = expressions.length; i < l; i += 1) {
    const prevText = quasis[i].value.raw
    const nextText = quasis[i + 1].value.raw
    const expression = expressions[i]

    css += prevText
    if (isLastLineWhitespaceOnly(prevText)) {
      css += `-styled-mixin: ${expression.name}`
      if (nextText.charAt(0) !== ';') {
        css += ';'
      }
    } else {
      css += `$${expression.name}`
    }
  }
  css += quasis[quasis.length - 1].value.raw
  return css
}

/**
 * Get the content of a tagged template literal
 *
 * TODO Cover edge cases
 */
const getTaggedTemplateLiteralContent = (node) => {
  if (hasInterpolations(node)) {
    return interleave(node.quasi.quasis, node.quasi.expressions)
  } else {
    return node.quasi.quasis[0].value.raw
  }
}

exports.isTaggedTemplateLiteral = isTaggedTemplateLiteral
exports.getTaggedTemplateLiteralContent = getTaggedTemplateLiteralContent
exports.interleave = interleave
