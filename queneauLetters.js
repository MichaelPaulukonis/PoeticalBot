'use strict';

// extracted from my modified lexeduct, gh-pages branch
var QueneauLetters = function(cfg) {

  if(!(this instanceof QueneauLetters)) {
    return new QueneauLetters(cfg);
  }

  var getRandomInRange = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var coinflip = function(chance) {
    if (!chance) { chance = 0.5; }
    return (Math.random() < chance);
  };

  this.generate = function(text) {

    var ql = require('queneau-letters');

    var out = [];
    var lines = text.split('\n');

    for (var i = 0; i < lines.length; i++) {
      // TODO: VERY NAFF, and borks the punctuation.
      var words = lines[i].split(' '),
          line = [],
          q = ql();

      q.seed(words);

      for (var w = 0, ll = words.length; w < ll; w++) {
        line.push(q.fill(words[w].length));
      }

      out.push(line.join(' '));
    }

    return out.join('\n');

  };

};

module.exports = { queneauLetters: QueneauLetters };
