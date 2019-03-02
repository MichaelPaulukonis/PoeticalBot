'use strict'

// extracted from my modified lexeduct, gh-pages branch
var Rhymer = function (cfg) {
  if (!(this instanceof Rhymer)) {
    return new Rhymer(cfg)
  }

  let util = cfg.util

  let pos = require(`pos`)

  let lexer = new pos.Lexer()
  // dependency required from another module
  // is the tagspewer cleaner the same cleaner thats in textutils?
  // shouldn't isAlpha and contains be in general tools?

  let cleaner = require(`tagspewer`).cleaner

  let stopwords = require(`../lib/stopwords.js`)

  let rhymes = require(`rhymes`)

  let isalpha = (t) => t.search(/[^a-z(\-a-z)?$]/i) === -1

  let contains = (arr, elem) => arr.indexOf(elem) !== -1

  // optionally intake an array of lines, so we don't need to split
  this.generate = function (text) {
    let out = []

    let lines = text.split(`\n`)
    try {
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]

        let words = lexer.lex(line)

        let newwords = ``
        // hrm. if rhyme exists, double up the words?
        // except for stop words and things like that
        // and not EVERY words, that would be annoying.
        for (let j = 0; j < words.length; j++) {
          // if this word is puncations or stopword, don't do it
          let word = words[j]

          let r = ` `
          // console.log(`word: ${word} isalphs: ${isalpha(word)} stopword: ${contains(stopwords, word)} `);
          if (isalpha(word) && !contains(stopwords, word)) {
            let ro = rhymes(word)
            r = ro.length === 0 ? `` : util.pick(ro.filter(w => w.word.toLowerCase() !== word.toLowerCase() &&
              w.word.indexOf(word) === -1)).word + ` `
            // clean it
            r = (r === ``) ? ` ` : `-` + r.replace(/\([0-9]\)/g, ``)
          }
          newwords += word + r
        }
        out.push(cleaner(newwords))
      }
    } catch (ex) {
      console.log(JSON.stringify(ex)) // eslint-disable-line no-console
      console.log(ex.stack || ex) // eslint-disable-line no-console
    }
    return out.join(`\n`)
  }

  this.rhymes = (word) => rhymes(word)

  return this
}

module.exports = Rhymer
