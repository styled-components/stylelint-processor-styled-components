const nextNonWhitespaceChar = require('./general').nextNonWhitespaceChar
const isLastDeclarationCompleted = require('./general').isLastDeclarationCompleted
const extrapolateShortenedCommand = require('./general').extrapolateShortenedCommand

/**
 * Check if a node is a tagged template literal
 */
const isTaggedTemplateLiteral = node => node.type === 'TaggedTemplateExpression'

/**
 * Check if a tagged template literal has interpolations
 */
const hasInterpolations = node => !node.quasi.quasis[0].tail

/**
 * Retrieves all the starting and ending comments of a TTL expression
 */
const retrieveStartEndComments = expression =>
  (expression.leadingComments || []).concat(expression.trailingComments || [])

/**
 * Checks if given comment value is an interpolation tag
 */
const isScTag = comment => /^\s*?sc-[a-z]/.test(comment)

/**
 * Checks if an interpolation has an sc comment tag
 */
const hasInterpolationTag = expression => {
  const relevantComments = retrieveStartEndComments(expression).map(
    commentObject => commentObject.value
  )
  return relevantComments.some(isScTag)
}

const extractScTagInformation = comment => {
  const matchArray = comment.match(/^(\s*?)sc-([a-z]+)(?: (.+?)(\s*)$)?/)
  return {
    leadingWhitespace: matchArray[1],
    command: matchArray[2],
    // The following two are only supposed to be cared about if command is 'custom'
    customPlaceholder: matchArray[3],
    trailingWhitespace: matchArray[4]
  }
}

const interpolationTagAPI = [
  'ref',
  'block',
  'selector',
  'declaration',
  'property',
  'value',
  'custom'
]
/**
 * Enact the interpolation tagging API
 */
const parseInterpolationTag = (expression, id, absolutePath) => {
  // We temporarily return a dummyvalue pending complete implemenation
  const relevantComments = retrieveStartEndComments(expression)
  let substitute
  relevantComments.some(comment => {
    if (isScTag(comment.value)) {
      const scTagInformation = extractScTagInformation(comment.value)
      scTagInformation.command = extrapolateShortenedCommand(
        interpolationTagAPI,
        scTagInformation.command,
        absolutePath,
        comment.loc.start
      )
      switch (scTagInformation.command) {
        case 'ref':
        case 'selector':
          substitute = 'div'
          break

        case 'block':
        case 'declaration':
          substitute = `-styled-mixin${id}: dummyValue;`
          break

        case 'property':
          substitute = `-styled-mixin${id}`
          break

        case 'value':
          substitute = '$dummyValue'
          break

        case 'custom':
          // TODO put relevant logic here for whitespace
          substitute = scTagInformation.customPlaceholder
          break

        default:
          throw new Error(
            `ERROR at ${absolutePath} line ${comment.loc.start.line} column ${comment.loc.start
              .column}:` +
              '\nYou tagged a Styled Components interpolation with an invalid sc- tag. Refer to the documentation to see valid interpolation tags'
          )
      }
      return true // Break loop
    }
    return false // Continue loop
  })
  return substitute
}

/**
 * Merges the interpolations in a parsed tagged template literals with the strings
 */
const interleave = (quasis, expressions, absolutePath) => {
  // Used for making sure our dummy mixins are all unique
  let count = 0
  let css = ''
  for (let i = 0, l = expressions.length; i < l; i += 1) {
    const prevText = quasis[i].value.raw
    const nextText = quasis[i + 1].value.raw

    css += prevText
    let substitute
    if (hasInterpolationTag(expressions[i])) {
      substitute = parseInterpolationTag(expressions[i], count, absolutePath)
      count += 1
    } else if (isLastDeclarationCompleted(css)) {
      // No sc tag so we guess defaults
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
const getTaggedTemplateLiteralContent = (node, absolutePath) => {
  if (hasInterpolations(node)) {
    return interleave(node.quasi.quasis, node.quasi.expressions, absolutePath)
  } else {
    return node.quasi.quasis[0].value.raw
  }
}

exports.isTaggedTemplateLiteral = isTaggedTemplateLiteral
exports.getTaggedTemplateLiteralContent = getTaggedTemplateLiteralContent
exports.interleave = interleave
exports.hasInterpolationTag = hasInterpolationTag
exports.parseInterpolationTag = parseInterpolationTag
exports.extractScTagInformation = extractScTagInformation
