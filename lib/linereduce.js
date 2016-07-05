'use strict';

var Linereduce = function(config) {
  if(!(this instanceof Linereduce)) {
    return new Linereduce(config);
  }

  let util = config.util,
      debreak = require('../lib/debreak.js'),
      lf = require('../lib/linefind.js'),
      nlp = require('nlp_compromise'),
      // strip both ends of '"No.'
      // leave hyphen in 'wicket-bag'
      // 681 for Hadet read Halet = haled = exiled (?).
      // final word is ' (?)' which is a mess.
      // we just want to leave a middle-hyphen...
      // stripPunct = (t) => t.replace(/^[^a-z0-9\]|[^a-z0-9]$/ig, '');
      stripPunct = (t) => t.replace(/[^a-z0-9-]/ig, '');

  // TODO: should be just ONE BLOODY TEXT
  // let the caller decide what to do
  this.filter = function() {
    // let book = debreak(util.pick(config.texts).text())
    let book = debreak(config.text)
          .replace(/\t/g, ' ')
          .replace(/ +/g, ' '),
        s = nlp.text(book),
        sentences = s.sentences.map(s => s.str.trim()),
        targSent = util.pick(sentences).split(' '),
        startWord = stripPunct(targSent[0]),
        endWord = stripPunct(targSent[targSent.length - 1]),
        optionalPuncts = '[.\'"!?]?';

    // console.log(`endWord: ${endWord}\nsentence: ${targSent.join(' ')}`);

    // interesting problem for 'hello there and thanks on your info ?'
    // since our last-word split will be '?' which is then stipped of puncts.

    // let reduced = lf.search({ text: sentences, search: new RegExp('^' + startWord.toLowerCase(), 'i')});
    let reduced = lf.search({ text: sentences,
                              search: config.search});
                              // search: new RegExp(endWord.toLowerCase() + optionalPuncts + '$', 'i')});
                              // search: new RegExp(endWord.toLowerCase() + '$', 'i')});

    return { lines: reduced, text: reduced.join('\n')};
  };

  return this;

};

module.exports = Linereduce;
