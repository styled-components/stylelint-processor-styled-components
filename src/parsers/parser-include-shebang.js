function includeShebang(text, ast) {
  if (!text.startsWith('#!')) {
    return ast.comments
  }

  const index = text.indexOf('\n')
  const shebang = text.slice(2, index)
  const comment = {
    type: 'Line',
    value: shebang,
    range: [0, index],
    loc: {
      source: null,
      start: {
        line: 1,
        column: 0,
      },
      end: {
        line: 1,
        column: index,
      },
    },
  }

  return [comment].concat(ast.comments)
}

module.exports = includeShebang
