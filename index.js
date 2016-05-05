// var defaultTemplates = require('./default.templates.js');
var config = require('./config.js'),
    Tumblr = require('tumblrwks'),
    poetifier = require('./jgtest.js'),
    mispelr = require('node-mispelr'),
    util = new require('./util.js')(),
    transform = require('./transform.js');

var tumblr = new Tumblr(
  {
    consumerKey:    config.consumerKey,
    consumerSecret: config.consumerSecret,
    accessToken:    config.accessToken,
    accessSecret:   config.accessSecret
  },
  'poeticalbot.tumblr.com'
);



var transformer = function(poem) {

  var stragegies = [
    transformLeadingSpaces,
    transformMispeller
  ],
      strategy = util.pick(stragegies);

  // only applies this 25% of the time
  return util.coinflip(0.25) ? strategy(poem) : poem;

};

var transformLeadingSpaces = function(poem) {

    var noLeadingSpaceTemplates = ['howl', 'haiku', 'couplet'];
    if (noLeadingSpaceTemplates.indexOf(poem.template) === -1) {
      util.debug('initial spaces', 0);
      poem.text = transform.initialSpaces().generate(poem.text);
    }

  return poem;

};

var transformMispeller = function(poem) {
  poem.text = mispelr.respell(poem.text, 'random');
  return poem;
};


var onePoem = function() {

  var titlifier = function(text) {
    // TODO: make some generic strategies (like common words)
    // but also allow for poem-generating-specific strategies to be returned
    return 'untitled';
  };

  try {

    var poem = poetifier();

    poem = transformer(poem);

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
      poem.text = poem.text.replace(/ /g, '&nbsp;'); // "format" for HTML display
      tumblr.post('/post',
                  {type: 'text', title: poem.title, body: poem.text},
                  function(err, json){
                    console.log(err, json);
                  });
    } else {
      console.log(JSON.stringify(poem), poem.text);
    }
  }

  console.log('DONE');

};

teller();
