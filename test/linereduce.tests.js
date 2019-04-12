var chai = require('chai')
var dirtyChai = require('dirty-chai')
var expect = chai.expect
let util = new (require(`../lib/util.js`))()

chai.use(dirtyChai)

const { linereduce: lr } = require('../lib/')
console.log(lr)

// TODO: absolutely unimplemented
// look at the runner, and move on from there....

describe.only(`linereduce `, () => {
  describe(`API`, () => {
    // module.exports = { LineReduce, types: reduceType }

    it(`...provides a LineReduce method`, () => {
      expect(lr.LineReduce).to.be.a(`function`)
    })

    it(`... provides a "list" of reduction types (object)`, () => {
      expect(lr.types).to.be.an(`object`)
    })

    it(`... should throw a TypeError if not provided with a util`, () => {
      expect(function () {
        (() => new lr.LineReduce())()
      }).to.throw(Error)
    })
  })

  // var Util = require(`../lib/util.js`)
  // var util = new Util()
  describe('... in action', () => {
    let linereduce, blob
    before(() => {
      linereduce = new lr.LineReduce({ util })
      blob = `This is some text.
This is some more.
Another line of text.
How many lines?
This is not enough.
Not enough text.
This is maybe enough.
Enough text?
This is probably not.`
    })
    it('should work somehow', () => {
      const startLines = linereduce.filter({ type: lr.types.start, text: blob })
      expect(startLines).to.be.an('object')
      expect(startLines).to.have.property('lines')
      expect(startLines).to.have.property('text')

      const endLines = linereduce.filter({ type: lr.types.end, text: blob })
      expect(endLines).to.be.an('object')
      expect(endLines).to.have.property('lines')
      expect(endLines).to.have.property('text')
    })
  })
})
