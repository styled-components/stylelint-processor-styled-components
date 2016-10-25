/**
 * Parsing helpers
 */

const parseImports = (node, currentNames) => {
  const names = Object.assign({}, currentNames)
  const imports = node.specifiers.filter((specifier) => (
    specifier.type === 'ImportDefaultSpecifier'
    || specifier.type === 'ImportSpecifier'
  ))

  imports.forEach((singleImport) => {
    if (singleImport.imported) {
      // Is helper method
      names[singleImport.imported.name] = singleImport.local.name
    } else {
      // Is default import
      names.default = singleImport.local.name
    }
  })
  
  return names
}

exports.parseImports = parseImports
