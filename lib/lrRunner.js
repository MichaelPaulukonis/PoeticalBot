// TODO: UGH why create a new object if it immediately returns the junk?
// need to modify this a bit

const nlp = require('compromise')
const { types } = require(`../lib/linereduce.js`)
const LR = require(`../lib/linereduce.js`)

const Runner = function (config) {
  if (!(this instanceof Runner)) {
    return new Runner(config)
  }

  const { util, texts } = config
  const sents = texts.reduce((p, c) => p.concat(c.sentences()), [])
  const name = texts.reduce((p, c) => p + ` ` + c.name, ``).trim()
  let selection = { lines: [] }

  const linereduce = new LR.LineReduce({
    util: util
  })

  // TODO: return the method it used
  const reduceType = config.reduceType || util.pick(Object.keys(types))
  switch (reduceType) {
    case types.start:
      selection = linereduce.filter({ type: types.start, text: sents })
      break

    case types.end:
      selection = linereduce.filter({ type: types.end, text: sents })
      break

    case types.pattern:
      const Matcher = require('./pattern-match')
      const { getMatchingLines: patternMatchLines } = new Matcher()
      // when run from poetifier, coming in as array of objects
      // which is not what linereduce expects...
      const matchObj = patternMatchLines({ lines: sents, method: config.method, matchPattern: config.matchPattern })
      selection = { text: sents.join(`\n`), lines: matchObj.sentences }
      break

    case types.search:
    default:
      const ngrams = nlp(sents.join('\n'))
        .ngrams()
        .data()

      if (ngrams.length === 0) {
        selection = { lines: [], text: sents.join('\n') }
        break
      }

      // TODO: find some way to get a map of counts with sizes
      // so we can pick (randomly? or largest?) possibilities
      // with the below, we are ALWAYS picking from > 2, so, I guess that okay
      const twoOrMoreWords = ngrams.filter((d) => d.count > 1 && d.size > 1)
      const search = (twoOrMoreWords.length === 0)
        ? util.pick(ngrams)
        : util.pick(twoOrMoreWords)
      selection = linereduce.filter({ type: types.search, search: search.normal, text: sents })
  }

  return {
    name,
    text: selection.text,
    lines: selection.lines
  }
}

module.exports = Runner
