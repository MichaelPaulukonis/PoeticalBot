'use strict';

var Poetifier = function(options) {
  if(!(this instanceof Poetifier)) {
    return new Poetifier(options);
  }

  options = options || { config: {} };

  let jgnoetry = require('./jgnoetryRunner.js'),
      mispelr = require('node-mispelr'),
      ALWAYS_PRINT = 0,
      util = new require('./util.js')({statusVerbosity: 0}),
      fonetik = require('../filter/fonetik'),
      config = options.config;

  let logger = function(msg) {
    util.debug(msg, ALWAYS_PRINT);
  };
  util.log = logger;

  var reduceCorpora = function(texts) {
    var strategies = [ corporaSevenStrategy,
                       corporaApocalypseOzStrategy,
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
      return corpus.filter(m => m.name.toLowerCase().indexOf(filter.toLowerCase()) > -1);
    };
  };

  // TODO: how to do this with the filter?
  var corporaApocalypseOzStrategy = function(corpus) {
    return corpus.filter(m => m.name.indexOf('The Wonderful Wizard of Oz') > -1 || m.name.indexOf('ApocalypseNow.redux.2001') > -1);
  };

  let transformer = function(poem) {

    let stragegies = [ transformLeadingSpaces,
                       transformMispeller,
                       transformFonetik
                     ],
        strategy = util.pick(stragegies);

    let chance = config.transformChance || 0.25;
    // only applies this 25% of the time
    return util.coinflip(chance) ? strategy(poem) : poem;

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

  // TODO: drop this into textutils and test it
  let cleaner = function(poem) {

    // a first implementation of a naive cleaner
    // TODO: we do not want to do this for the ASCII texts, though.
    // hunh.
    let plines = poem.split('\n'),
        cleanlines = [];
    for(let i = 0, len = plines.length; i < len; i++) {
      let line = plines[i];

      line = line.replace(/_+/g, '_');

      let leftbrackets = line.match(/\[/g),
          lbCount = (leftbrackets ? leftbrackets.length : 0),
          rightbrackets = line.match(/\]/g),
          rbCount = (rightbrackets ? rightbrackets.length : 0);

      if ((leftbrackets || rightbrackets) && lbCount !== rbCount) {
        line = line.replace(/[\[\]]/g, '');
      }

      let leftparens = line.match(/\(/g),
          lpCount = (leftparens ? leftparens.length : 0),
          rightparens = line.match(/\)/g),
          rpCount = (rightparens ? rightparens.length : 0);

      if ((leftparens || rightparens) && lpCount !== rpCount) {
        line = line.replace(/[\(\)]/g, '');
      }

      cleanlines.push(line);

    }

    return cleanlines.join('\n');

  };

  let titlefier = function(text) {

    let textutils = require('./textutil.js'),
        wordfreqs = textutils.wordfreqs(text),
        title = '';

    if (wordfreqs.length > 4) {
      let wordCount = util.randomInRange(2, wordfreqs.length > 10 ? 10 : 4);
      title = wordfreqs.slice(0,wordCount).map(function(elem) { return elem.word; }).join(' ');
    } else {
      title = wordfreqs[0].word;
    }

    return title.toUpperCase().trim();

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
          strategies = [ queneaubuckets,
                         jgnoetry
                       ],
          strategy;

      if (config.method) {
        // this is sub-optimal
        if (config.method.indexOf('bucket') >= 0) {
          strategy = queneaubuckets;
        } else if (config.method.indexOf('gnoetry') >= 0) {
          strategy = jgnoetry;
        }
      }

      if (!strategy) {
        strategy = util.pick(strategies);
      }

      let poem = strategy({config: config,
                           util: util,
                           texts: texts});

      if (!poem.title) {
        poem.title = titlefier(poem.text);
      }

      // do we pass transformers in to the generator?
      // NO, because that means the generator has to know how to manipulate the transformer
      // INSTEAD, the generator can pass back params that the transformer can optionally process
      // the transformer "has" to know about these properties -- but that's sort of the idea
      // it knows about properties, NOT about specific generators
      poem = transformer(poem);

      poem.text = cleaner(poem.text);

      return poem;

    } catch(ex) {
      // the last 3 items are non-standard.....
      let msg = ex.name + ' : ' + ex.message;
      if (ex.lineNumber && ex.columnNumber && ex.stack) {
        msg += ' line: ' + ex.lineNumber + ' col: ' + ex.columnNumber + '\n'
          + ex.stack;
      }
      logger(msg);
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
