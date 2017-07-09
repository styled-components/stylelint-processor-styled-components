const stylelint = require('stylelint')
const path = require('path')

const processor = path.join(__dirname, '../src/index.js')
const rules = {
  'color-named': 'never'
}

describe('ignore rule comments', () => {
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
      fixture = path.join(__dirname, './fixtures/ignore-rule-comments/valid.js')
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

  describe('invalid', () => {
    beforeAll(() => {
      fixture = path.join(__dirname, './fixtures/ignore-rule-comments/invalid.js')
    })

    it('should have one result', () => {
      expect(data.results.length).toEqual(1)
    })

    it('should use the right file', () => {
      expect(data.results[0].source).toEqual(fixture)
    })

    it('should have errored', () => {
      expect(data.errored).toEqual(true)
    })

    it('should have exact amount of warnings', () => {
      expect(data.results[0].warnings.length).toEqual(2)
    })
  })
})
