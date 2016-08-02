'use strict';

// TODO: UGH why create a new object if it immediately returns the junk?
// need to modify this a bit

var Runner = function(config) {
  if(!(this instanceof Runner)) {
    return new Runner(config);
  }

  let util = config.util,
      texts = config.texts,
      blob = texts.reduce((p,c) => p + ' ' + c.text(), ''),
      name = texts.reduce((p,c) => p + ' ' + c.name, '').trim(),
      // timer = require('simple-timer'),
      lines = { lines: [] },
      nlp = require('nlp_compromise'),
      nlpNgram = require('nlp-ngram'),
      reduceType = require('../lib/linereduce.js').types,
      // NOTE: linereduce takes in text, not our corpus text-blob
      linereduce = new require('../lib/linereduce.js').LineReduce({
        util: util,
        text: blob
      });

  nlp.plugin(nlpNgram);

  switch (util.pick([1,2,3])){

  case 1:
    lines = linereduce.filter({type: reduceType.start});
    break;

  case 2:
    lines = linereduce.filter({type: reduceType.end});
    break;

  // case 3:
  default:
    // timer.start(name, true);
    // make this part of linereduce
    // why should it happen out here?
    // ANSWER: because linereduce has no need for this gibberish
    // TODO: join up the texts that have been passed in
    var t = nlp.text(blob);
    var ng = t.ngram({min_count: 10})
          .filter(n => n[0] && n[0].size && n[0].size > 1);
    // timer.stop(name, true);

    if (ng.length > 0) {
    // TODO: if results are empty we get an error
      ng = ng.reduce((p,c) => p.concat(c))
        .filter(w => w.word.trim().length > 2);
    } else {
      // uh.....
      lines = [];
      break;
    }

    let search = util.pick(ng).word;

    lines = linereduce.filter({search: search});
    break;
  }

  return {
    name: name,
    text: lines.text,
    lines: lines.lines
  };

};

module.exports = Runner;
