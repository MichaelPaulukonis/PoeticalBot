'use strict';

(function() {

  let expect = require('chai').expect,
      util = new require('../lib/util.js')(),
      newcorpora = new require('../lib/corpora')(),
      BucketRunner = require('../lib/bucketRunner.js'),
      // must provide util AND texts
      // texts 0 (history of art, > 2000ms) ,1 are a bit long. ugh. this is awkward
      // 2 is Ginsberg's Howl
      bucketRunner = new BucketRunner({util: util, texts: [newcorpora.texts[2]]});

  describe('bucketRunner tests', function() {
    describe('API', function() {
      it('should return a new instance with new', function() {
        var newbr = new BucketRunner({util: util, texts: [newcorpora.texts[2]]});
        expect(newbr).to.be.a('object');
        expect(newbr).to.be.an.instanceof(BucketRunner);
      });

      it('should return a new instance even without new', function() {
        var br = new BucketRunner({util: util, texts: [newcorpora.texts[2]]});
        expect(br).to.be.a('object');
        expect(br).to.be.an.instanceof(BucketRunner);
      });

      it('should throw a TypeError if not provided with a util', function() {
        expect(function() {
          new BucketRunner({texts: [newcorpora.texts[2]]});
        }).to.throw('util must be supplied as part of config');
      });

      it('should throw a TypeError if not provided with an array of text objects', function() {
        expect(function() {
          new BucketRunner({util: util});
        }).to.throw('texts array must be supplied as part of config');
      });

      it('should expose a generate method', function() {
        expect(bucketRunner.generate).to.be.a('function');
      });
    });

    // TODO: a) this is slow b) atomize the tests
    describe('generate tests', function() {
      it('should return text', function() {
        let poem = bucketRunner.generate();
        expect(poem).to.be.an('object');
        expect(poem.text).to.be.a('string');
      });

    });

  });

}());
