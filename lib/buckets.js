'option strict';

var buckets = function(config, util) {

  if (config === undefined) {
    config = {
      texts: require('../defaultTexts.js')
    };
  }

  if (util === undefined) {
    util = new require('../util.js')({statusVerbosity: 0});
  }

  var qb = require('queneau-buckets');

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



  this.generate = function() {

    var book = util.pick(config.texts).text
          .replace(/\n\n/g, '\n')
          .replace(/\t/g, ' ')
          .replace(/ +/g, ' ')
          .replace(/^\s+/g, '')
          .split(/\r\n|\r|\n/),
        q = (qb()).seed(book),
        poem = '',
        strategies = [incrementinglines,
                      decrementinglines,
                      shortlines,
                      diamond
                     ],
        strategy = util.pick(strategies);

    poem = strategy(q).join('\n');

    return {
      text: poem
    };

    // TODO: some sort of unique HOWL titleifier
  };

};

module.exports = buckets;
