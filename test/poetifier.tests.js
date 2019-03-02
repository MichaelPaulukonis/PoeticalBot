var chai = require('chai')
var dirtyChai = require('dirty-chai')
var expect = chai.expect

chai.use(dirtyChai)

let Poetifier = require(`../lib/poetifier.js`)

let config = require(`../config.js`)

let newpoetifier = Poetifier({ config: config })

describe(`poetifier`, function () {
  describe(`API`, function () {
    it(`returns a new instance with new`, function () {
      expect(newpoetifier).to.be.a(`object`)
      expect(newpoetifier).to.be.an.instanceof(Poetifier)
    })

    it(`returns a new instance even without new`, function () {
      var poetifier = Poetifier({ config: config })
      expect(poetifier).to.be.a(`object`)
      expect(poetifier).to.be.an.instanceof(Poetifier)
    })

    it(`throws an error if config not supplied as parameter`, function () {
      expect(function () {
        (() => new Poetifier())()
      }).to.throw(Error)
    })

    it(`exposes a poem method`, function () {
      expect(newpoetifier.poem).to.be.a(`function`)
    })
  })

  describe(`functional tests`, function () {
    let poem = newpoetifier.poem()
    console.log(`IN THE TEST`, JSON.stringify(poem, null, 2))
    it(`returns an object`, function () {
      expect(poem).to.be.an(`object`)
    })
    describe(`which`, function () {
      it(`has a "lines" property`, function () {
        expect(poem.lines).to.exist()
      })
      it(`has a "title" property`, function () {
        expect(poem.title).to.exist()
      })
      it(`has a "seed" property`, function () {
        expect(poem.seed).to.exist()
      })
      it(`has a "source" property`, function () {
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
    describe(`lines`, function () {
      it(`are an array`, function () {
        expect(poem.lines).to.be.an(`array`)
      })
      // NOTE: as it currently stands, the lib will sometimes return an empty poem
      // if the match is not found, for example
      // so... need some better way of testing/noting this
      // since it's a valid return case
      it(`having non-zero length`, function () {
        expect(poem.lines).to.have.length.above(0)
      })
      it(`and contain strings (or nothing)`, function () {
        // if poem.poem has elements, they are all strings
        // OR it does not have elements
        expect(poem.lines.filter(e => typeof e === `string`)).to.have.length(poem.lines.length)
      })
    })

    describe(`text`, function () {
      it(`is a string`, function () {
        expect(poem.text).to.be.a(`string`)
      })
      // NOTE: as it currently stands, the lib will sometimes return an empty poem
      // if the match is not found, for example
      // so... need some better way of testing/noting this
      // since it's a valid return case
      it(`having non-zero length`, function () {
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
