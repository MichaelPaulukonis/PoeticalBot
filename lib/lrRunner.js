'use strict'

// TODO: UGH why create a new object if it immediately returns the junk?
// need to modify this a bit

var Runner = function (config) {
  if (!(this instanceof Runner)) {
    return new Runner(config)
  }

  let util = config.util

  let texts = config.texts

  let blob = texts.reduce((p, c) => p + ` ` + c.text(), ``)

  let name = texts.reduce((p, c) => p + ` ` + c.name, ``).trim()

  // timer = require('simple-timer'),

  let lines = { lines: [] }

  let nlp = require(`nlp_compromise`)

  let nlpNgram = require(`nlp-ngram`)

  let reduceType = require(`../lib/linereduce.js`).types

  // NOTE: linereduce takes in text, not our corpus text-blob

  let linereduce = new (require(`../lib/linereduce.js`)).LineReduce({
    util: util
  })

  nlp.plugin(nlpNgram)

  // TOOD: take in type as a config setting
  // TODO: return the method it used
  switch (util.pick([1, 2, 3])) {
    case 1:
      lines = linereduce.filter({ type: reduceType.start, text: blob })
      break

    case 2:
      lines = linereduce.filter({ type: reduceType.end, text: blob })
      break

      // case 3:
    default:
    // timer.start(name, true);
    // make this part of linereduce
    // why should it happen out here?
    // ANSWER: because linereduce has no need for this gibberish
    // TODO: join up the texts that have been passed in
      var t = nlp.text(blob)
      var ng = t.ngram({ min_count: 10 })
        .filter(n => n[0] && n[0].size && n[0].size > 1)
      // timer.stop(name, true);

      if (ng.length > 0) {
        // TODO: if results are empty we get an error
        ng = ng.reduce((p, c) => p.concat(c))
          .filter(w => w.word.trim().length > 2)
      } else {
      // uh.....
        lines = []
        break
      }

      var search = util.pick(ng).word

      lines = linereduce.filter({ type: reduceType.search, search: search, text: blob })
      break
  }

  this.name = name
  this.text = lines.text
  this.lines = lines.lines
}

module.exports = Runner
