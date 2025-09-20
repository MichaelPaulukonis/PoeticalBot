const { templates } = require('./templating')

const jgRunner = function (options) {
  if (options === undefined) {
    options = { debug: function (msg) { console.log(msg) } } // eslint-disable-line no-console
  }

  const corpora = {
    texts: options.texts,
    weights: []
  }

  const util = options.util
  const config = options.config
  const JGnoetry = require(`./jgnoetry.headless.js`)

  // TODO: oh, g-d, the logging is C-R-A-Z-Y !!!
  // there's no way to change this value....
  // because it's shared by everything that gets the same utility
  // C-R-A-P
  const jg = new JGnoetry(util)

  // work around this naming weirdness
  const jgOptions = {
    'method': `jgnoetry`,
    'handlePunctuation': `noParen`,
    'byNewlineOrPunctuation': `punctuation`,
    'capitalize': {
      'method': `capitalizeCustom`, // capitalizeNone, capitalizeAsCorpus
      'customSentence': true, // sentence beginning
      'customLine': true, // line beginnings
      'customI': true // capitalize "I"
    },
    'appendToPoem': `appendPeriod`,
    'statusVerbosity': 0
  }

  let existingText = []

  const capitalizations = [`capitalizeCustom`, `capitalizeNone`, `capitalizeAsCorpus`]

  const endPuncts = [`appendNothing`, `appendPeriod`, `appendQuestion`, `appendExclamation`]

  // methods: random, even, tilted
  // ditch the "pick one, pick two" - let that be the domain of the corpora filters
  // (this is a hold-over from when there were no corpora filters)
  const assignWeights = (count) => {
    const strategies = [assignWeightsRandom, assignWeightsEven, assignWeightsTentpole]
    const strategy = util.pick(strategies)
    return strategy(count)
  }

  // one item will be much more significant than the others
  const assignWeightsTentpole = function (count) {
    if (count === 1) { return [100] }

    var weights = []

    var total = 0

    weights.push(util.randomInRange(50, 80))
    total += weights[0]

    for (var i = 1; i < count - 1; i++) {
      weights[i] = util.random(100 - total)
      total += weights[i]
    }
    weights[count - 1] = (100 - total)

    util.shuffle(weights)

    return weights
  }

  // return an array of length n, where n := texts.lengh
  // and sum(array) := 100 and array[0] == a[1] == a[1.length]
  const assignWeightsEven = function (count) {
    var weights = []

    for (var i = 0; i < count; i++) {
      weights[i] = 100 / count
    }

    return weights
  }

  // return an array of length n, where n := texts.lengh
  // sum(array) := 100
  var assignWeightsRandom = function (count) {
    var weights = []

    var total = 0

    // naive implementation
    // first value has a greater chance of being > other values
    // last value has a greater chance of being < other value
    // but then we shuffle 'em all
    for (var i = 0; i < count - 1; i++) {
      weights[i] = util.random(100 - total)
      total += weights[i]
    }
    weights.push(100 - total)
    util.shuffle(weights)

    return weights
  }

  var assignCapitalization = function () {
    var cap = {
      method: util.pick(capitalizations),
      customSentence: true, // sentence beginning
      customLine: true, // line beginnings
      customI: true // capitalize "I"
    }

    if (cap.method !== `capitalizeCustom`) {
      cap.customSentence = false
      cap.customLine = false
      cap.customI = false
    }

    return cap
  }

  var cleaner = function (text) {
    // remove /r (DOS style)
    return text.replace(/\r/g, ``)
      // remove leading whitespace
      .replace(/^\s*/g, ``)
      .replace(/\n\s*/g, `\n`)
      .trim()
  }

  // TODO: the corpora should be an array of objects, each of which has a name, a text, and an associated weigth
  corpora.weights = assignWeights(corpora.texts.length)
  var templateName

  if (config.templateName && templates[config.templateName]) {
    templateName = config.templateName
  }
  if (!templateName) {
    templateName = util.pick(Object.keys(templates))
  }
  jgOptions.capitalize = assignCapitalization()
  jgOptions.appendToPoem = util.pick(endPuncts)

  util.debug(JSON.stringify(jgOptions, null, 2), 0)
  util.debug(templateName, 0)
  util.debug(corpora.weights.join(` `), 0)

  const titles = corpora.texts.map(t => t.name)
  corpora.texts = corpora.texts.map(b => b.text())
  const output = jg.generate(templates[templateName], jgOptions, corpora, existingText)
  const text = cleaner(output.displayText)
  const lines = text.split('\n')

  return {
    title: ``, // titlifier(output.displayText),
    text,
    lines,
    template: templateName,
    corpora: titles,
    options: jgOptions
  }
}

module.exports = jgRunner
