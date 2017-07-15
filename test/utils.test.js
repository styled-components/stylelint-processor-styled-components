const interleave = require('../src/utils/tagged-template-literal').interleave
const isLastDeclarationCompleted = require('../src/utils/general').isLastDeclarationCompleted
const nextNonWhitespaceChar = require('../src/utils/general').nextNonWhitespaceChar
const reverseString = require('../src/utils/general').reverseString
const isStylelintComment = require('../src/utils/general').isStylelintComment

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

      /**
       * It is important to also have this one as interleave would fail this if it simply
       * checked the previous quasi and not the previous processed text.
       * Here we also check the whole expression with and without a semi-colon in the quasi
       */
      const quasis3 = [
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
            raw: ' '
          }
        },
        {
          value: {
            raw: '\n'
          }
        }
      ]
      const expressions3 = [
        {
          name: 'display'
        },
        {
          name: undefined
        },
        {
          name: undefined
        }
      ]
      expect(interleave(quasis3, expressions3)).toEqual(
        '\n  display: $dummyValue; -styled-mixin0: dummyValue; -styled-mixin1: dummyValue;\n'
      )
    })
  })

  describe('reverseString', () => {
    const fn = reverseString

    it('reverses a string', () => {
      expect(fn('abcd')).toEqual('dcba')
    })

    it('handles empty string', () => {
      expect(fn('')).toEqual('')
    })
  })

  describe('nextNonWhitespaceChar', () => {
    const fn = nextNonWhitespaceChar

    it('handles empty string', () => {
      expect(fn('')).toBe(null)
    })

    it('handles all whitespace', () => {
      expect(fn('  \t \n  \t')).toBe(null)
    })

    it('handles no leading whitespace', () => {
      expect(fn('abc')).toBe('a')
    })

    it('handles spaces', () => {
      expect(fn('  b')).toBe('b')
    })

    it('handles tabs', () => {
      expect(fn('\tc')).toBe('c')
    })

    it('handles newlines', () => {
      expect(fn('\nd')).toBe('d')
    })

    it('handles a mix', () => {
      expect(fn(' \n\t\ra \t\r\nb')).toBe('a')
    })
  })

  describe('isLastDeclarationCompleted', () => {
    const fn = isLastDeclarationCompleted

    it('handles all whitespace', () => {
      expect(fn('   \n \n \t \r')).toBe(true)
    })

    it('handles empty string', () => {
      expect(fn('')).toBe(true)
    })

    it('handles one-line css', () => {
      const prevCSS = 'display: block; color: red '
      expect(fn(prevCSS)).toBe(false)

      expect(fn(`${prevCSS};`)).toBe(true)
    })

    it('handles multi-line css', () => {
      const prevCSS = `
        display: block;
        color: red`
      expect(fn(prevCSS)).toBe(false)

      expect(fn(`${prevCSS};\n`)).toBe(true)
    })

    it('handles irregular css', () => {
      const prevCSS = `display   :  block
           ;      color:
             red   `
      expect(fn(prevCSS)).toBe(false)

      expect(
        fn(`${prevCSS}

                ;

          `)
      ).toBe(true)
    })

    it('handles declaration blocks', () => {
      const prevCSS = `
        @media screen and (max-width: 600px) {
          display: block;
          color: red;
        }
      `
      expect(fn(prevCSS)).toBe(true)
    })
  })

  describe('isStylelintComment', () => {
    const fn = isStylelintComment

    it('should match general block ignores', () => {
      expect(fn('stylelint-disable')).toBe(true)

      expect(fn('stylelint-enable')).toBe(true)
    })

    it('should match block ignores with any arguments', () => {
      expect(fn('stylelint-enable some-rule')).toBe(true)

      expect(fn('stylelint-disable asdfsafdsa-fdsafd9a0fd9sa0f asfd8af afdsa7f')).toBe(true)
    })

    it("shouldn't match line specific ignores", () => {
      expect(fn('stylelint-disable-line')).toBe(false)

      expect(fn('stylelint-disable-next-line')).toBe(false)
    })

    it('should handle whitespace in start and end', () => {
      expect(fn('   \tstylelint-disable   \t')).toBe(true)
    })
  })
})
