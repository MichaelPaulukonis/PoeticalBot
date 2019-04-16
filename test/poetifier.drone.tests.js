const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const Poetifier = require(`../lib/`).poetifier
let config = require(`../config.js`)

describe(`poetifier incrementingLines with lrRunner`, () => {
  describe(`functional tests`, () => {
    let newpoetifier
    let poem
    before(() => {
      config.method = `drone` // need to test every method, of course..... (poorly named)
      config.reduce = false
      config.corporaFilter = 'eliot'
      config.transform = false
      // config.seed = '6ukuy4s.073l' // temp: this is a failure!
      // TODO: set a NON jGnoetry method
      // incrementngLines
      newpoetifier = new Poetifier({ config: config })
      // TODO: do I have tests for the config object?
      // TODO: this test fails on jGnoetry, which does NOT have lines???
      // let poem = new Poetifier({ options: { config: { method: 'jgnoetry' } } }).poem({})
      poem = newpoetifier.poem({})
      console.log(`IN DRONE TEST`, poem.seed, poem.lines.length)
    })

    it(`returns an object`, () => {
      expect(poem).to.be.an(`object`)
    })
    describe(`which`, () => {
      it(`has a "lines" property`, () => {
        expect(poem.lines).to.exist()
      })
      it(`has a "title" property`, () => {
        expect(poem.title).to.exist()
      })
      it(`has a "seed" property`, () => {
        expect(poem.seed).to.exist()
      })
      it(`has a "source" property`, () => {
        expect(poem.source).to.exist()
      })
      // TODO: sometimes it DOES have a "config" property
      // WHEN using the bucketRunner (at least)
      // contains meta-data on the strategy
      // not a bad thing, but not consistent. hunh.
      // "config": {
      //   "strategy": "decrementinglines",
      //   "lineCount": 15
      // },
    })
    describe(`lines`, () => {
      it(`are an array`, () => {
        expect(poem.lines).to.be.an(`array`)
      })
      // NOTE: as it currently stands, the lib will sometimes return an empty poem
      // if the match is not found, for example
      // so... need some better way of testing/noting this
      // since it's a valid return case
      it(`having non-zero length`, () => {
        expect(poem.lines).to.have.length.above(0)
      })
      it(`and contain strings (or nothing)`, () => {
        // if poem.poem has elements, they are all strings
        // OR it does not have elements
        expect(poem.lines.filter(e => typeof e === `string`)).to.have.length(poem.lines.length)
      })
    })

    describe(`text`, () => {
      it(`is a string`, () => {
        expect(poem.text).to.be.a(`string`)
      })
      // NOTE: as it currently stands, the lib will sometimes return an empty poem
      // if the match is not found, for example
      // so... need some better way of testing/noting this
      // since it's a valid return case
      it(`having non-zero length`, () => {
        expect(poem.text).to.have.length.above(0)
      })
    })
  })
})
