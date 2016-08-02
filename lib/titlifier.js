'use strict';

let Titlifier = function(options) {
  if(!(this instanceof Titlifier)) {
    return new Titlifier(options);
  }

  let ALWAYS_PRINT = 0,
      // TODO: these should be passed in.... maybe
      textutils = require('./textutil.js'),
      util = options.util;

  let log = function(msg) {
    util.debug(msg, ALWAYS_PRINT);
  };

  let titleSummaryStrategy = function(text) {
    let title = '';
    try {
      let in_a = require('in-a-nutshell'),
          // in-a-nutshell replaces newlines with nothing (ouch)
          // defaults to 4 sentences, and will throw error if < 4 (?) found in text
          summary = in_a.nutshell(text.replace(/\n/g, ' '),1).split('\n\n');

      title = util.pick(summary);
      // split on \n\n
      // pick a random line from that
    } catch(ex) {
      log(ex);
      log(text);
    }
    return title;
  };

  let titleLineStrategy = function(lineNbr) {
    return function(text) {
      let lines = text.split('\n');
      if (lineNbr === undefined) {
        // random line, but not the first, not the last
        lineNbr = util.randomInRange(1, lines.length-2);
      }
      if (lineNbr >= lines.length) { lineNbr = lines.length - 1; }
      return lines[lineNbr];
    };
  };

  let titleWordFreq = function(text) {
    let wordfreqs = textutils.wordfreqs(text),
        title = '';

    if (wordfreqs.length > 4) {
      let wordCount = util.randomInRange(2, wordfreqs.length > 10 ? 10 : 4);
      title = wordfreqs.slice(0,wordCount).map(function(elem) { return elem.word; }).join(' ');
    } else {
      title = wordfreqs[0].word;
    }

    return title;
  };

  // TODO: a "line" (chars terminated with a \n) may me an entire paragraph.
  // see: http://poeticalbot.tumblr.com/post/145862142123/aslant-is-perhaps-worlds-great-verse-why-it
  let titlefier = function(text) {
    // wish we could weight this a bit...
    let lines = text.split('\n'),
        first = 0,
        last = lines.length - 1, // TODO: a-ha! we don't know the line-count, yet....
        strategies = [ titleLineStrategy(),
                       titleLineStrategy(first),
                       titleLineStrategy(last),
                       titleWordFreq,
                       titleWordFreq,
                       titleSummaryStrategy
                     ],
        strategy = util.pick(strategies),
        untitled = '[UNTITLED]';

    // if we are unhappy with the times that the Summary is selected
    // make some more programmatic choices
    // make these real strategies -
    // run them all, or do analysis BEFORE picking the final answer?
    // problematic, as word-freqs will be calculated multple times...

    let title = strategy(text) || untitled;

    return title.trim().toUpperCase();

    // TODO: alterate strategies
    // fragment of a line...
    // ???
    // THE + NOUN (And variations thereof)
    // untitled + unixtimestamp
    // "summary" of poem
    //   ... and that line removed?
    // most-common word -- find synonym
    // or other form of lookup?
    // wordnet play....

  };

  this.generate = titlefier;

};

module.exports = Titlifier;
