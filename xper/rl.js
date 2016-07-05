'use strict';

let util = new require('../lib/util.js')(),
    timer = require('simple-timer'),
    Corpora = require('../lib/corpora.js'),
    corpora = new Corpora(),
    lines = { lines: [] },
    nlp = require('nlp_compromise'),
    nlpNgram = require('nlp-ngram');

nlp.plugin(nlpNgram);
let text1 = util.pick(corpora.texts),
    text2 = util.pick(corpora.texts),
    text = text1.text() + ' ' + text2.text(),
    name = text1.name + ' ' + text2.name;

timer.start(name, true);
let t = nlp.text(text);
var ng = t.ngram({min_count: 10})
      .filter(n => n[0] && n[0].size && n[0].size > 2)
      .reduce((p,c) => p.concat(c))
      .filter(w => w.word.trim().length > 0);
// console.log(JSON.stringify(ng));
timer.stop(name, true);

let search = util.pick(ng).word;

console.log(`search: ${search}`);

let linereduce = new require('../lib/linereduce.js')({
  util: util,
  text: text,
  search: search
});

lines = linereduce.filter();

let config = {util: util, texts: [ {name: 'lines', text: () => lines.lines.join('\n')}] },
    buckets = require('../lib/buckets'),
    qb = new buckets(config);

var poem = qb.generate();

console.log(poem.text);

// TODO: get Moby Dick and Pride and Prejudice in there
// TODO: poetry of some sort


// while (lines.lines.length < 6) {
//   let text = util.pick(corpora.texts);
//   timer.start(text.name, true);
//   let linereduce = new require('../lib/linereduce.js')({util: util, texts: [text]});
//   lines = linereduce.filter();
//   timer.stop(text.name, true);
//   console.log(`length: ${lines.lines.length}`);
// }

// console.log(lines.lines);
