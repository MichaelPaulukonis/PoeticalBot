'use strict';

let titleTypes = {RandomLine: 'RandomLine',
                  LineFirst: 'LineFirst',
                  LineLast: 'LineLast',
                  WordFreq: 'WordFreq',
                  Summary: 'Summary'
                 };

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

  // TODO: things that are known to throw exceptions should be handled and NOT go in here...
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
      log('titleSummaryStrategy has encountered an exception:');
      log(ex.stck || ex);
      log(text);
      throw new Error(ex);
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
      if (wordfreqs[0] && wordfreqs[0].word) {
        title = wordfreqs[0].word;
      }
    }

    return title;
  };

  // TODO: a "line" (chars terminated with a \n) may be an entire paragraph.
  // see: http://poeticalbot.tumblr.com/post/145862142123/aslant-is-perhaps-worlds-great-verse-why-it
  let titlefier = function(text, titlemethod) {
    let untitled = '[UNTITLED]';

    if (!text) { return untitled; }

    // wish we could weight this a bit...
    let lines = text.split('\n'),
        first = 0,
        last = lines.length > 0 ? lines.length - 1 : 0, // if only one line...
        strategies = [ titleLineStrategy(),
                       titleLineStrategy(first),
                       titleLineStrategy(last),
                       titleWordFreq,
                       titleWordFreq,
                       titleSummaryStrategy
                     ],
        FuzzyMatching = require('fuzzy-matching'),
        titleMethods = Object.keys(titleTypes),
        fmMethods = new FuzzyMatching(titleMethods),
        strategy;

    // TODO: pass in strategy to use
    // TODO: not have this horrible hard-coded index to the strategies...
    if (titlemethod) {
      let method = fmMethods.get(titlemethod).value;
      switch (method) {
      case 'RandomLine':
        strategy = strategies[0];
        break;

      case 'LineFirst':
        strategy = strategies[1];
        break;

      case 'LineLast':
        strategy = strategies[2];
        break;

      case 'WordFreq':
        strategy = strategies[3];
        break;

        // strategies[4] is the same as 3 to give a higher random weighting

      case 'Summary':
        strategy = strategies[5];
        break;
      }
    }

    if (!strategy) {
      strategy = util.pick(strategies);
    }

    // if we are unhappy with the times that the Summary is selected
    // make some more programmatic choices
    // make these real strategies -
    // run them all, or do analysis BEFORE picking the final answer?
    // problematic, as word-freqs will be calculated multple times...

    let title = strategy(text) || untitled;

    // TODO: return the used method, and the line, if applicable
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

module.exports.Titlifier = Titlifier;
module.exports.types = titleTypes;
