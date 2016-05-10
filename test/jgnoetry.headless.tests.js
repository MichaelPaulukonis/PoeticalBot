'use strict';

// execute with `mocha test.js`

(function() {

  var chai = require('chai'),
      expect = chai.expect,
      Util = require('../util.js'),
      util = new Util(),
      jGnoetry = require('../jgnoetry.headless.js'),
      jg = new jGnoetry(util.debug);

  describe('util tests', function() {

    describe('API tests', function() {

      it('jGneotry should return a new instance with new', function() {
        var jg = new jGnoetry();
        expect(jg).to.be.a('object');
        expect(jg).to.be.an.instanceof(jGnoetry);
      });

      it('jGneotry should return a new instance even without new', function() {
        var jg = jGnoetry();
        expect(jg).to.be.a('object');
        expect(jg).to.be.an.instanceof(jGnoetry);
      });

      it('jGneotry should expose a generate method', function() {
        expect(jg.generate).to.be.a('function');
      });

    });

    it('should return a string when called with proper params', function() {

      // TODO: this setup is a pain in the ass!
      // can't there some sort of default stuff built in?

      // corpora.texts = reduceCorpora(corpora.texts);
      // corpora.weights = assignWeights(corpora.texts.length);
      // var templateName = util.pick(Object.keys(templates));
      // options.capitalize = assignCapitalization();
      // options.appendToPoem = util.pick(endPuncts);

      // util.debug(JSON.stringify(options, null, 2), 0);
      // util.debug(templateName, 0);
      // util.debug(corpora.weights.join(' '), 0);

      // var titles = corpora.texts.map(t => t.name);
      // corpora.texts = corpora.texts.map(b => b.text);
      // var output = jg.generate(templates[templateName], options, corpora, existingText);

    });

  });

}());
