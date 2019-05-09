var chai = require('chai')
var dirtyChai = require('dirty-chai')
var expect = chai.expect
let util = new (require(`../lib/util.js`))()
chai.use(dirtyChai)
const { linereduceRunner: LinereduceRunner } = require('../lib')
const testData = require('./testdata')
const { types } = require(`../lib/linereduce.js`)
const nlp = require('compromise')

// extracted from linereduce itself
// so... maybe it's a utility?
const stripPunct = (t) => t.replace(/^[^a-z0-9-]|[^a-z0-9-]$/ig, ``)

describe(`linereduceRunner `, () => {
  describe(`API`, () => {
    it(`...provides a Runner method`, () => {
      expect(LinereduceRunner).to.be.a(`function`)
    })
  })

  describe('... in action', () => {
    it('... will get a set of sentences that START with the same word', () => {
      const reduced = new LinereduceRunner({ util, texts: [testData.corporaDummy], reduceType: types.start })
      expect(reduced).to.be.an('object')
      expect(reduced).to.have.property('lines')
      expect(reduced).to.have.property('text')
      expect(reduced).to.have.property('name')

      expect(reduced.name).to.be.a('string')
      expect(reduced.text).to.be.a('string')
      expect(reduced.lines).to.be.an('array')

      expect(reduced.lines.length).to.be.greaterThan(0)
      expect(reduced.text.length).to.be.greaterThan(0)

      const firstWord = stripPunct(reduced.lines[0].split(' ')[0])
      const allSame = reduced.lines.reduce((p, line) => p && stripPunct(line).startsWith(firstWord), true)
      expect(allSame).to.be.true()
    })

    it('... will get a set of sentences that END with the same word', () => {
      const reduced = new LinereduceRunner({ util, texts: [testData.corporaDummy], reduceType: types.end })
      expect(reduced).to.be.an('object')
      expect(reduced).to.have.property('lines')
      expect(reduced).to.have.property('text')
      expect(reduced).to.have.property('name')

      expect(reduced.name).to.be.a('string')
      expect(reduced.text).to.be.a('string')
      expect(reduced.lines).to.be.an('array')

      expect(reduced.lines.length).to.be.greaterThan(0)
      expect(reduced.text.length).to.be.greaterThan(0)

      const lastWord = stripPunct(reduced.lines[0].split(' ').slice(-1)[0])
      const allSame = reduced.lines.reduce((p, line) => p && stripPunct(line).endsWith(lastWord), true)
      expect(allSame).to.be.true()
    })

    it('... will get a set of sentences that contain a 2+ word sequence', () => {
      const reduced = new LinereduceRunner({ util, texts: [testData.corporaDummy], reduceType: types.search })
      expect(reduced).to.be.an('object')
      expect(reduced).to.have.property('lines')
      expect(reduced).to.have.property('text')
      expect(reduced).to.have.property('name')

      expect(reduced.name).to.be.a('string')
      expect(reduced.text).to.be.a('string')
      expect(reduced.lines).to.be.an('array')

      expect(reduced.lines.length).to.be.greaterThan(0)
      expect(reduced.text.length).to.be.greaterThan(0)

      const ngrams = nlp(reduced.text).ngrams()
      expect(ngrams.length).to.be.greaterThan(0)
    })

    it('... will get a set of sentences that match a pattern (nouns)', () => {
      const config = {
        util,
        texts: [testData.corporaDummy],
        reduceType: types.pattern,
        matchPattern: '#noun'
      }
      const reduced = new LinereduceRunner(config)
      expect(reduced).to.be.an('object')
      expect(reduced).to.have.property('lines')
      expect(reduced).to.have.property('text')
      expect(reduced).to.have.property('name')

      expect(reduced.name).to.be.a('string')
      expect(reduced.text).to.be.a('string')
      expect(reduced.lines).to.be.an('array')

      expect(reduced.lines.length).to.equal(25)
    })

    it('... will get a set of sentences that match a pattern (adjective)', () => {
      const config = {
        util,
        texts: [testData.corporaDummy],
        reduceType: types.pattern,
        matchPattern: '#Adjective'
      }
      const reduced = new LinereduceRunner(config)
      expect(reduced).to.be.an('object')
      expect(reduced).to.have.property('lines')
      expect(reduced).to.have.property('text')
      expect(reduced).to.have.property('name')

      expect(reduced.name).to.be.a('string')
      expect(reduced.text).to.be.a('string')
      expect(reduced.lines).to.be.an('array')

      expect(reduced.lines.length).to.equal(7)
    })

    it('... will get a set of sentences that match a pattern (person)', () => {
      const config = {
        util,
        texts: [testData.corporaDummy],
        reduceType: types.pattern,
        matchPattern: '#Person'
      }
      const reduced = new LinereduceRunner(config)
      expect(reduced).to.be.an('object')
      expect(reduced).to.have.property('lines')
      expect(reduced).to.have.property('text')
      expect(reduced).to.have.property('name')

      expect(reduced.name).to.be.a('string')
      expect(reduced.text).to.be.a('string')
      expect(reduced.lines).to.be.an('array')

      expect(reduced.lines.length).to.equal(3)
    })

    it.only('... will try a second time on a failure with a specified pattern', () => {
      const config = {
        util,
        texts: [testData.corporaDummy],
        reduceType: types.pattern,
        matchPattern: '#Grundig'
      }
      // TODO: sinon spy to track calls?
      const reduced = new LinereduceRunner(config)
      expect(reduced).to.be.an('object')
      expect(reduced).to.have.property('lines')
      expect(reduced).to.have.property('text')
      expect(reduced).to.have.property('name')

      expect(reduced.name).to.be.a('string')
      expect(reduced.text).to.be.a('string')
      expect(reduced.lines).to.be.an('array')

      expect(reduced.lines.length).to.be.greaterThan(0)
    })
  })
})
