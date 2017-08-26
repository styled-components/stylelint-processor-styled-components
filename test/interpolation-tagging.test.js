const stylelint = require('stylelint')
const path = require('path')

const processor = path.join(__dirname, '../src/index.js')
const rules = {
  'block-no-empty': true,
  'declaration-block-no-duplicate-properties': true,
  indentation: 2
}

describe('interpolation-tagging', () => {
  let fixture
  let data

  beforeEach(done => {
    stylelint
      .lint({
        files: [fixture],
        syntax: 'scss',
        config: {
          processors: [processor],
          rules
        }
      })
      .then(result => {
        data = result
        done()
      })
      .catch(err => {
        data = err
        done()
      })
  })

  describe('valid', () => {
    beforeAll(() => {
      fixture = path.join(__dirname, './fixtures/interpolation-tagging/valid.js')
    })

    it('should have one result', () => {
      expect(data.results.length).toEqual(1)
    })

    it('should use the right file', () => {
      expect(data.results[0].source).toEqual(fixture)
    })

    it('should not have errored', () => {
      expect(data.errored).toEqual(false)
    })

    it('should not have any warnings', () => {
      expect(data.results[0].warnings.length).toEqual(0)
    })
  })

  describe('invalid tag', () => {
    beforeAll(() => {
      fixture = path.join(__dirname, './fixtures/interpolation-tagging/invalid-tag.js')
    })

    it('should throw an error', () => {
      expect(data).toEqual(expect.any(Error))
    })

    it('should throw correct error', () => {
      expect(data.message).toMatch(
        /fixtures\/interpolation-tagging\/invalid-tag\.js line 5 column 4:\n.*invalid sc- tag/
      )
    })
  })

  describe('invalid custom tag', () => {
    beforeAll(() => {
      fixture = path.join(__dirname, './fixtures/interpolation-tagging/invalid-custom.js')
    })

    it('should throw an error', () => {
      expect(data).toEqual(expect.any(Error))
    })

    it('should throw correct error', () => {
      expect(data.message).toMatch(
        /fixtures\/interpolation-tagging\/invalid-custom\.js line 5 column 4:\n.*We were unable to parse/
      )
    })
  })
})
