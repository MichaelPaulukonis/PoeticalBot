let Corpora = require(`common-corpus`)
const Matcher = require(`../../lib/pattern-match`)
const { getMatchingLines } = new Matcher()

const getText = function () {
  let corpora = new Corpora()
  let source = corpora.texts
  let textObj = source[2]
  // eh..... source[0] takes about 9 seconds to process into sentences....
  // "ideally", we should have some text blob that we know the results of
  // and not be dependent upon the common-corpus (mainly)
  // although I guess we _should_ test that for integration, since it's a component
  // but coding up a test based on indexes of an external package is problematic

  let blob = textObj.text()

  return {
    text: blob,
    source: textObj.name
  }
}

const text = getText()
const matchObj = getMatchingLines({ text })

console.log(matchObj)
