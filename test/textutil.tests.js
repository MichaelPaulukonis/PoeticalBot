'use strict';

// execute with `mocha test.js`

(function() {

  var chai = require('chai'),
      expect = chai.expect,
      textutils = require('../lib/textutil.js');


  describe('textutil', function() {

    describe('API', function() {

      it('Util should expose a wordfreqs method', function() {
        expect(textutils.wordfreqs).to.be.a('function');
      });

      it('Util should expose a wordbag method', function() {
        expect(textutils.wordbag).to.be.a('function');
      });

      it('should expose a cleaner method', function() {
        expect(textutils.cleaner).to.be.a('function');
      });

    });

    describe('wordbag', function() {
      var bag = textutils.wordbag('this is some text');

      it('should return an object', function() {
        expect(bag).to.be.an('object');
      });

      it('should have a "text" property', function() {
        expect(bag.text).to.be.instanceOf(Array);
      });
    });

    describe('wordfreqs', function() {
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

    describe('cleaner', function() {
      var unbalancedParens = 'some text(that needs[cleaning]',
          unbalancedBrackets = 'some text(that needs[cleaning)',
          cleanParens = textutils.cleaner(unbalancedParens),
          cleanBrackets = textutils.cleaner(unbalancedBrackets);
      it('should return a string', function() {
        expect(cleanParens).to.be.a('string');
        expect(cleanBrackets).to.be.a('string');
      });
      it('should remove unbalancedParens', function() {
        expect(cleanParens.match(/\(|\)/g)).to.be.null;
      });
      it('should remove unbalancedBrackets', function() {
        expect(cleanBrackets.match(/\[|\]/g)).to.be.null;
      });
      it('should not remove balanced parens', function() {
        expect(cleanBrackets.match(/\(|\)/g)).to.not.be.null;
      });
      it('should not remove balanced brackets', function() {
        expect(cleanParens.match(/\[|\]/g)).to.not.be.null;
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
