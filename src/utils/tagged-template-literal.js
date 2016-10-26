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
const interleave = (quasis, expressions) => (
  expressions.reduce((prev, expression, index) => (
    prev.concat(`$${expression.name}`, quasis[index + 1].value.raw)
  ), [quasis[0].value.raw]).join('')
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
