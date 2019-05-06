const bucketRunner = function (opts) {
  var util = opts.util

  var config = opts.config

  var textutil = require(`./textutil`)

  var queneauBuckets = require(`./queneau-buckets-modified`)

  if (util === undefined) {
    throw Error(`util must be supplied as part of opts`)
  }

  if (opts.texts === undefined) {
    throw Error(`texts array must be supplied as part of opts`)
  }

  var incrementinglines = function (q) {
    var lines = []

    var lineCount = 15

    for (var i = 1; i <= lineCount; i++) {
      lines.push(q.fill(i).trim())
    }

    // return lines;
    return {
      lines: lines,
      config: {
        strategy: `incrementinglines`,
        lineCount: lineCount
      }
    }
  }

  var decrementinglines = function (q) {
    var lines = []

    var lineCount = 15

    for (var i = lineCount; i > 0; i--) {
      lines.push(q.fill(i).trim())
    }

    return {
      lines: lines,
      config: {
        strategy: `decrementinglines`,
        lineCount: lineCount
      }
    }
  }

  // 20 lines, 2 words. Could we do "better/different"?
  var shortlines = function (q) {
    var lines = []

    var lineCount = 20

    var wordsPerLine = 2

    for (var i = 1; i <= lineCount; i++) {
      lines.push(q.fill(wordsPerLine).trim())
    }

    return {
      lines: lines,
      config: {
        strategy: `shortlines`,
        lineCount: lineCount,
        wordsPerLine: wordsPerLine
      }
    }
  }

  var diamond = function (q) {
    var lines = []

    var i

    var lineCount = 30

    var limit = Math.floor(lineCount / 2)

    for (i = 1; i <= limit; i++) {
      lines.push(q.fill(i).trim())
    }
    for (i = limit; i > 0; i--) {
      lines.push(q.fill(i).trim())
    }

    return {
      lines: lines,
      config: {
        strategy: `diamond`,
        lineCount: lineCount
      }
    }
  }

  var drone = function (q) {
    var lineLength = util.randomInRange(4, 12)
    // words per line

    var stanzaLength = util.randomInRange(2, 5)
    // total stanzas

    var lineCount = util.randomInRange(2, 8) * stanzaLength
    // this could have been stanzaCount with different math

    var lines = []

    var i

    var repeat = q.fill(lineLength).trim()

    for (i = 0; i < lineCount; i += stanzaLength) {
      for (var j = 0; j < stanzaLength; j++) {
        lines.push(q.fill(lineLength).trim())
      }
      lines.push(repeat, ``)
    }
    return {
      lines: lines,
      config: {
        strategy: `drone`,
        lineCount: lineCount,
        lineLength: lineLength,
        stanzaCount: stanzaLength
      }
    }
  }

  // some false positives like "Nor," "'Hee-haw!'" (including the quotes, from theoriginal)
  var enforceEndingPunct = function (lines) {
    let re = /[.?!]$|^$/

    let finalPunct = config.finalPunct || `.`
    // TODO: elaboration, if not defined, see what's most common? or some other heuristic
    lines = lines.map((l) => re.test(l.trim()) ? l.trim() : l.trim() + finalPunct)
    return lines
  }

  this.generate = () => {
    const text = opts.texts.map(t => t.text())

    const sentences = textutil.sentencify(text)

    const q = (queneauBuckets(opts)).seed(sentences)

    const strategies = [
      incrementinglines,
      decrementinglines,
      shortlines,
      diamond,
      drone
    ]

    let strategy

    // TODO: fuzzy methods for this? ehhhh, dunno
    // TODO: a method that passes in a paguram for number of words per line
    const method = config.subStrategy || `` // fmMethods.get(config.method).value;
    switch (method) {
      case `incrementinglines`:
        strategy = incrementinglines
        break

      case `decrementinglines`:
        strategy = decrementinglines
        break

      case `shortlines`:
        strategy = shortlines
        break

      case `diamond`:
        strategy = diamond
        break

      case `drone`:
        strategy = drone
        break

      default:
        strategy = util.pick(strategies)
    }

    const poem = strategy(q)

    poem.lines = enforceEndingPunct(poem.lines)

    return {
      text: poem.lines.join(`\n`),
      lines: poem.lines,
      config: poem.config
    }
  }
}

module.exports = bucketRunner
