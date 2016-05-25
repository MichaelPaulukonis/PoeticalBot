'use strict';

let config = require('./config.js'),
    Tumblr = require('tumblrwks'),
    poetifier = require('./jgnoetryRunner.js'),
    mispelr = require('node-mispelr'),
    ALWAYS_PRINT = 0,
    // util = new require('./util.js')({statusVerbosity: ALWAYS_PRINT}),
    util = new require('./util.js')({statusVerbosity: 0}),
    transform = require('./transform.js'),
    queneauLetters = require('./queneauLetters.js'),
    fonetik = require('./filter/fonetik');

let tumblr = new Tumblr(
  {
    consumerKey:    config.consumerKey,
    consumerSecret: config.consumerSecret,
    accessToken:    config.accessToken,
    accessSecret:   config.accessSecret
  },
  'poeticalbot.tumblr.com'
);

let logger = function(msg) {
  util.debug(msg, ALWAYS_PRINT);
};

let transformer = function(poem) {

  let stragegies = [ transformLeadingSpaces,
                     transformMispeller,
                     // transformQueneauLetters
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

// okay, this is sub-optimal. WAAAAAAY confusing.
let transformQueneauLetters = function(poem) {

  poem.text = queneauLetters.queneauLetters().generate(poem.text);

  return poem;

};

let transformLeadingSpaces = function(poem) {

  let noLeadingSpaceTemplates = ['howl', 'haiku', 'couplet'];
  if (noLeadingSpaceTemplates.indexOf(poem.template) === -1) {
    logger('initial spaces');
    poem.text = transform.initialSpaces().generate(poem.text);
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

  let textutils = require('./lib/textutil.js'),
      wordfreqs = textutils.wordfreqs(text),
      title = '';

  if (wordfreqs.length > 4) {
    let wordCount = util.getRandomInRange(2, wordfreqs.length > 10 ? 10 : 4);
    title = wordfreqs.slice(0,wordCount).map(function(elem) { return elem.word; }).join(' ');
  } else {
    title = wordfreqs[0].word;
  }

  return title.toUpperCase();

};

let queneaubuckets = function(config) {

  let buckets = require('./lib/buckets'),
      qb = new buckets(config);

  return qb.generate();

};


let onePoem = function() {

  try {

    // TODO: pick the texts here
    // that allows us to have a strategy that includes a specific corpus
    // woo!

    let texts = require('./defaultTexts.js'),
        strategies = [ queneaubuckets,
                       poetifier
                     ],
        strategy = util.pick(strategies),
        poem = strategy({util: util,
                        texts: texts});

    if (poem.title === undefined) {
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

  if (poem && poem.title && poem.text) {

    if (config.postLive) {
      poem.text = poem.text.replace(/ /g, '&nbsp;'); // "format" for HTML display
      // TODO: optionally dump in other info for "hidden" display?
      tumblr.post('/post',
                  {type: 'text', title: poem.title, body: poem.text},
                  function(err, json) { // eslint-disable-line no-unused-vars
                    if (err) {
                      logger(`ERROR: ${JSON.stringify(err)}`);
                    }
                    if(poem.corpora) {
                      logger(poem.title + ' : ' + JSON.stringify(poem.corpora));
                    }
                  });
    } else {
      logger(JSON.stringify(poem));
      logger(poem.text);
    }
  }

};


let program = require('commander');
program
  .version('0.0.2')
  .option('-l, --local', 'dump to log, don\'t post to Twitter (overrides environment vars)')
  .option('-t, --transform [percent]', 'percent chance of text transform (in hundreths, eg 0.25 = 25%')
  .parse(process.argv);

if (program.local) {
  config.postLive = false;
}

if (program.transform) {
  let chance = parseFloat(program.transform, 10);
  if (!isNaN(chance)) {
    config.transformChance = chance;
  }
}


teller();
