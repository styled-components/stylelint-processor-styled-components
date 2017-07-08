const nextNonWhitespaceChar = require('./general').nextNonWhitespaceChar
const isLastDeclarationCompleted = require('./general').isLastDeclarationCompleted

/**
 * Check if a node is a tagged template literal
 */
const isTaggedTemplateLiteral = node => node.type === 'TaggedTemplateExpression'

/**
 * Check if a tagged template literal has interpolations
 */
const hasInterpolations = node => !node.quasi.quasis[0].tail

/**
 * Merges the interpolations in a parsed tagged template literals with the strings
 */
const interleave = (quasis, expressions) => {
  // Used for making sure our dummy mixins are all unique
  let count = 0
  let css = ''
  for (let i = 0, l = expressions.length; i < l; i += 1) {
    const prevText = quasis[i].value.raw
    const nextText = quasis[i + 1].value.raw

    css += prevText
    let substitute
    if (isLastDeclarationCompleted(css)) {
      /** This block assumes that if you put an interpolation in the position
       * of the start of a declaration that the interpolation will
       * contain a full declaration and not later in the template literal
       * be completed by another interpolation / completed by following text
       * in the literal
       */
      substitute = `-styled-mixin${count}: dummyValue`
      count += 1
      if (nextNonWhitespaceChar(nextText) !== ';') {
        substitute += ';'
      }
    } else {
      /* This block assumes that we are in the middle of a declaration
       * and that the interpolation is providing a value, not a property
       * or part of a property
       */
      substitute = '$dummyValue'
    }
    css += substitute
  }
  css += quasis[quasis.length - 1].value.raw
  return css
}

/**
 * Get the content of a tagged template literal
 *
 * TODO Cover edge cases
 */
const getTaggedTemplateLiteralContent = node => {
  if (hasInterpolations(node)) {
    return interleave(node.quasi.quasis, node.quasi.expressions)
  } else {
    return node.quasi.quasis[0].value.raw
  }
}

exports.isTaggedTemplateLiteral = isTaggedTemplateLiteral
exports.getTaggedTemplateLiteralContent = getTaggedTemplateLiteralContent
exports.interleave = interleave
