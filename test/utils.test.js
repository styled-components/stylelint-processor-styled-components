const interleave = require('../src/utils/tagged-template-literal').interleave
const isLastLineWhitespaceOnly = require('../src/utils/general').isLastLineWhitespaceOnly

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
        '\n  display: block;\n  color: $color;\n  background: blue;\n'
      )
    })
  })

  describe('isLastLineWhitespaceOnly', () => {
    it('should return true for empty string', () => {
      expect(isLastLineWhitespaceOnly('')).toEqual(false)
    })

    it('should return true for string of spaces', () => {
      expect(isLastLineWhitespaceOnly('   ')).toEqual(false)
    })

    it('should return true for string of spaces and tabs', () => {
      expect(isLastLineWhitespaceOnly(' \t  ')).toEqual(false)
    })

    it('should return false for string with something other than space and tab', () => {
      expect(isLastLineWhitespaceOnly('not space')).toEqual(false)
    })

    it('should return true if last line has only space and tab', () => {
      expect(isLastLineWhitespaceOnly('not space\n  ')).toEqual(true)
    })
  })
})
