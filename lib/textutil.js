'use strict';

// > var c = require('./defaultTexts.js')
// undefined
// > var util = require('./lib/textutil.js');
// undefined
// > var wf = util.wordfreqs(c[0].text)
// undefined
// > wf.slice(0,10).map(function(e) { return e.word;}).join(' ').toUpperCase()
// ' PICTURES ONE PAINTING GREAT PAINTED WORKS MADE PICTURE TIME'

var textutils = function() {

  // would be nice to ignore some stop words
  var stopwords = require('./stopwords.js');

  var wordbag = function(text) {

    var wb = {},
        splits = text.split(/\W/g);
        // alphanumeric = /[a-z0-9]+/i;

    for( var i = 0, len = splits.length; i < len; i++) {
      var word = splits[i];
      // TODO: alphanumeric test should be optional
      if (stopwords.indexOf(word.toLowerCase()) == -1) {
      // if (alphanumeric.test(word) && word.length > 3) {
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

  var wordfreqs = function(text) {
    return sortedArray(wordbag(text));
  };

  // TODO: drop this into textutils AND TEST IT
  // based on some code I saw in https://github.com/scotthammack/ebook_ebooks/blob/master/ebook_ebooks.py
  // I've contemplated a different version for years, which I should complete
  // that would add in the missing pieces.
  let cleaner = function(poem) {
    // a first implementation of a naive cleaner
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


  return { wordbag: wordbag,
           wordfreqs: wordfreqs,
           cleaner: cleaner
         };
};

module.exports = textutils();
