'use strict';

(function() {

  var expect = require('chai').expect,
      util = new require('../lib/util.js')(),
      Titlifier = require('../lib/titlifier'),
      titlifier = new require('../lib/titlifier')({util: util});

      // titlifier.generate(poem.text);


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

      it('should expose a generate method', function() {
        expect(titlifier.generate).to.be.a('function');
      });

      // TODO: okay, now actually test the methods!

    });

  });

}());
