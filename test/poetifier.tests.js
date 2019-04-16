var chai = require('chai')
var dirtyChai = require('dirty-chai')
var expect = chai.expect

chai.use(dirtyChai)

let config = require(`../config.js`)
const Poetifier = require(`../lib/poetifier.js`)

let newpoetifier
let poem

describe(`poetifier`, () => {
  describe(`API`, () => {
    it(`returns a new instance with new`, () => {
      expect(newpoetifier).to.be.a(`object`)
      expect(newpoetifier).to.be.an.instanceof(Poetifier)
    })

    it(`throws an error if config not supplied as parameter`, () => {
      expect(() => {
        (() => new Poetifier())()
      }).to.throw(Error)
    })

    it(`exposes a poem method`, () => {
      expect(newpoetifier.poem).to.be.a(`function`)
    })
  })

  before(() => {
    // TODO: does this file test anything unique, anymore?
    config.method = `queneau-buckets` // need to test every method, of course..... (poorly named)
    config.subStrategy = `diamond`
    config.corporaFilter = 'eliot'
    config.transform = false
    // TODO: set a NON jGnoetry method
    // incrementngLines
    newpoetifier = new Poetifier({ config: config })
    poem = newpoetifier.poem({})
    console.log(`IN POETIFIER TEST`, JSON.stringify(poem, null, 2))
  })
  describe(`functional tests`, () => {
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

  //   describe(`that has metadata`, function() {
  //     // TODO: test for specific meta-data items
  //     // will become important as we pass in paramas and expect certain results
  //     it(`which is an object`, function() {
  //       expect(poem.metadata).to.be.an(`object`);
  //     });
  //     let md = poem.metadata;
  //     describe(`metadata properties`, function() {
  //       // TODO: this might be optional, if generated from data, not text?
  //       // but for now, source blob is provided BEFORE generation method is "known"
  //       // (leaving parameters aside)
  //       it(`has a source property`, function() {
  //         expect(md.source).to.be.a(`string`);
  //       });
  //       it(`has a strategy property`, function() {
  //         expect(md.strategy).to.be.a(`string`);
  //       });
  //       it(`has a title property`, function() {
  //         expect(md.title).to.be.a(`string`);
  //       });
  //       // this is a silly/stupid/poorly-named property
  //       // and replicates the length of the array
  //       // was created purely for convenience
  //       it(`has a length property`, function() {
  //         expect(md[`length`]).to.be.an(`number`);
  //       });

  //     });

  //   });
  // });
})
