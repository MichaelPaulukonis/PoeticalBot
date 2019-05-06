let Corpora = require(`common-corpus`)
const Matcher = require(`../../lib/pattern-match`)
const { getMatchingLines } = new Matcher()
const util = require('../../lib/util')()
const textutil = require(`../../lib/textutil`)

// limited to 50K chars at random location
// this reduces processing time, but also result size
var getText = (filter) => {
  let corpora = new Corpora()
  let source = filter ? corpora.filter(filter) : corpora.texts
  let chars = 50000
  let textObj = util.pick(source)
  let text = textObj.text()
  let startPos = util.randomInRange(0, text.length - chars)
  let blob = (text.length <= chars ? text : text.slice(startPos, startPos + chars))

  // console.log(`text.length: ${text.length} startPos: ${startPos} blob-borders: ${startPos+chars}`);

  return {
    text: blob,
    source: textObj.name
  }
}

const config = {
  // corporaFilter: 'oz'
}

let program = require(`commander`)
program
  .version(`0.0.3`)
  .option(`-c, --corporaFilter [string]`, `filename substring filter (non-case sensitive)`)
  .option(`-p, --patternMatch [string]`, `nlp-compromise matchPattern for list elements`)
  // .option(`-m, --method [string]`, `method-type (See index.js)`)
  .parse(process.argv)

if (program.corporaFilter) {
  config.corporaFilter = program.corporaFilter
}

if (program.patternMatch) {
  config.matchPattern = program.patternMatch
}

const book = getText(config.corporaFilter)
config.lines = textutil.sentencify(book.text)
const matchObj = getMatchingLines(config)

console.log(JSON.stringify(matchObj.sentences, null, 2))
console.log(JSON.stringify(matchObj.metadata, null, 2))
