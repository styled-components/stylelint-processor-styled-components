const stylelint = require('stylelint')
const path = require('path')
const slash = require('slash')

const processor = path.join(__dirname, '../src/index.js')
const rules = {
  'block-no-empty': true,
  indentation: 2,
  'rule-empty-line-before': [
    'always-multi-line',
    {
      except: ['first-nested'],
      ignore: ['after-comment']
    }
  ],
  'selector-type-no-unknown': true
}

describe('options', () => {
  let fixture
  let fixtures
  let data

  describe('moduleName', () => {
    // NOTE beforeEach() runs _after_ the beforeAll() hooks of the describe() blocks, so `fixture`
    // will have the right path
    beforeEach(done => {
      stylelint
        .lint({
          files: [fixture],
          config: {
            // Set moduleName option to "emotion"
            processors: [[processor, { moduleName: 'emotion' }]],
            rules
          }
        })
        .then(result => {
          data = result
          done()
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err)
          data = err
          done()
        })
    })

    describe('moduleName', () => {
      beforeAll(() => {
        fixture = slash(path.join(__dirname, './fixtures/options/module-name.js'))
      })

      it('should have one result', () => {
        expect(data.results.length).toEqual(1)
      })

      it('should use the right file', () => {
        expect(slash(data.results[0].source)).toEqual(fixture)
      })

      it('should have errored', () => {
        expect(data.results[0].errored).toEqual(true)
      })

      it('should have one warning (i.e. wrong lines of code)', () => {
        expect(data.results[0].warnings.length).toEqual(1)
      })

      it('should have a block-no-empty as the first warning', () => {
        expect(data.results[0].warnings[0].rule).toEqual('block-no-empty')
      })
    })

    describe('relative moduleName', () => {
      beforeAll(() => {
        fixture = slash(path.join(__dirname, './fixtures/options/relative-module-name.js'))
      })

      it('should have one result', () => {
        expect(data.results.length).toEqual(1)
      })

      it('should use the right file', () => {
        expect(slash(data.results[0].source)).toEqual(fixture)
      })

      it('should have errored', () => {
        expect(data.results[0].errored).toEqual(true)
      })

      it('should have one warning (i.e. wrong lines of code)', () => {
        expect(data.results[0].warnings.length).toEqual(1)
      })

      it('should have a block-no-empty as the first warning', () => {
        expect(data.results[0].warnings[0].rule).toEqual('block-no-empty')
      })
    })

    describe('invalid moduleName', () => {
      beforeAll(() => {
        fixture = slash(path.join(__dirname, './fixtures/options/invalid-module-name.js'))
      })

      it('should have one result', () => {
        expect(data.results.length).toEqual(1)
      })

      it('should use the right file', () => {
        expect(slash(data.results[0].source)).toEqual(fixture)
      })

      it('should not have errored', () => {
        expect(data.results[0].errored).toEqual(false)
      })
    })
  })

  describe('moduleName array', () => {
    beforeEach(done => {
      stylelint
        .lint({
          files: fixtures,
          config: {
            // Set moduleName option to "emotion"
            processors: [[processor, { moduleName: ['emotion', 'some-module'] }]],
            rules
          }
        })
        .then(result => {
          data = result
          done()
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err)
          data = err
          done()
        })
    })

    describe('moduleName', () => {
      beforeAll(() => {
        fixtures = [
          slash(path.join(__dirname, './fixtures/options/module-name.js')),
          slash(path.join(__dirname, './fixtures/options/module-name-two.js'))
        ]
      })

      it('should have one result', () => {
        expect(data.results.length).toEqual(2)
      })

      it('should use the right file', () => {
        expect([slash(data.results[0].source), slash(data.results[1].source)]).toEqual(fixtures)
      })

      it('should have errored', () => {
        expect([data.results[0].errored, data.results[1].errored]).toEqual([true, true])
      })

      it('should have one warning (i.e. wrong lines of code)', () => {
        expect([data.results[0].warnings.length, data.results[1].warnings.length]).toEqual([1, 1])
      })

      it('should have a block-no-empty as the first warning', () => {
        expect([data.results[0].warnings[0].rule, data.results[1].warnings[0].rule]).toEqual([
          'block-no-empty',
          'block-no-empty'
        ])
      })
    })

    describe('relative moduleName', () => {
      beforeAll(() => {
        fixtures = [
          slash(path.join(__dirname, './fixtures/options/relative-module-name.js')),
          slash(path.join(__dirname, './fixtures/options/relative-module-name-two.js'))
        ]
      })

      it('should have one result', () => {
        expect(data.results.length).toEqual(2)
      })

      it('should use the right file', () => {
        expect([slash(data.results[0].source), slash(data.results[1].source)]).toEqual(fixtures)
      })

      it('should have errored', () => {
        expect([data.results[0].errored, data.results[1].errored]).toEqual([true, true])
      })

      it('should have one warning (i.e. wrong lines of code)', () => {
        expect([data.results[0].warnings.length, data.results[1].warnings.length]).toEqual([1, 1])
      })

      it('should have a block-no-empty as the first warning', () => {
        expect([data.results[0].warnings[0].rule, data.results[1].warnings[0].rule]).toEqual([
          'block-no-empty',
          'block-no-empty'
        ])
      })
    })
  })

  describe('importName', () => {
    // NOTE beforeEach() runs _after_ the beforeAll() hooks of the describe() blocks, so `fixture`
    // will have the right path
    beforeEach(done => {
      stylelint
        .lint({
          files: [fixture],
          config: {
            // Set importName option to "notDefault"
            processors: [[processor, { importName: 'notDefault' }]],
            rules
          }
        })
        .then(result => {
          data = result
          done()
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err)
          data = err
          done()
        })
    })

    describe('importName', () => {
      beforeAll(() => {
        fixture = slash(path.join(__dirname, './fixtures/options/import-name.js'))
      })

      it('should have one result', () => {
        expect(data.results.length).toEqual(1)
      })

      it('should use the right file', () => {
        expect(slash(data.results[0].source)).toEqual(fixture)
      })

      it('should have errored', () => {
        expect(data.results[0].errored).toEqual(true)
      })

      it('should have one warning (i.e. wrong lines of code)', () => {
        expect(data.results[0].warnings.length).toEqual(1)
      })

      it('should have a block-no-empty as the first warning', () => {
        expect(data.results[0].warnings[0].rule).toEqual('block-no-empty')
      })
    })

    describe('invalid importName', () => {
      beforeAll(() => {
        fixture = slash(path.join(__dirname, './fixtures/options/invalid-import-name.js'))
      })

      it('should have one result', () => {
        expect(data.results.length).toEqual(1)
      })

      it('should use the right file', () => {
        expect(slash(data.results[0].source)).toEqual(fixture)
      })

      it('should not have errored', () => {
        expect(data.results[0].errored).toEqual(false)
      })
    })
  })

  describe('parserPlugins', () => {
    // NOTE beforeEach() runs _after_ the beforeAll() hooks of the describe() blocks, so `fixture`
    // will have the right path
    beforeEach(done => {
      const plugins = [
        'jsx',
        ['decorators', { decoratorsBeforeExport: true }],
        'classProperties',
        'exportExtensions',
        'functionBind',
        'functionSent',
        // Enable experimental feature
        'exportDefaultFrom'
      ]

      stylelint
        .lint({
          code: "export Container from './Container';",
          config: {
            processors: [[processor, { parserPlugins: plugins }]],
            rules
          }
        })
        .then(result => {
          data = result
          done()
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err)
          data = err
          done()
        })
    })

    it('should have one result', () => {
      expect(data.results.length).toEqual(1)
    })

    it('should have not errored', () => {
      expect(data.results[0].errored).toEqual(false)
    })
  })

  describe('strict', () => {
    beforeEach(done => {
      fixture = slash(path.join(__dirname, './fixtures/options/strict.js'))

      stylelint
        .lint({
          files: [fixture],
          config: {
            processors: [
              [
                processor,
                {
                  moduleName: 'some-module',
                  importName: 'foo',
                  strict: true
                }
              ]
            ],
            rules
          }
        })
        .then(result => {
          data = result
          done()
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err)
          data = err
          done()
        })
    })

    it('should have one result', () => {
      expect(data.results.length).toEqual(1)
    })

    it('should use the right file', () => {
      expect(slash(data.results[0].source)).toEqual(fixture)
    })

    it('should have errored', () => {
      expect(data.results[0].errored).toEqual(true)
    })

    it('should have one warning (i.e. wrong lines of code)', () => {
      expect(data.results[0].warnings.length).toEqual(1)
    })

    it('should have a block-no-empty as the first warning', () => {
      expect(data.results[0].warnings[0].rule).toEqual('block-no-empty')
    })
  })
})
