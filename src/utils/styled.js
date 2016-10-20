const isTaggedTemplateLiteral = require('./tagged-template-literal').isTaggedTemplateLiteral

/**
 * Check if something is a styled-components import declaration
 */
const isStyledImport = (node) => node.type === 'ImportDeclaration' && node.source.value === 'styled-components'

/**
 * Check if something is a styled shorthand call
 * e.g. styled.div``
 *
 * TODO Lint that the tagname exists
 */
const isStyledShorthand = (node, styledVariableName) => (
  // Check that it's an object
  node.tag && node.tag.object
  // Check that the object matches the imported name
  && node.tag.object.name === styledVariableName
  // Check that a property exists, otherwise it's just styled
  // without any call
  && node.tag.property
)

/**
 * Check if a node is a styld call
 * e.g. styled(Component)`` or styled('tagname')``
 */
const isStyledCall = (node, styledVariableName) => (
  // Check that it's a function call
  node.tag && node.tag.callee
  // And that the function name matches the imported name
  && node.tag.callee.name === styledVariableName
)

/**
 * Check if something is a styled component call
 */
const isStyled = (node, styledVariableName) => (
  isTaggedTemplateLiteral(node) &&
  (isStyledCall(node, styledVariableName) || isStyledShorthand(node, styledVariableName))
)

/**
 * Check if something is a call to one of our helper methods
 *
 * Returns either a string (the name of the helper) or false
 */
const isHelper = (node, importedNames) => {
  if (!isTaggedTemplateLiteral(node)) return false
  let helper
  Object.keys(importedNames).forEach(name => {
    if (importedNames[name] === node.tag.name) {
      helper = name
      return
    }
  })
  return helper || false
}

exports.isStyledImport = isStyledImport
exports.isStyledShorthand = isStyledShorthand
exports.isStyledCall = isStyledCall
exports.isStyled = isStyled
exports.isHelper = isHelper
