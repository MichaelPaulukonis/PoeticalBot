var chai = require(`chai`)
var expect = chai.expect
var Util = require(`../lib/util.js`)
var util = new Util()

describe(`util tests`, () => {
  describe(`API tests`, () => {
    it(`should return a new instance with new`, () => {
      var newutil = new Util()
      expect(newutil).to.be.a(`object`)
      expect(newutil).to.be.an.instanceof(Util)
    })

    it(`should return a new instance even without new`, () => {
      var util = Util()
      expect(util).to.be.a(`object`)
      expect(util).to.be.an.instanceof(Util)
    })

    it(`should expose a debug method`, () => {
      expect(util.debug).to.be.a(`function`)
    })

    it(`should expose a debugOutput method`, () => {
      expect(util.debugOutput).to.be.a(`function`)
    })

    it(`should expose a randomProperty method`, () => {
      expect(util.randomProperty).to.be.a(`function`)
    })

    it(`should expose a pick method`, () => {
      expect(util.pick).to.be.a(`function`)
    })

    it(`should expose a pickCount method`, () => {
      expect(util.pickCount).to.be.a(`function`)
    })

    it(`should expose a random method`, () => {
      expect(util.random).to.be.a(`function`)
    })

    it(`should expose a randomInRange method`, () => {
      expect(util.randomInRange).to.be.a(`function`)
    })

    it(`should expose a coinflip method`, () => {
      expect(util.coinflip).to.be.a(`function`)
    })

    it(`should expose a pickRemove method`, () => {
      expect(util.pickRemove).to.be.a(`function`)
    })

    it(`should expose a shuffle method`, () => {
      expect(util.shuffle).to.be.a(`function`)
    })

    // TODO: okay, now actually test the methods!
  })
})
