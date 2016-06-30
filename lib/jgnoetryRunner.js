'use strict';

var jgRunner = function(options) {

  if(options === undefined) {
    options = { debug: function(msg) { console.log(msg); } }; // eslint-disable-line no-console
  }

  var corpora = {
    texts: options.texts,
    weights: []
  };

  var util = options.util,
      config = options.config,
      jGnoetry = require('./jgnoetry.headless.js'),
      // TODO: oh, g-d, the logging is C-R-A-Z-Y !!!
      // there's no way to change this value....
      // because it's shared by everything that gets the same utility
      // C-R-A-P
      jg = new jGnoetry(util),
      // work around this naming weirdness
      jgOptions = {
        'handlePunctuation': 'noParen',
        'byNewlineOrPunctuation': 'punctuation',
        'capitalize': {
          'method': 'capitalizeCustom', // capitalizeNone, capitalizeAsCorpus
          'customSentence': true, // sentence beginning
          'customLine': true, // line beginnings
          'customI': true // capitalize "I"
        },
        'appendToPoem': 'appendPeriod',
        'statusVerbosity': 0
      },
      existingText = [],
      // TODO: randomized template (generated)
      templates = {
        'couplet': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] ',
        'quatrain': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s]',
        'blankSonnet': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s]',
        // increases the chance of a sonnet
        'blankSonnet ': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s]',
        'blankSonnet  ': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s]',
        'haiku': '[s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] ',
        'tanka': '[s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] ',
        'renga': '[s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] ',
        // // the howl template IS TOO BLOODY LONG
        // // 'howl': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [n] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [n] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] ',
        'kb': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [n] [s] [s] [s] [s] [n] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [n] [s] [s] [s] [s] [s] [s]',
        '7+4': '[s] [n] [s] [n] [s] [n] [s] [n] [s] [n] [s] [n] [s] [n] [s] [s] [s] [s]',
        '1-2': '[s] [n] [s] [s] [n] [s] [n] [s] [s] [n] [s] [n] [s] [s] [n] [s] [n] [s] [s] [n] [s] [n] [s] [s] [n] [s]',
        '2-1': '[s] [s] [n] [s] [n] [s] [s] [n] [s] [n] [s] [s] [n] [s] [n] [s] [s] [n] [s] [n] [s] [s] [n] [s] [n] [s] [s]',
        'grow': '[s] [n] [s] [s] [n] [s] [s] [s] [n] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] ',
        'shrink': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [n] [s] [s] [s] [n] [s] [s] [n] [s] [n] ',
        'nonnet': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [s] [n] [s] [s] [s] [s] [n] [s] [s] [s] [n] [s] [s] [n] [s] [n]'
      };

  var capitalizations = ['capitalizeCustom', 'capitalizeNone', 'capitalizeAsCorpus'],
      endPuncts = ['appendNothing', 'appendPeriod', 'appendQuestion', 'appendExclamation'];

  // methods: random, even, tilted
  // ditch the "pick one, pick two" - let that be the domain of the corpora filters
  // (this is a hold-over from when there were no corpora filters)
  var assignWeights = function(count) {
    var strategies = [ assignWeightsRandom, assignWeightsEven, assignWeightsTentpole],
        strategy = util.pick(strategies);

    return strategy(count);
  };

  // one item will be much more significant than the others
  var assignWeightsTentpole = function(count) {
    if (count==1) { return [100]; }

    var weights = [],
        total = 0;

    weights.push(util.randomInRange(50,80));
    total += weights[0];

    for(var i = 1; i < count-1; i++) {
      weights[i] = util.random(100-total);
      total += weights[i];
    }
    weights[count-1] = (100-total);

    util.shuffle(weights);

    return weights;
  };

  // return an array of length n, where n := texts.lengh
  // and sum(array) := 100 and array[0] == a[1] == a[1.length]
  var assignWeightsEven = function(count) {
    var weights = [];

    for(var i = 0; i < count; i++) {
      weights[i] = 100/count;
    }

    return weights;
  };

  // return an array of length n, where n := texts.lengh
  // sum(array) := 100
  var assignWeightsRandom = function(count) {
    var weights = [],
        total = 0;

    // naive implementation
    // first value has a greater chance of being > other values
    // last value has a greater chance of being < other value
    // but then we shuffle 'em all
    for(var i = 0; i < count-1; i++) {
      weights[i] = util.random(100-total);
      total += weights[i];
    }
    weights.push(100-total);
    util.shuffle(weights);

    return weights;
  };

  var assignCapitalization = function() {

    var cap = {
      method: util.pick(capitalizations),
      customSentence: true, // sentence beginning
      customLine: true, // line beginnings
      customI: true // capitalize "I"
    };

    if (cap.method !== 'capitalizeCustom') {
      cap.customSentence = false;
      cap.customLine = false;
      cap.customI = false;
    }

    return cap;

  };

  var cleaner = function(text) {

    // remove /r (DOS style)
    return text.replace(/\r/g, '')
    // remove leading whitespace
      .replace(/^\s*/g, '')
      .replace(/\n\s*/g, '\n')
      .trim();

  };

  // TODO: the corpora should be an array of objects, each of which has a name, a text, and an associated weigth
  corpora.weights = assignWeights(corpora.texts.length);
  var templateName;

  if (config.templateName && templates[config.templateName]) {
    templateName = config.templateName;
  }
  if (!templateName) {
    templateName = util.pick(Object.keys(templates));
  }
  jgOptions.capitalize = assignCapitalization();
  jgOptions.appendToPoem = util.pick(endPuncts);

  util.debug(JSON.stringify(jgOptions, null, 2), 0);
  util.debug(templateName, 0);
  util.debug(corpora.weights.join(' '), 0);

  var titles = corpora.texts.map(t => t.name);
  corpora.texts = corpora.texts.map(b => b.text());
  var output = jg.generate(templates[templateName], jgOptions, corpora, existingText);
  var text = cleaner(output.displayText);

  return {
    title: '', //titlifier(output.displayText),
    text: text,
    template: templateName,
    corpora: titles
  };


};

module.exports =  jgRunner;
