'use strict';

var reduceType = {
  'search': 'Plaintext or regular expression search',
  'start': 'Match at start of sentence',
  'end': 'Match at end of sentence (plus optional punctuation)'
};

var LineReduce = function(config) {
  if(!(this instanceof LineReduce)) {
    return new LineReduce(config);
  }

  let util = config.util,
      textutil = require('../lib/textutil'),
      lf = require('../lib/linefind.js'),
      // strip both ends of '"No.'
      // leave hyphen in 'wicket-bag'
      // 681 for Hadet read Halet = haled = exiled (?).
      // final word is ' (?)' which is a mess.
      // we just want to leave a middle-hyphen...
      // stripPunct = (t) => t.replace(/^[^a-z0-9\]|[^a-z0-9]$/ig, '');
      stripPunct = (t) => t.replace(/[^a-z0-9-]/ig, '');

  // WHAT THE WHAT -- why is the text in the config of the constructor ?!??!
  // THAT MAKES NO SENSE
  this.filter = function(opts) {
    let sentences = textutil.sentencify(opts.text),
        // sentences is used by all
        // targSent, startWord, endWord and optionalPuncts only by.. start and end
        // but we keep 'em here, anyway
        targSent = util.pick(sentences).split(' '),
        startWord = stripPunct(targSent[0]),
        endWord = stripPunct(targSent[targSent.length - 1]),
        optionalPuncts = '[.\'"!?]?',
        search;

    switch (opts.type) {
    case reduceType.search:
      search = opts.search;
      break;

    case reduceType.start:
      search = new RegExp('^' + startWord.toLowerCase(), 'i');
      break;

    case reduceType.end:
      search = new RegExp(endWord.toLowerCase() + optionalPuncts + '$', 'i');
      break;

      // TODO: default case - random selection, I guess
    }
    // interesting problem for 'hello there and thanks on your info ?'
    // since our last-word split will be '?' which is then stipped of puncts.
    let reduced = lf.search({ text: sentences,
                              search: search});

    return { lines: reduced, text: reduced.join('\n')};
  };

  return this;

};

module.exports.LineReduce = LineReduce;
module.exports.types = reduceType;
