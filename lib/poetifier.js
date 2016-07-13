'use strict';

var Poetifier = function(options) {
  if(!(this instanceof Poetifier)) {
    return new Poetifier(options);
  }

  let util = new require('./util.js')({statusVerbosity: 0, seed: options.config.seed });
  // options = options || { config: {} }; // doesn't make sense if we're referencing it prior
  options.util = util;

  // TODO: pass in util (for randomization) to jgnoetry and mispelr
  let jgnoetry = require('./jgnoetryRunner.js'),
      harvarddrone = new require('./harvard.drones')({util: util}),
      mispelr = require('node-mispelr'),
      ALWAYS_PRINT = 0,
      fonetik = require('../filter/fonetik'),
      rhymer = require('../filter/rhymer')({ util: util}),
      textutils = require('./textutil.js'),
      FuzzyMatching = require('fuzzy-matching'),
      poemMethods = ['jgnoetry', 'queneau-buckets', 'harvarddrone'],
      fmMethods = new FuzzyMatching(poemMethods),
      config = options.config;

  let logger = function(msg) {
    util.debug(msg, ALWAYS_PRINT);
  };
  util.log = logger;

  // TODO: make this a module, as well....
  var reduceCorpora = function(texts) {
    var strategies = [ corporaSevenStrategy,
                       corporaSevenStrategy,
                       corporaFilterStrategy('oz|apocalypsenow'),
                       corporaFilterStrategy('finnegan|oz'),
                       corporaFilterStrategy('oz|egypt'),
                       corporaFilterStrategy('sms'),
                       corporaFilterStrategy('shakespeare'),
                       corporaFilterStrategy('cyberpunk'),
                       corporaFilterStrategy('western'),
                       corporaFilterStrategy('gertrudestein'),
                       corporaFilterStrategy('computerculture'),
                       corporaFilterStrategy('filmscripts'),
                       corporaFilterStrategy('spam'),
                       corporaFilterStrategy('2001'),
                       corporaFilterStrategy('odyssey'),
                       corporaFilterStrategy('singing'),
                       corporaFilterStrategy('egypt'),
                       corporaFilterStrategy('manifesto'),
                       corporaFilterStrategy('ascii|emoticon'),
                       corporaFilterStrategy('marx'),
                       corporaFilterStrategy('james.joyce'),
                       corporaFilterStrategy('poetry'),
                       corporaFilterStrategy('eliot'),
                       corporaFilterStrategy('imagist'),
                       corporaFilterStrategy('whitman'),
                       corporaFilterStrategy('longfellow'),
                       corporaFilterStrategy('moby'),
                       corporaFilterStrategy('pride.and.prejudice'),
                       corporaFilterStrategy('lowell'),
                       corporaFilterStrategy('rome')
                     ],
        strategy;

    if (config.corporaFilter) {
      strategy = corporaFilterStrategy(config.corporaFilter);
    } else {
      strategy = util.pick(strategies);
    }

    return strategy(texts);
  };

  // Todo: get a generic one to take in a numeric parameter
  var corporaSevenStrategy = function(corpus) {
    var newCorpus = [];

    for (var i = 0; i < 7; i++) {
      newCorpus.push(util.pickRemove(corpus));
    }

    return newCorpus;
  };

  var corporaFilterStrategy = function(filter) {
    return function(corpus) {
      var r = new RegExp(filter, 'i');
      return corpus.filter(m => m.name.match(r) !== null);
    };
  };

  let transformer = function(poem) {

    let stragegies = [ transformRhymer,
                       transformSort,
                       transformLeadingSpaces,
                       transformMispeller,
                       transformFonetik
                     ],
        strategy = util.pick(stragegies);

    let chance = config.transformChance || 0.25;
    // only applies this 25% of the time
    return util.coinflip(chance) ? strategy(poem) : poem;

  };

  let transformRhymer = function(poem) {
    console.log(JSON.stringify(poem));
    poem.text = rhymer.generate(poem.text);
    return poem;
  };

  let transformFonetik = function(poem) {
    poem.text = fonetik(poem.text);
    return poem;
  };

  let transformLeadingSpaces = function(poem) {
    let config = { offset: util.randomInRange(5,25),
                   offsetVariance: util.randomInRange(10,25),
                   offsetProbability: util.randomInRange(5,10)/10,
                   util: util
                 },
        transform = new require('../filter/transform.js')(config),
        noLeadingSpaceTemplates = ['howl', 'haiku', 'couplet'];
    if (noLeadingSpaceTemplates.indexOf(poem.template) === -1) {
      logger('initial spaces');
      poem.text = transform.generate(poem.text);
    }

    return poem;

  };

  let transformMispeller = function(poem) {
    let spelltype = util.randomProperty(mispelr.spelltypes);
    logger(`spelltype: ${spelltype}`);
    poem.text = mispelr.respell(poem.text, spelltype);
    return poem;
  };

  let transformSort = function(poem) {

    let caseInsensitiveSort = function(a, b) {
      a = a.toUpperCase(); // ignore upper and lowercase
      b = b.toUpperCase(); // ignore upper and lowercase
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }

      return 0;
    };

    let lines = poem.text.split('\n').sort(caseInsensitiveSort);
    if (util.coinflip()) { lines = lines.reverse(); }
    poem.text = lines.filter(l => l.trim().length > 0).join('\n');
    return poem;
  };

  // TODO: a "line" (chars terminated with a \n) may me an entire paragraph.
  // see: http://poeticalbot.tumblr.com/post/145862142123/aslant-is-perhaps-worlds-great-verse-why-it
  let titlefier = function(text) {
    // wish we could weight this a bit...
    var strategies = [ titleLineStrategy(),
                       titleLineStrategy(0),
                       titleLineStrategy(text.length-1),
                       titleWordFreq,
                       titleWordFreq,
                       titleSummaryStrategy
                     ],
        strategy = util.pick(strategies);

    // if we are unhappy with the times that the Summary is selected
    // make some more programmatic choices

    return strategy(text).trim().toUpperCase();

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

  var titleSummaryStrategy = function(text) {
    try {
    let in_a = require('in-a-nutshell'),
        // in-a-nutshell replaces newlines with nothing (ough)
        // defaults to 4 sentences, and will throw error if < 4 (?) found in text
        summary = in_a.nutshell(text.replace(/\n/g, ' '),1).split('\n\n'),
        title = util.pick(summary);

    // split on \n\n
    // pick a random line from that
    return title;
    } catch(ex) {
      logger(ex);
      logger(text);
    }
  };

  var titleLineStrategy = function(lineNbr) {
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

  var titleWordFreq = function(text) {
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

  let queneaubuckets = function(config) {
    let buckets = require('./buckets'),
        qb = new buckets(config);

    return qb.generate();
  };

  let onePoem = function() {
    try {
      let Corpora = require('./corpora.js'),
          corpora = new Corpora(),
          texts = reduceCorpora(corpora.texts),
          hd = () => harvarddrone.generate(),
          strategies = [ queneaubuckets,
                         jgnoetry,
                         hd
                       ],
          strategy;

      if (config.method) {
        let method = fmMethods.get(config.method).value;
        switch (method) {
        case 'jgnoetry':
          strategy = jgnoetry;
          break;

        case 'queneau-buckets':
          strategy = queneaubuckets;
          break;

        case 'harvarddrone':
          strategy = hd;
          break;
        }
      }

      if (!strategy) {
        strategy = util.pick(strategies);
      }

      let source = texts;

      if (config.reduce || util.coinflip(0.3)) {
        let lr = new require('./lrRunner.js')({util: util, texts: texts});
        source = [{name: texts.reduce((p,c) => p + ' ' + c.name, ''), text: () => lr.text}];
      }

      let poem = strategy({config: config,
                           util: util,
                           // texts: texts});
                           texts: source});

      if (!poem.title) {
        do {
          poem.title = titlefier(poem.text);
        } while (poem.title.split(' ').length === 1 );
      }

      // do we pass transformers in to the generator?
      // NO, because that means the generator has to know how to manipulate the transformer
      // INSTEAD, the generator can pass back params that the transformer can optionally process
      // the transformer "has" to know about these properties -- but that's sort of the idea
      // it knows about properties, NOT about specific generators
      poem = transformer(poem);

      // do not clean if we're processing from one of the ascii-art files
      if (texts.filter(t => t.name.match(/ascii|emoticon/i) !== null).length === 0) {
        poem.text = textutils.cleaner(poem.text);
      }

      poem.seed = util.seed;
      poem.source = texts.reduce((p,c) => p + ' ' + c.name, '');

      return poem;

    } catch(ex) {
      // seed: bmhz0se.ipbymn29 throws an error with prun -c imagist -s bmhz0se.ipbymn29
      if (util.seed) { logger(`seed: ${util.seed}`); }
      logger(ex.stack || ex);
      return 'An error has occured';
    }
  };

  let teller = function() {

    let poem = onePoem();

    if (config.log) {
      logger(JSON.stringify(poem));
      logger(poem.text);
    }

    return poem;

  };

  this.poem = teller;

};

module.exports = Poetifier;
