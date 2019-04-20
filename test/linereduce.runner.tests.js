var chai = require('chai')
var dirtyChai = require('dirty-chai')
var expect = chai.expect
let util = new (require(`../lib/util.js`))()
chai.use(dirtyChai)
const { linereduceRunner: LinereduceRunner } = require('../lib')
const testData = require('./testdata')

// ganked from poetifier
// let lr = new (require(`./lrRunner.js`))({ util: util, texts: texts })
// let text = lr.text
// source = [{
//   name: texts.reduce((p, c) => p + ` ` + c.name, ``),
//   text: () => text,
//   sentences: () => textutils.sentencify(text)
// }]

describe(`linereduceRunner `, () => {
  describe(`API`, () => {
    it(`...provides a Runner method`, () => {
      expect(LinereduceRunner).to.be.a(`function`)
    })
  })

  describe('... in action', () => {
    it('... will get a set of sentences', () => {
      const reduced = new LinereduceRunner({ util, texts: [testData.corporaDummy] })
      expect(reduced).to.be.an('object')
      expect(reduced).to.have.property('lines')
      expect(reduced).to.have.property('text')
      expect(reduced).to.have.property('name')

      expect(reduced.name).to.be.a('string')
      expect(reduced.text).to.be.a('string')
      expect(reduced.lines).to.be.an('array')

      expect(reduced.lines.length).to.be.greaterThan(0)
      expect(reduced.text.length).to.be.greaterThan(0)

      // const firstWord = firsts.lines[0].split(' ')[0]
      // const allSame = firsts.lines.reduce((p, line) => p && line.startsWith(firstWord), true)
      // expect(allSame).to.be.true()
    })

    // it('... will get a set of sentences that END with the same word', () => {
    //   const lasts = runner.filter({ type: types.end, text: blob })
    //   expect(lasts).to.be.an('object')
    //   expect(lasts).to.have.property('lines')
    //   expect(lasts).to.have.property('text')

    //   expect(lasts.lines.length).to.be.greaterThan(0)

    //   const lastWord = lasts.lines[0].split(' ').slice(-1)[0]
    //   const allSame = lasts.lines.reduce((p, line) => p && line.endsWith(lastWord), true)
    //   expect(allSame).to.be.true()
    // })

    // it('... will get a set of sentences that match some pattern', () => {
    //   const matches = runner.filter({ type: types.search, text: blob, search: / is / })
    //   expect(matches).to.be.an('object')
    //   expect(matches).to.have.property('lines')
    //   expect(matches).to.have.property('text')

    //   expect(matches.lines.length).to.be.greaterThan(0)

    //   const allSame = matches.lines.reduce((p, line) => p && line.indexOf(' is ') > -1, true)
    //   expect(allSame).to.be.true()
    // })
  })
})
