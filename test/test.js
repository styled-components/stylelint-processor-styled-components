const test = require('tap').test
const stylelint = require('stylelint')
const path = require('path')

const processor = path.join(__dirname, '../src/index.js')
const rules = {
  'block-no-empty': true,
  indentation: 2,
  'no-missing-end-of-source-newline': 2,
}

test('file one', (t) => {
  const fixture = path.join(__dirname, './fixtures/one.js')
  stylelint.lint({
    files: [fixture],
    config: {
      processors: [processor],
      rules,
    },
  }).then((data) => {
    console.log(data)
    t.equal(data.results.length, 1, 'number of results')
    // const result = data.results[0]
    // t.equal(result.source, fixture, 'filename')
    // t.deepEqual(_.orderBy(result.warnings, ['line', 'column']), oneExpectations)
    t.end()
  }).catch(t.threw)
})

// test('files one and two', (t) => {
//   const fixtureOne = path.join(__dirname, './fixtures/one.js')
//   const fixtureTwo = path.join(__dirname, './fixtures/two.js')
//   stylelint.lint({
//     files: [fixtureOne, fixtureTwo],
//     config: {
//       processors: [processor],
//       rules,
//     },
//   }).then((data) => {
//     t.equal(data.results.length, 2, 'number of results')
//
//     // t.equal(data.results[0].source, fixtureOne)
//     // t.deepEqual(_.orderBy(data.results[0].warnings, ['line', 'column']), oneExpectations)
//     //
//     // t.equal(data.results[1].source, fixtureTwo)
//     // t.deepEqual(_.orderBy(data.results[1].warnings, ['line', 'column']), twoExpectations)
//
//     t.end()
//   }).catch(t.threw)
// })
