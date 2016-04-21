// var defaultTemplates = require('./default.templates.js');
var config = require('./config.js'),
    Tumblr = require('tumblrwks');


var tumblr = new Tumblr(
  {
    consumerKey:    config.consumerKey,
    consumerSecret: config.consumerSecret,
    accessToken:    config.accessToken,
    accessSecret:   config.accessSecret
  },
  'poeticalbot.tumblr.com'
);

var onePoem = function() {

  try {

    var poem = {
      title: 'a static poem',
      text: 'i think that i shall never see\na poem as lovely as a trie'
    };

    return poem;

  } catch(ex) {
    // the last 3 items are non-standard.....
    var msg = ex.name + ' : ' + ex.message;
    if (ex.lineNumber && ex.columnNumber && ex.stack) {
      msg += ' line: ' + ex.lineNumber + ' col: ' + ex.columnNumber + '\n'
        + ex.stack;
    }
    console.log(msg);
    return 'An error has occured';
  }
};


var teller = function() {

  var poem = onePoem();

  if (poem && poem.title && poem.text) {

    if (config.postLive) {
      tumblr.post('/post',
                  {type: 'text', title: poem.title, body: poem.text},
                  function(err, json){
                    console.log(err, json);
                  });
    } else {
      console.log(poem);
    }

  }

  console.log('DONE');

};

teller();
