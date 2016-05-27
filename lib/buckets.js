'use strict';

var buckets = function(config) {
  var util = config.util,
      qb = require('queneau-buckets');

  var incrementinglines = function(q) {

    var lines = [];

    for(var i = 1; i <= 15; i++) {
      lines.push(q.fill(i).trim());
    }

    return lines;

  };

  var decrementinglines = function(q) {

    var lines = [];

    for(var i = 15; i > 0; i--) {
      lines.push(q.fill(i).trim());
    }

    return lines;

  };

  var shortlines = function(q) {

    var lines = [];

    for(var i = 1; i <= 20; i++) {
      lines.push(q.fill(2).trim());
    }

    return lines;

  };

  var diamond = function(q) {

    var lines = [], i;

    for(i = 1; i <= 15; i++) {
      lines.push(q.fill(i).trim());
    }
    for(i = 15; i > 0; i--) {
      lines.push(q.fill(i).trim());
    }

    return lines;

  };

  var drone = function(q) {

    var lineLength = util.getRandomInRange(4,12),
        stanzaLength = util.getRandomInRange(2,5),
        lineCount = util.getRandomInRange(2,8) * stanzaLength,
        lines = [],
        i;

    var repeat = q.fill(lineLength).trim();

    for (i = 0; i < lineCount; i+=stanzaLength) {
      for(var j = 0; j < stanzaLength; j++) {
        lines.push(q.fill(lineLength).trim());
      }
      lines.push(repeat, '');
    }

    return lines;

  };


  this.generate = function() {

    var debreak = require('../lib/debreak.js'),
        nlp = require('nlp_compromise'),
        book = debreak(util.pick(config.texts).text())
          .replace(/\t/g, ' ')
          .replace(/ +/g, ' '),
        s = nlp.text(book),
        sentences = s.sentences.map(s => s.str.trim()),
        q = (qb()).seed(sentences),
        poem = '',
        strategies = [incrementinglines,
                      decrementinglines,
                      shortlines,
                      diamond,
                      drone],
        strategy = util.pick(strategies);

    poem = strategy(q).join('\n');

    return {
      text: poem
    };

    // TODO: some sort of unique HOWL titleifier
  };

};

module.exports = buckets;
