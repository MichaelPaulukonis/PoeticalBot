'use strict';

var Harvard = function(config) {
  if (!(this instanceof Harvard)) {
    return new Harvard(config);
  }

  let sentences = require('../corpus/harvard.sentences.js'),
      util = config.util;

  // alternative - first and last lines repeat
  // alternative - EVERY OTHER LINE REPEATS
  var drone = function() {
    var stanzaLines = util.randomInRange(2,6),
        stanzaCount = util.randomInRange(2,9),
        lines = [];

    var repeat = util.pick(sentences);

    for (let i = 0; i < stanzaCount; i++) {
      lines = lines.concat(util.pickCount(sentences, stanzaLines-1));
      lines.push(repeat);
      if (i < stanzaCount - 1) { lines.push(''); }
    }
    return lines;
  };

  this.generate = function() {
    return drone();
  };
};

module.exports = Harvard;
