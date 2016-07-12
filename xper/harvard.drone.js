'use strict';

let sentences = require('../xper/harvard.sentences.js'),
    util = new require('../lib/util')();

// alternative - first and last lines repeat
// alternative - EVERY OTHER LINE REPEATS
var drone = function(q) {
  var stanzaLines = util.randomInRange(2,6),
      stanzaCount = util.randomInRange(2,9),
      lines = [],
      i;

  console.log(`lines: ${stanzaLines} stanzas: ${stanzaCount}`);

  var repeat = util.pick(sentences);

  for (i = 0; i < stanzaCount; i++) {
    lines = lines.concat(util.pickCount(sentences, stanzaLines-1));
    // for(var j = 0; j < stanzaLines; j++) {
    //   lines.push(util.pick(sentences));
    // }
    lines.push(repeat, '');
  }
  return lines;
};

console.log(drone().join('\n'));
