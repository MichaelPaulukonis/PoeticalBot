'use strict';

var fone = function(text) {

  var nlp = require('nlp_compromise'),
      textutil = require('../lib/textutil'),
      nlpPronounce = require('nlp-pronounce'),
      lines = text.split('\n');

  nlp.plugin(nlpPronounce);

  // TODO: if not pronounceable, use original word fragment
  // so maybe..... word by word?
  for(var i = 0, len = lines.length; i < len; i++) {
    var t = nlp.text(lines[i]);
    lines[i] = textutil.fonetikfix(t.pronounce());
  }
  text = lines.join('\n');

  return text;

};

module.exports = fone;
