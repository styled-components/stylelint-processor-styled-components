const interleave = require('../src/utils/tagged-template-literal').interleave

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
        '\n  display: $dummyValue; -styled-mixin0: dummyValue;\n'
      )
    })
  })
})
