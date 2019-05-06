/*
 * derived from gutencorpus
 * https://github.com/dariusk/gutencorpus
 *
 * Copyright (c) 2043 Darius Kazemi,
 * 2016 Michael Paulukonis,
 * Licensed under the MIT license.
 */
const fs = require(`fs`)

// same word either start or end: gc.search(/(^bear)|(bear.$)/).done((ret) => console.log(ret));

module.exports = {
  search: function (options) {
    let searchTarget = options.search

    let text = ``

    if (options.text) {
      text = options.text
    } else {
      if (!options.file) { options.file = `./corpus/###gutencorpus/corpus.txt` }
      text = fs.readFileSync(options.file, `utf8`).toString()
    }
    // split if not pre-split
    // TODO: require sentences/lines to be passed in
    var sentences = (text instanceof Array ? text : text.match(/[^.!?]+[.!?]+/g))
    if (!options.caseSensitive) {
      if (searchTarget instanceof RegExp) {
        searchTarget = new RegExp(searchTarget.source, searchTarget.flags.replace(`i`, ``) + `i`)
      } else {
        searchTarget = searchTarget.toLowerCase()
      }
    }
    // TODO: aren't we trimming TWICE?
    // I think this can all be rewritten functionally (with or without Ramda)
    // much smaller
    var result = sentences.filter((el) => {
      var normalized = el.trim()
      if (!options.caseSensitive) {
        normalized = normalized.toLowerCase()
      }
      if (searchTarget instanceof RegExp) {
        return normalized.search(searchTarget) > -1
      } else {
        return normalized.indexOf(searchTarget) > -1
      }
    }).map((el) => el.trim())
    return result
  }
}
