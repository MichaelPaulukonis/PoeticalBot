'use strict';

var poetifier = function(config) {

  if(config === undefined) {
    config = { debug: function(msg) { console.log(msg); } }; // eslint-disable-line no-console
  }

  var jGnoetry = require('./jgnoetry.headless.js'),
      util = config.util,
      options = {
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

  var corpora = {
    texts: config.texts,
    weights: []
  };

  var capitalizations = ['capitalizeCustom', 'capitalizeNone', 'capitalizeAsCorpus'],
      endPuncts = ['appendNothing', 'appendPeriod', 'appendQuestion', 'appendExclamation'];

  // TODO: all of this corpora stuff should be elsewhere
  // so it can also be used by other import-generators
  // hrm. maybe. does anybody else use more than one text?
  var reduceCorpora = function(texts) {
    var strategies = [ corporaSevenStrategy,
                       corporaApocalypseOzStrategy,
                       corporaFilterStrategy('sms'),
                       corporaFilterStrategy('shakespeare'),
                       corporaFilterStrategy('cyberpunk'),
                       corporaFilterStrategy('gertrudestein'),
                       corporaFilterStrategy('computerculture'),
                       corporaFilterStrategy('filmscripts'),
                       corporaFilterStrategy('spam'),
                     ],
        strategy = util.pick(strategies);

    return strategy(texts);
  };

  // TODO: get a generic one to take in a numeric parameter
  var corporaSevenStrategy = function(corpus) {
    var newCorpus = [];

    for (var i = 0; i < 7; i++) {
      newCorpus.push(util.pickRemove(corpus));
    }

    return newCorpus;
  };

  var corporaFilterStrategy = function(filter) {
    return function(corpus) {
      return corpus.filter(m => m.name.indexOf(filter) > -1);
    };
  };

  // TODO: how to do this with the filter?
  var corporaApocalypseOzStrategy = function(corpus) {
    return corpus.filter(m => m.name.indexOf('The Wonderful Wizard of Oz') > -1 || m.name.indexOf('ApocalypseNow.redux.2001') > -1);
  };


  var initializeArray = function(count) {
    var arr = Array.apply(null, Array(count));
    return arr.map(function() { return 0; });
  };

  // methods: random, even, tilted
  // ditch the "pick one, pick two" - let that be the domain of the corpora filters
  // (this is a hold-over from when there were no corpora filters)
  var assignWeights = function(count) {

    var strategies = [assignWeightsRandom, weightsPickOne, weightsPickTwo],
        strategy = util.pick(strategies);

    return strategy(count);

  };

  // TODO: this would be easier if we just prune the texts, and THEN assign weight randomly
  var weightsPickOne = function(count) {
    var arr = initializeArray(count);
    arr[util.random(arr.length)] = 100;
    return arr;
  };

  var weightsPickTwo = function(count) {
    // TODO: implement
    // pick one, then do a while loop, do make sure we get a DIFFERENT number...
    var arr = initializeArray(count);
    var first = util.random(arr.length),
        second = util.random(arr.length);
    arr[first] = 50;
    while (second === first) {
      second = util.random(arr.length);
    }
    arr[second] = 50;
    return arr;
  };

  // return an array of length n, where n := texts.lengh
  // and sum(array) := 100
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

  var wordbag = function(text) {

    var wb = {},
        splits = text.split(/\W/g),
        alphanumeric = /[a-z0-9]+/i;

    for( var i = 0, len = splits.length; i < len; i++) {
      var word = splits[i];
      if (alphanumeric.test(word) && word.length > 3) {
        if (!wb[word]) {
          wb[word] = [];
        }
        wb[word].push(word);
      }
    }

    return wb;

  };

  var sortedArray = function(wordbag) {

    var words = [];
    for(var word in wordbag) {
      words.push({ word: word, count: wordbag[word].length});
    }

    words.sort(function(a,b) {
      if (a.count < b.count) {
        return 1;
      }

      if (a.count > b.count) {
        return -1;
      }

      return 0;
    });

    return words;

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

  // TODO: externalities are templateName and corpora.weights
  // make these naming strategies that can be returned with the poetical object
  // and the main caller can use other strategies that might be appropriate to all
  // wordfreqs, being one
  var titlifier = function(text) {

    var title = '';

    if (Math.random() > 0.5) {
      return templateName.trim() + ' ' + corpora.weights.join(' ');
    }

    var wordfreqs = sortedArray(wordbag(text));
    if (wordfreqs.length > 4) {
      var wordCount = util.getRandomInRange(2, wordfreqs.length > 10 ? 10 : 4);
      title = wordfreqs.slice(0,wordCount).map(function(elem) { return elem.word; }).join(' ');
    } else {
      title = wordfreqs[0].word;
    }

    return title.toUpperCase();

  };

  // TODO: oh, g-d, the logging is C-R-A-Z-Y !!!
  // there's no way to change this value....
  // because it's shared by everything that gets the same utility
  // C-R-A-P
  var jg = new jGnoetry(util.debug);

  // TODO: the corpora should be an array of objects, each of which has a name, a text, and an associated weigth
  // it shouldn't be separate
  // should it?
  corpora.texts = reduceCorpora(corpora.texts);
  corpora.weights = assignWeights(corpora.texts.length);
  var templateName = util.pick(Object.keys(templates));
  options.capitalize = assignCapitalization();
  options.appendToPoem = util.pick(endPuncts);

  util.debug(JSON.stringify(options, null, 2), 0);
  util.debug(templateName, 0);
  util.debug(corpora.weights.join(' '), 0);

  var titles = corpora.texts.map(t => t.name);
  corpora.texts = corpora.texts.map(b => b.text());
  var output = jg.generate(templates[templateName], options, corpora, existingText);
  var text = cleaner(output.displayText);

  return {
    title: '', //titlifier(output.displayText),
    text: text,
    template: templateName,
    corpora: titles
  };


};

module.exports =  poetifier;
