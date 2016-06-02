'use strict';

let config = require('./config.js'),
    Tumblr = require('tumblrwks'),
    ALWAYS_PRINT = 0,
    // util = new require('./util.js')({statusVerbosity: ALWAYS_PRINT}),
    util = new require('./lib/util.js')({statusVerbosity: 0});

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
util.log = logger;

var prepForPublish = function(poem) {
  var lines = poem.split('\n'),
      clean = [],
      leadingspacere = /^ */;

  for(var i = 0, len = lines.length; i < len; i++) {
    var line = lines[i],
        matches = line.match(leadingspacere);
    var nbsps = matches[0].replace(/ /g, '&nbsp;');
    line = line.replace(matches[0], nbsps);
    clean.push(line);
  };
  return clean.join('\n');
};

let teller = function() {


let poetifier = new require('./lib/poetifier.js')({config: config});

let poem = poetifier.poem();

  if (poem && poem.title && poem.text) {

    if (config.postLive) {
      poem.text = prepForPublish(poem.text);
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
  .option('-l, --log', 'dump to log')
  .option('-t, --transform [percent]', 'percent chance of text transform (in hundreths, eg 0.25 = 25%')
  .option('-m, --method [jgnoetry, buckets]', 'specify poem generate method')
  .parse(process.argv);

if (program.log) {
  config.log = true;
}

if (program.transform) {
  let chance = parseFloat(program.transform, 10);
  if (!isNaN(chance)) {
    config.transformChance = chance;
  }
}

if (program.method) {
  config.method = program.method;
}

teller();
