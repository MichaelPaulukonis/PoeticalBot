'use strict';

let util = new require('../lib/util.js')(),
    timer = require('simple-timer'),
    Corpora = require('common-corpus'),
    corpora = new Corpora(),
    lines = { lines: [] },
    nlp = require('nlp_compromise'),
    nlpNgram = require('nlp-ngram'),
    reduceType = require('../lib/linereduce.js').types;

nlp.plugin(nlpNgram);
let text1 = util.pick(corpora.texts),
    text2 = util.pick(corpora.texts),
    text = text1.text() + ' ' + text2.text(),
    name = text1.name + ' ' + text2.name;

let linereduce = new require('../lib/linereduce.js').LineReduce({
  util: util,
  text: text
});

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
  let t = nlp.text(text);
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


let config = {util: util, texts: [ {name: 'lines', text: () => lines.lines.join('\n')}] },
    buckets = require('../lib/buckets'),
    qb = new buckets(config);

var poem = qb.generate();

console.log(poem.text);

// TODO: get Moby Dick and Pride and Prejudice in there
// TODO: poetry of some sort
