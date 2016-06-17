'use strict';

// extracted from my modified lexeduct, gh-pages branch
var InitialSpaces = function(cfg) {

  if(!(this instanceof InitialSpaces)) {
    return new InitialSpaces(cfg);
  }

  let util = (cfg && cfg.util) ? cfg.util : { log: (msg) => console.log(msg) },
      pos = require('pos'), // these are dependencies required from another module
      lexer = new pos.Lexer(),
      stopwords = require('../lib/stopwords.js'),
      rhymes = require('rhymes');

  this.generate = function(text) {

    let out = [],
        lines = text.split('\n');
    try {
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i],
            words = lexer.lex(line),
            newwords = '';
        // hrm. if rhyme exists, double up the words?
        // except for stop words and things like that
        // and not EVERY words, that would be annoying.
        for (let j = 0; j < words.length; j++) {
          // if this word is puncations or stopword, don't do it
          let word = words[j],
              r = ' ';
          console.log(`word: ${word} - indexOf: ${stopwords.indexOf(word)}`);
          if (stopwords.indexOf(word) === -1) {
            let ro = rhymes(word);
            r = ro.length == 0 ? '' : ro.filter(w => w.word !== word && w.word.indexOf(word) === -1)[0].word + ' ';
            // clean it
            r = '-' + r.replace(/\([0-9]\)/g, '');
          }
          newwords += word + r;
        }
        out.push(newwords.trim());
      }
    } catch(ex) {
      return util.log(JSON.stringify(ex));
    }
    return out.join('\n');

  };

};

module.exports = InitialSpaces;
