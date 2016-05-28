'use strict';

var Corpora = function() {

  if(!(this instanceof Corpora)) {
    return new Corpora();
  }
  // https://gist.github.com/VinGarcia/ba278b9460500dad1f50
  // List all files in a directory in Node.js recursively in a synchronous fashion
  var walkSync = function(dir, filelist) {

    if (dir[dir.length-1] != '/') { dir = dir.concat('/'); }

    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
      if (fs.statSync(dir + file).isDirectory()) {
        filelist = walkSync(dir + file + '/', filelist);
      }
      else {
        filelist.push(dir + file);
      }
    });
    return filelist;
  };

  var fs = require('fs'),
      debreak = require('./debreak'),
      root = './corpus',
      books = walkSync(root),
      texts = [];

  for(var i = 0, len = books.length; i < len; i++) {
    let filename = books[i];
    // only "problem" here is that we read the text EVERY TIME we need it
    // but... if we need it only once, that's not a problem, so... leave it for now
    texts.push({name: filename.replace('.txt', ''), text: function() { return gettext(filename); }});
  }

  var gettext = function(filename) {
    var book = fs.readFileSync(filename, 'utf-8').toString();
    // discard windows encoding thingy
    if (book.charCodeAt(0) === 0xFEFF) {
      book = book.slice(1);
    }
    return debreak(book);
  };

  this.texts = texts;
};

module.exports = Corpora;
