const expect = require('expect')
const stylelint = require('stylelint')
const path = require('path')

const processor = path.join(__dirname, '../src/index.js')
const rules = {
  'block-no-empty': true,
  indentation: 2,
}

describe.skip('hard', () => {
  let fixture
  let data

  // NOTE beforeEach() runs _after_ the before() hooks of the describe() blocks, so `fixture` will
  // have the right path
  beforeEach((done) => {
    stylelint.lint({
      files: [fixture],
      config: {
        processors: [processor],
        rules,
      },
    }).then((result) => {
      data = result
      done()
    }).catch((err) => {
      data = err
      done()
    })
  })

  describe('valid fixtures', () => {
    before(() => {
      fixture = path.join(__dirname, './fixtures/hard/indentation.js')
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
      expect(data.results[0].warnings).toEqual(undefined)
    })
  })
})
