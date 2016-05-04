var readlib = function() {

  var fs = require('fs'),
    root = './corpus',
    books = fs.readdirSync(root),
    texts = [];

    for(var i = 0, len = books.length; i < len; i++) {
        var book = fs.readFileSync(root + '/' + books[i], 'utf-8').toString();
        if (book.charCodeAt(0) === 0xFEFF) {
	  book = book.slice(1);
	}
        texts.push({name: books[i].replace('.txt', ''), text: book});
    }

  return texts;

};

module.exports = readlib();
