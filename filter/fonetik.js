'use strict'

var fone = function (text) {
  var nlp = require(`nlp_compromise`)
  var nlpPronounce = require(`nlp-pronounce`) // easily extracted
  nlp.plugin(nlpPronounce)

  var { fonetikfix } = require(`../lib/textutil`)

  var lines = text.split(`\n`)

  // TODO: if not pronounceable, use original word fragment
  // so maybe..... word by word?
  // OMG THIS IS AWFUL!
  for (var i = 0, len = lines.length; i < len; i++) {
    var t = nlp.text(lines[i])
    lines[i] = fonetikfix(t.pronounce())
  }
  text = lines.join(`\n`)

  return text
}

module.exports = fone
