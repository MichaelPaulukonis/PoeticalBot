// TODO: UGH why create a new object if it immediately returns the junk?
// need to modify this a bit

const textutil = require(`../lib/textutil`)
const nlp = require('compromise')
const { types } = require(`../lib/linereduce.js`)
// NOTE: linereduce takes in text, not our corpus text-blob
const LR = require(`../lib/linereduce.js`)

const Runner = function (config) {
  if (!(this instanceof Runner)) {
    return new Runner(config)
  }

  let util = config.util
  let texts = config.texts
  let sents = texts.reduce((p, c) => p.concat(textutil.sentencify(c.text())), [])
  let name = texts.reduce((p, c) => p + ` ` + c.name, ``).trim()

  let lines = { lines: [] }

  let linereduce = new LR.LineReduce({
    util: util
  })

  // TOOD: take in type as a config setting
  // TODO: return the method it used
  switch (util.pick(Object.keys(types))) {
    case types.start:
      lines = linereduce.filter({ type: types.start, text: sents })
      break

    case types.end:
      lines = linereduce.filter({ type: types.end, text: sents })
      break

    case types.search:
    default:
      var ngrams = nlp(sents.join('\n'))
        .ngrams({ min: 10 })
        .data()
        .filter((d) => d.count > 1 && d.size > 1)

      if (ngrams.length === 0) {
        lines = { lines: [], text: sents.join(' ') }
      } else {
        const search = util.pick(ngrams)

        lines = linereduce.filter({ type: types.search, search: search.normal, text: sents })
      }
  }

  this.name = name
  this.text = lines.text
  this.lines = lines.lines
}

module.exports = Runner
