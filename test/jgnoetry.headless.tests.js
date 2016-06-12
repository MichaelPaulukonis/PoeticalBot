'use strict';

// execute with `mocha test.js`

(function() {

  var chai = require('chai'),
      expect = chai.expect,
      Util = require('../lib/util.js'),
      util = new Util(),
      jGnoetry = require('../lib/jgnoetry.headless.js'),
      jg = new jGnoetry(util.debug);

  describe('util tests', function() {

    describe('jGnoetry API tests', function() {

      it('should return a new instance with new', function() {
        var jg = new jGnoetry();
        expect(jg).to.be.a('object');
        expect(jg).to.be.an.instanceof(jGnoetry);
      });

      it('should return a new instance even without new', function() {
        var jg = jGnoetry();
        expect(jg).to.be.a('object');
        expect(jg).to.be.an.instanceof(jGnoetry);
      });

      it('should expose a generate method', function() {
        expect(jg.generate).to.be.a('function');
      });

      // TODO: makeTemplate exposure
      it('should expose a makeTemplate method', function() {
        expect(jg.makeTemplate).to.be.a('function');
      });

    });

    it('should return a string when called with proper params', function() {

      // TODO: this setup is a pain in the ass!
      // can't there some sort of default stuff built in?

      var options = {'handlePunctuation': 'noParen', 'byNewlineOrPunctuation': 'punctuation', 'capitalize': { 'method': 'capitalizeCustom', 'customSentence': true, 'customLine': true, 'customI': true }, 'appendToPoem': 'appendPeriod', 'areWordsSelectedBegin': 'startSelected', 'thisWordSelectedBegin': 'startSelected', 'changeSelectionEffect': 'requiresClick', 'statusVerbosity': 1},
          corpora = {texts: ['this is the cat that was over there with the mill.'], weights: [100]},
          template = '[s] [n] ',
          existingText = '';

      // corpora.texts = reduceCorpora(corpora.texts);
      // corpora.weights = assignWeights(corpora.texts.length);
      // var templateName = util.pick(Object.keys(templates));
      // options.capitalize = assignCapitalization();
      // options.appendToPoem = util.pick(endPuncts);

      // util.debug(JSON.stringify(options, null, 2), 0);
      // util.debug(templateName, 0);
      // util.debug(corpora.weights.join(' '), 0);

      var output = jg.generate(template, options, corpora, existingText);

      expect(output).to.be.an('object');

    });

    it('should keep existingText when told', function() {

var options = {'handlePunctuation': 'noParen', 'byNewlineOrPunctuation': 'punctuation', 'capitalize': { 'method': 'capitalizeCustom', 'customSentence': true, 'customLine': true, 'customI': true }, 'appendToPoem': 'appendPeriod', 'areWordsSelectedBegin': 'startSelected', 'thisWordSelectedBegin': 'startSelected', 'changeSelectionEffect': 'requiresClick', 'statusVerbosity': 1},
    corpora = { texts: ['the cat the dog the oboe and the mill were in the dob barn with the rat'], weights: [100]},
          template = '[s] [s] [n] ',
    existingText = [ { text: 'the', keep: true }, { text: 'the', keep: false } ];

      var output = jg.generate(template, options, corpora, existingText),
          // hrm. we've got a leading-space issue in jgnoetry....
          words = output.displayText.trim().split(' ');

      expect(output).to.be.an('object');
      expect(output.displayText).to.be.a('string');
      expect(words[0].toLowerCase()).to.equal(existingText[0].text.toLowerCase());
    });

  });

}());
