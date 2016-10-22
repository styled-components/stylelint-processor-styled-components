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
const interleave = (quasis) => (
  quasis.reduce((prev, quasi, i) => {
    if (i === 0) {
      return quasi.value.raw.replace(/(\n.*$)/, '\n')
    }
    return prev + quasi.value.raw.replace(/(\n.*$|^.+\n)/, '')
  }, '')
)

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
