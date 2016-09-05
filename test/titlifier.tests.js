'use strict';

(function() {

  let expect = require('chai').expect,
      util = new require('../lib/util.js')(),
      Titlifier = require('../lib/titlifier'),
      titlifier = new require('../lib/titlifier')({util: util});

  describe('titlefier tests', function() {

    describe('API', function() {

      it('should return a new instance with new', function() {
        var newtitlifier = new Titlifier({util: util});
        expect(newtitlifier).to.be.a('object');
        expect(newtitlifier).to.be.an.instanceof(Titlifier);
      });

      it('should return a new instance even without new', function() {
        var titlifier = Titlifier({util: util});
        expect(titlifier).to.be.a('object');
        expect(titlifier).to.be.an.instanceof(Titlifier);
      });

      it('should throw a TypeError if not provided with a util', function() {
        expect(function() {
          new Titlifier();
        }).to.throw(Error);
      });

      it('should expose a generate method', function() {
        expect(titlifier.generate).to.be.a('function');
      });
    });

    describe('generate title', function() {

      it('should return [UNTITLED] if provided with empty string', function() {
        expect(titlifier.generate('')).to.equal('[UNTITLED]');
      });

      it('should return [UNTITLED] if provided with no text', function() {
        expect(titlifier.generate()).to.equal('[UNTITLED]');
      });

    });

  });

}());
