class Poetifier {
  constructor(options) {
    let util = new (require(`./util.js`))({ statusVerbosity: 0, seed: options.config.seed })
    options.util = util
    // TODO: pass in util (for randomization) to jgnoetry and mispelr
    let jgnoetry = require(`./jgnoetry/jgnoetryRunner.js`)
    let Drone = require(`./sentence.drone.js`)
    let titlifier = new (require(`../lib/titlifier`)).Titlifier({ util: util })
    let mispelr = require(`node-mispelr`)
    let ALWAYS_PRINT = 0
    // let rhymer = require(`../filter/rhymer`)({ util: util })
    let textutils = require(`./textutil.js`)
    let FuzzyMatching = require(`fuzzy-matching`)
    let poemMethods = [`jgnoetry`, `queneau-buckets`, `drone`]
    let fmMethods = new FuzzyMatching(poemMethods)
    let config = options.config
    let logger = function (msg) {
      util.debug(msg, ALWAYS_PRINT)
    }
    util.log = logger
    // TODO: make this a module, as well....
    var reduceCorpora = function (texts) {
      var strategies = [corporaSevenStrategy,
        corporaSevenStrategy,
        corporaFilterStrategy(`childrens|apocalypsenow`),
        corporaFilterStrategy(`childrens|folklore`),
        corporaFilterStrategy(`computerculture|folklore`),
        corporaFilterStrategy(`nasa|folklore`),
        corporaFilterStrategy(`marx|folklore`),
        corporaFilterStrategy(`finnegan|rutabaga`),
        corporaFilterStrategy(`pound|eliot|rutabaga`),
        corporaFilterStrategy(`sms|egypt`),
        corporaFilterStrategy(`sms`),
        corporaFilterStrategy(`shakespeare`),
        corporaFilterStrategy(`cyberpunk`),
        corporaFilterStrategy(`cyberpunk|western`),
        corporaFilterStrategy(`western`),
        corporaFilterStrategy(`gertrudestein`),
        corporaFilterStrategy(`gertrudestein|finnegan`),
        corporaFilterStrategy(`gertrudestein|marx`),
        corporaFilterStrategy(`gertrudestein|sentences`),
        corporaFilterStrategy(`computerculture`),
        corporaFilterStrategy(`filmscripts`),
        corporaFilterStrategy(`spam`),
        corporaFilterStrategy(`spam|sms`),
        corporaFilterStrategy(`spam.0`),
        // corporaFilterStrategy(`2001`),
        // corporaFilterStrategy(`odyssey`),
        // corporaFilterStrategy(`singing`),
        corporaFilterStrategy(`egypt`),
        corporaFilterStrategy(`manifesto`),
        corporaFilterStrategy(`ascii|emoticon`),
        corporaFilterStrategy(`marx`),
        corporaFilterStrategy(`james.joyce`),
        corporaFilterStrategy(`poetry`),
        corporaFilterStrategy(`eliot`),
        corporaFilterStrategy(`imagist`),
        corporaFilterStrategy(`whitman`),
        corporaFilterStrategy(`longfellow`),
        corporaFilterStrategy(`lowell`),
        corporaFilterStrategy(`rome`),
        corporaFilterStrategy(`sentences`)
      ]
      var strategy
      // not a parameter in the function. hrm.....
      if (config.corporaFilter) {
        strategy = corporaFilterStrategy(config.corporaFilter)
      } else {
        strategy = util.pick(strategies)
      }
      return strategy(texts)
    }
    // Todo: get a generic one to take in a numeric parameter
    var corporaSevenStrategy = function (corpus) {
      var newCorpus = []
      for (var i = 0; i < 7; i++) {
        newCorpus.push(util.pickRemove(corpus))
      }
      return newCorpus
    }
    // TODO: hrm. corpora now has a filter....
    var corporaFilterStrategy = function (filter) {
      return function (corpus) {
        var r = new RegExp(filter, `i`)
        return corpus.filter(m => m.name.match(r) !== null)
      }
    }
    const isNumeric = (value) => !isNaN(value - parseFloat(value))
    const transformer = (poem) => {
      // TODO: remove all letterns ut n
      // remove many letters
      // the rhymer is a proof-of-concept whose implementation is annoying
      // AND IT IS REALLY REALLY SLOW
      let strategies = [
        // transformRhymer,
        // vowelifilterTransform,
        // consonafilterTransform,
        letterExistsFilterTransform,
        transformSort,
        transformSort,
        transformLeadingSpaces,
        transformLeadingSpaces,
        transformMispeller
      ]
      let strategy = util.pick(strategies)
      let chance = isNumeric(config.transformChance) ? config.transformChance : 0.15
      return util.coinflip(chance) ? strategy(poem) : poem
    }
    // let transformRhymer = function (poem) {
    //   // console.log(JSON.stringify(poem)); // eslint-disable-line no-console
    //   poem.text = rhymer.generate(poem.text)
    //   return poem
    // }

    let transformLeadingSpaces = function (poem) {
      let config = {
        offset: util.randomInRange(5, 25),
        offsetVariance: util.randomInRange(10, 25),
        offsetProbability: util.randomInRange(5, 10) / 10,
        util: util
      }
      let transform = new (require(`../filter/transform.js`))(config)
      let noLeadingSpaceTemplates = [`howl`, `haiku`, `couplet`]
      if (noLeadingSpaceTemplates.indexOf(poem.template) === -1) {
        logger(`initial spaces`)
        poem.text = transform.generate(poem.text)
      }
      return poem
    }
    let transformMispeller = function (poem) {
      let spelltype = util.randomProperty(mispelr.spelltypes)
      logger(`spelltype: ${spelltype}`)
      poem.text = mispelr.respell(poem.text, spelltype)
      return poem
    }
    let transformSort = function (poem) {
      let caseInsensitiveSort = function (a, b) {
        a = a.toUpperCase() // ignore upper and lowercase
        b = b.toUpperCase() // ignore upper and lowercase
        if (a < b) {
          return -1
        }
        if (a > b) {
          return 1
        }
        return 0
      }
      // TODO: uh.... aren't the lines provided? do we ever use those?
      // what if... TEXT was a property that returned the joined lines?????
      let lines = poem.text.split(`\n`).sort(caseInsensitiveSort)
      if (util.coinflip()) {
        lines = lines.reverse()
      }
      poem.text = lines.filter(l => l.trim().length > 0).join(`\n`)
      return poem
    }
    let vowelifilterTransform = function (poem) {
      poem.lines = poem.lines.map(l => l.replace(/[aeiou]/ig, ``))
      poem.text = poem.lines.join(`\n`)
      return poem
    }
    let consonafilterTransform = function (poem) {
      poem.lines = poem.lines.map(l => l.replace(/[bcdfghjklmnpqrstvwxyz]/ig, ``))
      poem.text = poem.lines.join(`\n`)
      return poem
    }
    let letterExistsFilterTransform = function (poem, letter) {
      // only words that contain a given letter remain
      // TODO: uh, only use letters that occur more than... 5 times?
      let coreFilter = function (poem) {
        let poemCopy = JSON.parse(JSON.stringify(poem))
        let targetLetter = (typeof letter === `undefined`)
          ? util.pick(`abcdefghijklmnoprstuvwxyz`.split(``))
          : letter
        // TODO: lines does not always exist!!!
        if (!poem.lines) {
          util.logger(`NO LINES PROPERTY FOUND`, JSON.stringify(poem, null, 2))
        }
        poemCopy.lines = poemCopy.lines.map((line) => line.split(` `) // NAIVE SPLITTING
          .filter(word => word.indexOf(targetLetter) > -1)
          .join(` `))
        poemCopy.text = poemCopy.lines.join(`\n`)
        return poemCopy
      }
      let filtered = coreFilter(poem)
      while (filtered.text.trim().length < 10) {
        filtered = coreFilter(poem)
      }
      return filtered
    }
    let queneaubuckets = function (config) {
      let Buckets = require(`./bucketRunner`)
      let qb = new Buckets(config)
      return qb.generate()
    }
    let onePoem = function () {
      try {
        const layerRequire = require('./layer-require')
        const Corpora = layerRequire('common-corpus')
        let corpora = new Corpora()
        let strategy
        let texts
        let drone = () => `drone`
        // redefined below, but needed for comparisons
        let strategies = [queneaubuckets,
          jgnoetry,
          drone]
        if (config.file) {
          // TODO: if file does not exist.... do something else
          // end, I Guess.
          texts = [{ name: corpora.cleanName(config.file), text: () => corpora.readFile(config.file) }]
        } else {
          texts = reduceCorpora(corpora.texts)
        }
        if (config.method) {
          let method = fmMethods.get(config.method).value
          switch (method) {
            case `jgnoetry`:
              strategy = jgnoetry
              break
            case `queneau-buckets`:
              strategy = queneaubuckets
              break
            case `drone`:
              strategy = drone
              break
          }
        }
        if (!strategy) {
          strategy = util.pick(strategies)
        }
        let source = texts
        // TODO: THIS IS A HORRIBLE NAME
        // s/b config.linereduce (or better)
        // it turns on use of the (uh...) linereduce utility
        if (config.reduce || util.coinflip(0.3)) {
          config.reduce = true // if random selection
          let lr = new (require(`./lrRunner.js`))({ util: util, texts: texts, reduceType: config.reduceType })
          source = [{
            name: texts.reduce((p, c) => p + ` ` + c.name, ``),
            text: () => lr.lines.join('\n'),
            sentences: () => lr.lines // bucketRunner takes in text AND re-sentencifies it. AAAARGH
          }]
        }
        // instantiate drone only after texts selected, above
        if (strategy === drone) {
          var sentences
          if (config.file || config.reduce || config.corporaFilter) {
            sentences = source.reduce((p, c) => p.concat(c.sentences()), [])
          } else {
            // TODO: set texts, too
            // so the output will reflect the correct texts
            // LIKE this, but... working....
            texts = [util.pick(corpora.filter(`sentence`))]
            sentences = texts[0].sentences()
            // sentences = util.pick(corpora.filter('sentence')).sentences();
          }
          strategy = () => new Drone({
            util: util,
            sentences: sentences
          }).generate()
        }
        // TODO: include strategy name in output
        // TODO: include EVERY OPTION
        //  so we could recreate a poem without the seed
        // well, somewhat....
        let poem = strategy({
          config: config,
          util: util,
          texts: source
        })
        if (!poem.title) {
          do {
            poem.title = titlifier.generate(poem.text)
          } while (poem.title.split(` `).length === 0)
        }
        // do we pass transformers in to the generator?
        // NO, because that means the generator has to know how to manipulate the transformer
        // INSTEAD, the generator can pass back params that the transformer can optionally process
        // the transformer "has" to know about these properties -- but that's sort of the idea
        // it knows about properties, NOT about specific generators
        // make this conditional, geez
        if (config.transform) poem = transformer(poem)
        // do not clean if we're processing from one of the ascii-art files
        if (texts.filter(t => t.name.match(/ascii|emoticon/i) !== null).length === 0) {
          poem.text = textutils.cleaner(poem.text)
        }
        poem.seed = util.seed
        poem.source = texts.reduce((p, c) => p + ` ` + c.name, ``)
        return poem
      } catch (ex) {
        if (util.seed) {
          logger(`seed: ${util.seed}`)
        }
        logger(ex.stack || ex)
        return `An error has occured`
      }
    }
    let teller = function () {
      let poem = onePoem()
      if (config.log) {
        logger(JSON.stringify(poem))
        logger(poem.text)
      }
      return poem
    }
    this.poem = teller
  }
}

module.exports = Poetifier
