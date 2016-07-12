'use strict';

let Corpora = function() {

  if(!(this instanceof Corpora)) {
    return new Corpora();
  }
  // https://gist.github.com/VinGarcia/ba278b9460500dad1f50
  // List all files in a directory in Node.js recursively in a synchronous fashion
  let walkSync = function(dir, filelist) {

    if (dir[dir.length-1] != '/') { dir = dir.concat('/'); }

    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    if (dir.indexOf('###') === -1) {
      files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
          filelist = walkSync(dir + file + '/', filelist);
        }
        else {
          filelist.push(dir + file);
        }
      });
    }
    return filelist;
  };

  let fs = require('fs'),
      path = require('path'),
      debreak = require('./debreak'),
      root = path.join(__dirname, '../corpus'),
      books = walkSync(root).filter(t => t.match(/\.txt$/)),
      texts = [],
      cleanName = (name) => name.replace('.txt', '')
        .replace('.js', '')
        .replace(root, '')
        .replace(/^\/|\\/, ''),
      gettext = function(filename) {
        var book = fs.readFileSync(filename, 'utf-8').toString();
        // discard windows encoding thingy
        if (book.charCodeAt(0) === 0xFEFF) {
          book = book.slice(1);
        }
        return debreak(book);
      };

  for(let i = 0, len = books.length; i < len; i++) {
    let filename = books[i];
    // only "problem" here is that we read the text EVERY TIME we need it
    // but... if we need it only once, that's not a problem, so... leave it for now
    texts.push({name: cleanName(filename), text: function() { return gettext(filename); }});
  }

  // one-off
  let harvardpath = path.join(root, 'harvard.sentences.js'),
      harvard = require(harvardpath);

  texts.push({name: cleanName(harvardpath), text: () =>  harvard.join('\n')});

  this.texts = texts;
};

module.exports = Corpora;
