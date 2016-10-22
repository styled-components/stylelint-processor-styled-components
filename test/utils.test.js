const expect = require('expect')
const interleave = require('../src/utils/tagged-template-literal').interleave

describe('utils', () => {
  describe('interleave', () => {
    it('should return the value of the node if no interpolation exists', () => {
      const raw = 'color: blue;'
      const quasis = [{
        value: {
          raw,
        },
      }]
      expect(interleave(quasis, [])).toEqual(raw)
    })

    it('should remove an interpolation', () => {
      const quasis = [{
        value: {
          raw: '\n  display: block;\ncolor: ',
        },
      }, {
        value: {
          raw: ';\n  background: blue;\n',
        },
      }]
      const expressions = [{
        name: 'color',
      }]
      expect(interleave(quasis, expressions)).toEqual('\n  display: block;\n  background: blue;\n')
    })
  })
})
