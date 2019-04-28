const reduceType = {
  'search': `Plaintext or regular expression search`,
  'start': `Match at start of sentence`,
  'end': `Match at end of sentence (plus optional punctuation)`
}

const LineReduce = function (config) {
  if (!(this instanceof LineReduce)) {
    return new LineReduce(config)
  }

  let util = config.util
  // let textutil = require(`../lib/textutil`)
  let lf = require(`../lib/linefind.js`)

  // strip both ends of '"No.'
  // leave hyphen in 'wicket-bag'
  // 681 for Hadet read Halet = haled = exiled (?).
  // final word is ' (?)' which is a mess.
  // we just want to leave a middle-hyphen...
  // stripPunct = (t) => t.replace(/^[^a-z0-9\]|[^a-z0-9]$/ig, '');
  // fails for 'U.S.A.'

  const stripPunct = (t) => t.replace(/^[^a-z0-9-]|[^a-z0-9-]$/ig, ``)

  const filter = (opts) => {
    // TODO: hey, why don't we require that LINES be passed in, eh?
    // that way we reduce the external dependency....
    // const text = textutil.sentencify(opts.text)
    const text = opts.text
    let targSent = util.pick(text).split(` `)

    // start/end words ar pickd from a random sentence
    // NOTE: no guarantee they occur more than once
    let startWord = stripPunct(targSent[0])
    let endWord = stripPunct(targSent[targSent.length - 1])

    // TODO: compromis pseudo-search for linguistic patterns!
    // all of the matching things (all except "weird")

    const optionalPuncts = `[.'"!?]?`
    let search

    switch (opts.type) {
      case reduceType.search:
        search = opts.search
        break

      case reduceType.start:
        search = new RegExp(`^` + startWord.toLowerCase(), `i`)
        break

      case reduceType.end:
        search = new RegExp(endWord.toLowerCase() + optionalPuncts + `$`, `i`)
        break

      // TODO: mattern-match like in listmania

      // TODO: default case - random selection, I guess
    }
    // interesting problem for 'hello there and thanks on your info ?'
    // since our last-word split will be '?' which is then stipped of puncts.
    let reduced = lf.search({ text, search })

    return { lines: reduced, text: reduced.join(`\n`) }
  }

  return { filter }
}

module.exports = { LineReduce, types: reduceType }
