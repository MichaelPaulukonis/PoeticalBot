'use strict';

// execute with `mocha test.js`

(function() {

  var chai = require('chai'),
      expect = chai.expect,
      textutils = require('../lib/textutil.js');;


  describe('textutil tests', function() {

    describe('API tests', function() {

      // it('Util should return a new instance with new', function() {
      //   var newutil = new Util();
      //   expect(newutil).to.be.a('object');
      //   expect(newutil).to.be.an.instanceof(Util);
      // });

      // it('Util should return a new instance even without new', function() {
      //   var util = Util();
      //   expect(util).to.be.a('object');
      //   expect(util).to.be.an.instanceof(Util);
      // });

      it('Util should expose a wordfreqs method', function() {
        expect(textutils.wordfreqs).to.be.a('function');
      });

      it('Util should expose a wordbag method', function() {
        expect(textutils.wordbag).to.be.a('function');
      });

    });

    describe('wordbag tests', function() {
      var bag = textutils.wordbag('this is some text');

      it('should return an object', function() {
        expect(bag).to.be.an('object');
      });

      it('should have a "text" property', function() {
        expect(bag.text).to.be.instanceOf(Array);
      });
    });

    describe('wordfreqs tests', function() {
      var wf = textutils.wordfreqs('this is some text');
      it('should return an array', function() {
        expect(wf).to.be.instanceOf(Array);
      });
      it('each element should be an object', function() {
        expect(wf[0]).to.be.an('object');
      });
      it('the element should have a word property, that is a string', function() {
        expect(wf[0].word).to.be.a('string');
      });
      it('shouls have a count property that is a number', function() {
        expect(wf[0].count).to.be.an('number');
      });
    });

  });

}());


// var textutils = require('./lib/textutil.js'),
//     wordfreqs = textutils.wordfreqs(text),
//     title = '';

// if (wordfreqs.length > 4) {
//   var wordCount = util.getRandomInRange(2, wordfreqs.length > 10 ? 10 : 4);
//   title = wordfreqs.slice(0,wordCount).map(function(elem) { return elem.word; }).join(' ');
// } else {
//   title = wordfreqs[0].word;
// }

// return title.toUpperCase();
