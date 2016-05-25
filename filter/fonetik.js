'use strict';

var fone = function(text) {

  var nlp = require('nlp_compromise'),
      nlpPronounce = require('nlp-pronounce'),
      lines = text.split('\n');

  nlp.plugin(nlpPronounce);

  // TODO: if not pronounceable, use original word fragment
  // so maybe..... word by word?
  for(var i = 0, len = lines.length; i < len; i++) {
    var t = nlp.text(lines[i]);
    lines[i] = t.pronounce().replace(/\b0|0\b/g, 'th');
  }
  text = lines.join('\n');

  return text;

};

module.exports = fone;
