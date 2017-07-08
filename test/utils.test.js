const interleave = require('../src/utils/tagged-template-literal').interleave
const isLastLineWhitespaceOnly = require('../src/utils/general').isLastLineWhitespaceOnly
const isEmptyOrSpaceOnly = require('../src/utils/general').isEmptyOrSpaceOnly

describe('utils', () => {
  describe('interleave', () => {
    it('should return the value of the node if no interpolation exists', () => {
      const raw = 'color: blue;'
      const quasis = [
        {
          value: {
            raw
          }
        }
      ]
      expect(interleave(quasis, [])).toEqual(raw)
    })

    it('should variabelize an interpolation', () => {
      const quasis = [
        {
          value: {
            raw: '\n  display: block;\n  color: '
          }
        },
        {
          value: {
            raw: ';\n  background: blue;\n'
          }
        }
      ]
      const expressions = [
        {
          name: 'color'
        }
      ]
      expect(interleave(quasis, expressions)).toEqual(
        '\n  display: block;\n  color: $dummyValue;\n  background: blue;\n'
      )
    })

    it('converts interpolated expressions to dummy mixins', () => {
      const quasis = [
        {
          value: {
            raw: '\n  display: block;\n  '
          }
        },
        {
          value: {
            raw: '\n  background: blue;\n'
          }
        }
      ]
      const expressions = [
        {
          name: undefined
        }
      ]
      expect(interleave(quasis, expressions)).toEqual(
        '\n  display: block;\n  -styled-mixin0: dummyValue;\n  background: blue;\n'
      )
    })

    it('correctly converts several interpolations within a single property', () => {
      const quasis = [
        {
          value: {
            raw: '\n  display: block;\n  border: '
          }
        },
        {
          value: {
            raw: ' '
          }
        },
        {
          value: {
            raw: ' '
          }
        },
        {
          value: {
            raw: ';\n  background: blue;\n'
          }
        }
      ]
      const expressions = [
        {
          name: 'borderWidth'
        },
        {
          name: 'borderStyle'
        },
        {
          name: 'color'
        }
      ]
      expect(interleave(quasis, expressions)).toEqual(
        '\n  display: block;\n  border: $dummyValue $dummyValue $dummyValue;\n  background: blue;\n'
      )
    })

    it('correctly handles several interpolations in single line of css', () => {
      const quasis1 = [
        {
          value: {
            raw: '\n  display: '
          }
        },
        {
          value: {
            raw: '; background: '
          }
        },
        {
          value: {
            raw: ';\n'
          }
        }
      ]
      const expressions1 = [
        {
          name: 'display'
        },
        {
          name: 'background'
        }
      ]
      expect(interleave(quasis1, expressions1)).toEqual(
        '\n  display: $dummyValue; background: $dummyValue;\n'
      )

      const quasis2 = [
        {
          value: {
            raw: '\n  display: '
          }
        },
        {
          value: {
            raw: '; '
          }
        },
        {
          value: {
            raw: '\n'
          }
        }
      ]
      const expressions2 = [
        {
          name: 'display'
        },
        {
          name: undefined
        }
      ]
      expect(interleave(quasis2, expressions2)).toEqual(
        '\n  display: $dummyValue; -styled-mixin0: dummyValue\n'
      )
    })
  })

  describe('isLastLineWhitespaceOnly', () => {
    it('should return true for empty string', () => {
      expect(isLastLineWhitespaceOnly('')).toEqual(true)
    })

    it('should return true for string of spaces', () => {
      expect(isLastLineWhitespaceOnly('   ')).toEqual(true)
    })

    it('should return true for string of spaces and tabs', () => {
      expect(isLastLineWhitespaceOnly(' \t  ')).toEqual(true)
    })

    it('should return false for string with something other than space and tab', () => {
      expect(isLastLineWhitespaceOnly('not space')).toEqual(false)
    })

    it('should return true if last line has only space and tab', () => {
      expect(isLastLineWhitespaceOnly('not space\n  ')).toEqual(true)
    })
  })

  describe('isEmptyOrSpaceOnly', () => {
    it('should return true for empty string', () => {
      expect(isEmptyOrSpaceOnly('')).toEqual(true)
    })

    it('should return true for consecutive empty string', () => {
      expect(isEmptyOrSpaceOnly(' ')).toEqual(true)
    })

    it('should return true for string of spaces and tabs', () => {
      expect(isEmptyOrSpaceOnly(' \t  ')).toEqual(true)
    })

    it('should return false for string of newline', () => {
      expect(isEmptyOrSpaceOnly('\n')).toEqual(false)
    })
  })
})
