'use strict';

// extracted from my modified lexeduct, gh-pages branch
var InitialSpaces = function(cfg) {

  if(!(this instanceof InitialSpaces)) {
    return new InitialSpaces(cfg);
  }

  var util = cfg.util;

  var defaultConfig = {
    offset: 20,
    offsetVariance: 20,
    offsetProbability: 0.8
  };

  this.config = {
    offset: (cfg && cfg.offset ? cfg.offset : defaultConfig.offset),
    offsetVariance: (cfg && cfg.offsetVariance ? cfg.offsetVariance : defaultConfig.offsetVariance),
    offsetProbability: (cfg && cfg.offsetProbability ? cfg.offsetProbability : defaultConfig.offsetProbability)
  };

  this.generate = function(text) {

    var out = [];
    var lines = text.split('\n');

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (line.length > 0 && util.coinflip(this.config.offsetProbability)) {
        var variance = util.randomInRange(-this.config.offsetVariance, this.config.offsetVariance);
        // +1, since when you join a 1-length array, you don't get the join-character.
        var spaceCount = this.config.offset + variance + 1;
        var spaces = Array(spaceCount).join(' ');
        line = spaces + line;
      }
      out.push(line);
    }

    return out.join('\n');

  };

};

module.exports = InitialSpaces;
