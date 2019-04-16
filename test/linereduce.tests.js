var chai = require('chai')
var dirtyChai = require('dirty-chai')
var expect = chai.expect
let util = new (require(`../lib/util.js`))()
chai.use(dirtyChai)

// const { linereduce: lr } = require('../lib/')
const { LineReduce, types } = require('../lib').linereduce
let { textutil } = require(`../lib/`)

describe(`linereduce `, () => {
  describe(`API`, () => {
    it(`...provides a LineReduce method`, () => {
      expect(LineReduce).to.be.a(`function`)
    })

    it(`... provides a "list" of reduction types (object)`, () => {
      expect(types).to.be.an(`object`)
    })

    it(`... should throw a TypeError if not provided with a util`, () => {
      expect(function () {
        (() => new LineReduce())()
      }).to.throw(Error)
    })

    it('... has a filter method once instantiated', () => {
      const linereduce = LineReduce({ util })
      expect(linereduce.filter).to.be.a('function')
    })
  })

  describe('... in action', () => {
    let linereduce, blob
    before(() => {
      linereduce = new LineReduce({ util })
      const text = `This is some text.
This is some more.
Another line of text.
How many lines?
This is not enough.
Not enough text.
This is maybe enough.
Enough text?
This is probably not.`
      blob = textutil.sentencify(text)
    })
    it('... will get a set of sentences that start with the same word', () => {
      const firsts = linereduce.filter({ type: types.start, text: blob })
      expect(firsts).to.be.an('object')
      expect(firsts).to.have.property('lines')
      expect(firsts).to.have.property('text')

      expect(firsts.lines.length).to.be.greaterThan(0)

      const firstWord = firsts.lines[0].split(' ')[0]
      const allSame = firsts.lines.reduce((p, line) => p && line.startsWith(firstWord), true)
      expect(allSame).to.be.true()
    })

    it('... will get a set of sentences that END with the same word', () => {
      const lasts = linereduce.filter({ type: types.end, text: blob })
      expect(lasts).to.be.an('object')
      expect(lasts).to.have.property('lines')
      expect(lasts).to.have.property('text')

      expect(lasts.lines.length).to.be.greaterThan(0)

      const lastWord = lasts.lines[0].split(' ').slice(-1)[0]
      const allSame = lasts.lines.reduce((p, line) => p && line.endsWith(lastWord), true)
      expect(allSame).to.be.true()
    })

    it('... will get a set of sentences that match some pattern', () => {
      const matches = linereduce.filter({ type: types.search, text: blob, search: / is / })
      expect(matches).to.be.an('object')
      expect(matches).to.have.property('lines')
      expect(matches).to.have.property('text')

      expect(matches.lines.length).to.be.greaterThan(0)

      const allSame = matches.lines.reduce((p, line) => p && line.indexOf(' is ') > -1, true)
      expect(allSame).to.be.true()
    })
  })
})
