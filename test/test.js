const test = require('tap').test
const stylelint = require('stylelint')
const path = require('path')

const processor = path.join(__dirname, '../src/index.js')
const rules = {
  'block-no-empty': true,
  indentation: 2,
}

test('valid', (t) => {
  const fixture = path.join(__dirname, './fixtures/simple/valid.js')
  stylelint.lint({
    files: [fixture],
    config: {
      processors: [processor],
      rules,
    },
  }).then((data) => {
    t.equal(data.results.length, 1, 'number of results')
    t.equal(data.results[0].source, fixture, 'filename')
    t.equal(data.errored, false)
    t.equal(data.warnings, undefined)
    t.end()
  }).catch(t.threw)
})

test('invalid', (t) => {
  const fixture = path.join(__dirname, './fixtures/simple/invalid.js')
  stylelint.lint({
    files: [fixture],
    config: {
      processors: [processor],
      rules,
    },
  }).then((data) => {
    t.equal(data.results.length, 1, 'number of results')
    const result = data.results[0]
    t.equal(result.source, fixture, 'filename')
    t.equal(result.errored, true)
    t.equal(result.warnings.length, 2)
    t.equal(result.warnings[0].rule, 'block-no-empty')
    t.equal(result.warnings[1].rule, 'indentation')
    t.end()
  }).catch(t.threw)
})

test('different import name', (t) => {
  const fixture = path.join(__dirname, './fixtures/imports.js')
  stylelint.lint({
    files: [fixture],
    config: {
      processors: [processor],
      rules,
    },
  }).then((data) => {
    t.equal(data.results.length, 1, 'number of results')
    const result = data.results[0]
    t.equal(result.source, fixture, 'filename')
    t.equal(result.errored, true)
    t.equal(result.warnings.length, 2)
    t.equal(result.warnings[0].rule, 'block-no-empty')
    t.equal(result.warnings[1].rule, 'indentation')
    t.end()
  }).catch(t.threw)
})
