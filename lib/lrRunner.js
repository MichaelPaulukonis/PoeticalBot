'use strict';

// TODO: UGH why create a new object if it immediately returns the junk?
// need to modify this a bit

var Runner = function(config) {
  if(!(this instanceof Runner)) {
    return new Runner(config);
  }

  console.log(JSON.stringify(config));

  let util = config.util,
      texts = config.texts,
      blob = texts.reduce((p,c) => p + ' ' + c.text()),
      name = texts.map(t => t.name).reduce((p,c) => p + ' ' + c),
      timer = require('simple-timer'),
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

  case 3:
  default:
    timer.start(name, true);
    // make this part of linereduce
    // why should it happen out here?
    // ANSWER: because linereduce has no need for this gibberish
    // TODO: join up the texts that have been passed in
    let t = nlp.text(blob);
    var ng = t.ngram({min_count: 10})
          .filter(n => n[0] && n[0].size && n[0].size > 1)
          .reduce((p,c) => p.concat(c))
          .filter(w => w.word.trim().length > 2);
    // console.log(JSON.stringify(ng));
    timer.stop(name, true);

    let search = util.pick(ng).word;

    console.log(`search: ${search}`);

    lines = linereduce.filter({search: search});
    break;
  }

  return {
    name: name,
    text: lines.text,
    lines: lines.lines
  };

  // let config = {util: util, texts: [ {name: 'lines', text: () => lines.lines.join('\n')}] },
  //     buckets = require('../lib/buckets'),
  //     qb = new buckets(config);

  // var poem = qb.generate();

};

module.exports = Runner;
