'use strict';

// execute with `mocha test.js`

(function() {

  let expect = require(`chai`).expect,
      Poetifier = require(`../lib/poetifier.js`),
      config = require(`../config.js`),
      newpoetifier = Poetifier({config: config});

  // for functional tests
  let getText = function() {
    let Corpora = require(`common-corpus`),
        corpora = new Corpora(),
        source = corpora.texts,
        textObj = source[2], // eh..... source[0] takes about 9 seconds to process into sentences....
        // "ideally", we should have some text blob that we know the results of
        // and not be dependent upon the common-corpus (mainly)
        // although I guess we _should_ test that for integration, since it's a component
        // but coding up a test based on indexes of an external package is problematic
        blob = textObj.text();

    return {
      text: blob,
      source: textObj.name
    };
  };

  describe(`poetifier`, function() {

    describe(`API`, function() {
      it(`returns a new instance with new`, function() {
        expect(newpoetifier).to.be.a(`object`);
        expect(newpoetifier).to.be.an.instanceof(Poetifier);
      });

      it(`returns a new instance even without new`, function() {
        var poetifier = Poetifier({config: config});
        expect(poetifier).to.be.a(`object`);
        expect(poetifier).to.be.an.instanceof(Poetifier);
      });

      it(`throws an error if config not supplied as parameter`, function() {
        expect(function() {
          new Poetifier();
        }).to.throw(Error);
      });

      it(`exposes a poem method`, function() {
        expect(newpoetifier.poem).to.be.a(`function`);
      });
    });

    describe(`functional tests`, function() {
      let poem = newpoetifier.poem();
      it(`returns an object`, function() {
        expect(poem).to.be.an(`object`);
      });
      describe(`that has lines`, function() {
        it(`which is an array`, function() {
          expect(poem.lines).to.be.an(`array`);
        });
        // NOTE: as it currently stands, the lib will sometimes return an empty poem
        // if the match is not found, for example
        // so... need some better way of testing/noting this
        // since it's a valid return case
        it(`having non-zero length`, function() {
          expect(poem.lines).to.have.length.above(0);
        });
        it(`and contain strings (or nothing)`, function() {
          // if poem.poem has elements, they are all strings
          // OR it does not have elements
          expect(poem.lines.filter(e => typeof e === `string`)).to.have.length(poem.lines.length);
        });
      });

      describe(`that has text`, function() {
        it(`which is a string`, function() {
          expect(poem.text).to.be.a(`string`);
        });
        // NOTE: as it currently stands, the lib will sometimes return an empty poem
        // if the match is not found, for example
        // so... need some better way of testing/noting this
        // since it's a valid return case
        it(`having non-zero length`, function() {
          expect(poem.text).to.have.length.above(0);
        });
      });

// properties to test for
  // "config",
  // "title",
  // "seed",
  // "source", - optional?
  // "corpora" - optional


    });

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

  });

}());
