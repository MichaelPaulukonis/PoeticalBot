'use strict';

let Harvard = function(config) {
  if (!(this instanceof Harvard)) {
    return new Harvard(config);
  }

  let sentences = require('../corpus/harvard.sentences.js'),
      util = config.util;

  // alternative - first and last lines repeat
  // alternative - EVERY OTHER LINE REPEATS
  let drone = function() {
    let stanzaLines = util.randomInRange(2,6),
        stanzaCount = util.randomInRange(2,9),
        lines = [];

    let repeat = util.pick(sentences);

    for (let i = 0; i < stanzaCount; i++) {
      lines = lines.concat(util.pickCount(sentences, stanzaLines-1));
      lines.push(repeat);
      if (i < stanzaCount - 1) { lines.push(''); }
    }
    return lines;
  };

  let bookends = function() {
    let lineCount = util.randomInRange(5,25),
        repeat = util.pick(sentences),
        lines = [];

    lines.push(repeat);
    lines = lines.concat(util.pickCount(sentences, lineCount - 2));
    lines.push(repeat);

    return lines;
  };

  let alternate = function() {
    let lineCount = util.randomInRange(3,25),
        repeat = util.pick(sentences),
        lines = [];

    for (let i = 0; i < lineCount; i+=2) {
      lines.push(util.pick(sentences));
    lines.push(repeat);
    }

    return lines;
  };

  this.generate = function() {
    let methods = [drone, bookends, alternate],
        method = util.pick(methods),
        lines = method(),
        poem = { lines: lines,
                 text: lines.join('\n')
               };

    return poem;
  };
};

module.exports = Harvard;
