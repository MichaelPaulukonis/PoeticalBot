'use strict';

var bucketRunner = function(config) {
  var util = config.util,
      textutil = require(`./textutil`),
      queneauBuckets = require(`./queneau-buckets-modified`);

  if (util === undefined) {
    throw Error(`util must be supplied as part of config`);
  }

  if (config.texts === undefined) {
    throw Error(`texts array must be supplied as part of config`);
  }

  var incrementinglines = function(q) {
    var lines = [],
        lineCount = 15;

    for(var i = 1; i <= lineCount; i++) {
      lines.push(q.fill(i).trim());
    }

    // return lines;
    return {
      lines: lines,
      config: {
        strategy: `incrementinglines`,
        lineCount: lineCount
      }
    };
  };

  var decrementinglines = function(q) {
    var lines = [],
        lineCount = 15;

    for(var i = lineCount; i > 0; i--) {
      lines.push(q.fill(i).trim());
    }

    return {
      lines: lines,
      config: {
        strategy: `decrementinglines`,
        lineCount: lineCount
      }
    };
  };

  var shortlines = function(q) {
    var lines = [],
        lineCount = 20,
        wordsPerLine = 2;

    for(var i = 1; i <= lineCount; i++) {
      lines.push(q.fill(wordsPerLine).trim());
    }

    return {
      lines: lines,
      config: {
        strategy: `shortlines`,
        lineCount: lineCount,
        wordsPerLine: wordsPerLine
      }
    };
  };

  var diamond = function(q) {
    var lines = [],
        i,
        lineCount = 30,
        limit = Math.floor(lineCount / 2);

    for(i = 1; i <= limit; i++) {
      lines.push(q.fill(i).trim());
    }
    for(i = limit; i > 0; i--) {
      lines.push(q.fill(i).trim());
    }

    return {
      lines: lines,
      config: {
        strategy: `diamond`,
        lineCount: lineCount
      }
    };
  };

  var drone = function(q) {
    var lineLength = util.randomInRange(4,12), // words per line
        stanzaLength = util.randomInRange(2,5), // total stanzas
        lineCount = util.randomInRange(2,8) * stanzaLength, // this could have been stanzaCount with different math
        lines = [],
        i;

    var repeat = q.fill(lineLength).trim();

    for (i = 0; i < lineCount; i+=stanzaLength) {
      for(var j = 0; j < stanzaLength; j++) {
        lines.push(q.fill(lineLength).trim());
      }
      lines.push(repeat, ``);
    }
    return {
      lines: lines,
      config: {
        strategy: `drone`,
        lineCount: lineCount,
        lineLength: lineLength,
        stanzaCount: stanzaLength
      }
    };
  };

  var enforceEndingPunct = function(lines) {
    var re = /[.?!]$|^$/;
    lines = lines.map((l) => re.test(l) ? l : l + '.');
    return lines;
  };

  this.generate = function() {
    var text = config.texts.map(t => t.text()),
        sentences = textutil.sentencify(text),
        q = (queneauBuckets(config)).seed(sentences),
        poem = {},
        strategies = [incrementinglines,
                      decrementinglines,
                      shortlines,
                      diamond,
                      drone],
        strategy = util.pick(strategies);

    // TODO: currently all are local vars and not passed in, either
    // so, that'll have to change....
    poem = strategy(q);

    // TODO: enforce some punctuation
      //        if (options.appendToPoem == `appendPeriod`) {
      //   wordToPrint = `.`;
      // } else if (options.appendToPoem == `appendQuestion`) {
      //   wordToPrint = `?`;
      // } else if (options.appendToPoem == `appendExclamation`) {
      //   wordToPrint = `!`;
    // }
    poem.lines = enforceEndingPunct(poem.lines);

    return {
      text: poem.lines.join(`\n`),
      lines: poem.lines,
      config: poem.config
    };
  };
};

module.exports = bucketRunner;
