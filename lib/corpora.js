'use strict';

var Corpora = function() {

  if(!(this instanceof Corpora)) {
    return new Corpora();
  }

  var fs = require('fs'),
      debreak = require('./debreak'),
      root = './corpus',
      books = fs.readdirSync(root),
      texts = [];

  for(var i = 0, len = books.length; i < len; i++) {
    let filename = books[i];
    var book = fs.readFileSync(root + '/' + filename, 'utf-8').toString();
    if (book.charCodeAt(0) === 0xFEFF) {
      book = book.slice(1);
    }
    // only "problem" here is that we read the text EVERY TIME we need it
    // but... if we need it only once, that's not a problem, so... leave it for now
    texts.push({name: filename.replace('.txt', ''), text: function() { return gettext(filename); }});
  }

  var gettext = function(filename) {
    var book = fs.readFileSync(root + '/' + filename, 'utf-8').toString();
    // discard windows encoding thingy
    if (book.charCodeAt(0) === 0xFEFF) {
      book = book.slice(1);
    }
    return debreak(book);
  };

  this.texts = texts;

};

module.exports = Corpora;
