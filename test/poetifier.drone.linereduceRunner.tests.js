const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)

const Poetifier = require(`../lib`).poetifier
let config = require(`../config.js`)
const { types } = require(`../lib/linereduce.js`)

describe(`poetifier with lrRunner`, () => {
  describe(`functional tests`, () => {
    let newpoetifier
    let poem
    before(() => {
      config.method = `drone`
      config.reduce = true
      config.corporaFilter = 'eliot'
      config.transform = false
      newpoetifier = new Poetifier({ config: config })
      poem = newpoetifier.poem({})
      console.log(`IN DRONE TEST`, poem.seed, poem.lines?.length)
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

  describe(`functional tests with LR pattern match`, () => {
    let newpoetifier
    let poem
    before(() => {
      config.method = `drone`
      config.reduce = true
      config.corporaFilter = 'alice'
      config.transform = false
      config.reduceType = types.pattern
      newpoetifier = new Poetifier({ config: config })
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
