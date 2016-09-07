'use strict';

var bucketRunner = function(config) {
  var util = config.util,
      textutil = require('./textutil'),
      qb = require('./queneau-buckets-modified');

  if (util === undefined) {
    throw Error('util must be supplied as part of config');
  }

  if (config.texts === undefined) {
    throw Error('texts array must be supplied as part of config');
  }

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

  // TODO: this is something that could be used with multiple generators...
  var drone = function(q) {
    var lineLength = util.randomInRange(4,12),
        stanzaLength = util.randomInRange(2,5),
        lineCount = util.randomInRange(2,8) * stanzaLength,
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
    var text = config.texts.map(t => t.text()),
        sentences = textutil.sentencify(text),
        q = (qb(config)).seed(sentences),
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
  };
};

module.exports = bucketRunner;
