
let nlp = require(`compromise`)
let util = new (require(`./util`))()
let textutil = require(`./textutil.js`)

// word, as opposed to sentences or larger
// so we remove punctuation, etc.
let wordCleaner = function (word) {
  // single-apostrophes left for now (posessive and contractions)
  // need a better algorithm....
  let clean = word.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$|[()_,"]|-+/g, ``).replace(/\s+/g, ` `)
  return clean.trim()
}

let PatternMatcher = function () {
  if (!(this instanceof PatternMatcher)) {
    return new PatternMatcher()
  }

  const getPatterns = ({ lines, selectedMethod, matchPattern }) => {
    const matchStrategyFactory = (template) => text => {
      let n = nlp(text)
      return {
        filtered: n.match(template).out(`array`),
        descr: `match: '${template}'`
      }
    }

    let posStrategy = () => text => {
      let n = nlp(text)
      const targetPos = util.pick([`nouns`, `adjectives`, `adverbs`, `places`, `verbs`, `values`, `people`])
      return {
        filtered: n[targetPos]().out(`array`).map(n => wordCleaner(textutil.cleaner(n))),
        descr: `pos: ${targetPos}`
      }
    }

    let matchPatternFactory = function () {
      let tags = [`Acronym`, `Adjective`, `Adverb`, `Auxillary`, `Cardinal`, `City`,
        `ClauseEnd`, `Comparative`, `Condition`, `Conjunction`, `Contraction`,
        `Copula`, `Country`, `Currency`, `Date`, `Demonym`, `Determiner`,
        `Duration`, `Expression`, `FemaleName`, `FirstName`, `FuturePerfect`,
        `Gerund`, `Holiday`, `Infinitive`, `LastName`, `MaleName`, `Modal`,
        `Money`, `Month`, `Negative`, `NiceNumber`, `Noun`, `NounPhrase+`, `NumberRange`,
        `NumericValue`, `Ordinal`, `Organization`, `Participle`, `Particle`,
        `PastTense`, `PerfectTense`, `Person`, `Place`, `Pluperfect`,
        `Plural`, `Possessive`, `Preposition`, `PresentTense`, `Pronoun`,
        `QuestionWord`, `Quotation`, `RelativeDay`, `Singular`, `Superlative`,
        `Time`, `Unit`, `Value`, `Verb`, `VerbPhrase+`, `WeekDay`, `Year`]

      let tag = util.pick(tags)
      if (util.coinflip()) { tag = tag.indexOf(`+`) > 0 ? tag : tag + `+` }
      let template = util.pick([`#${tag}`, `. #${tag} .`,
        `. (#${util.pick(tags)}|#${util.pick(tags)})+ .`])
      if (util.coinflip(0.75)) {
        let max = util.randomInRange(4, 10)
        template = template.replace(/\./g, `{1,${max}}`)
      }
      return matchStrategyFactory(template)
    }

    // looking at compromise tags @ https://github.com/nlp-compromise/compromise/blob/5596d9286e5228278dfcd956d5b98cf9adc0912c/src/sentence/pos/parts_of_speech.js
    let matchStrats = [matchStrategyFactory(`#Adjective #Noun . (are|is) . #Adjective #Noun`),
      matchStrategyFactory(`#Noun * are #Noun+`),
      matchStrategyFactory(`#Noun .? are #Noun+`),
      matchStrategyFactory(`#Adjective #Noun`),
      matchStrategyFactory(`#Adjective+? #Noun .? (are|is) .? (#Adjective|#Noun)+`),
      matchStrategyFactory(`#Adjective? #Noun+ of #Adjective? #Noun`),
      matchStrategyFactory(`#Adverb and #Adverb`),
      matchStrategyFactory(`#Adverb+ #Verb+`),
      matchStrategyFactory(`#Conjunction #Determiner #Noun`),
      matchStrategyFactory(`#Determiner #Adjective`),
      matchStrategyFactory(`#Expression`),
      matchStrategyFactory(`#Gerund`),
      matchStrategyFactory(`#Infinitive`),
      matchStrategyFactory(`#Noun #Conjunction #Noun`),
      matchStrategyFactory(`#Noun #Modal`),
      matchStrategyFactory(`#Noun .? is .? #Noun`),
      matchStrategyFactory(`#Noun is #Noun`),
      matchStrategyFactory(`#Noun the #Noun`),
      matchStrategyFactory(`#Person`),
      matchStrategyFactory(`#Possessive #Noun+`),
      matchStrategyFactory(`#Preposition #Determiner? #Noun+`),
      matchStrategyFactory(`#Value #Adjective? #Noun`),
      matchStrategyFactory(`#Verb not`), // ???
      matchStrategyFactory(`(#Comparative|#Superlative) #Noun`),
      matchStrategyFactory(`(#Noun|#Person) #Copula #Adjective`),
      matchStrategyFactory(`(a|an) #Adjective`),
      matchStrategyFactory(`(a|an) #Noun`),
      matchStrategyFactory(`The #Adjective #Noun`),
      matchStrategyFactory(`The #Noun`),
      matchStrategyFactory(`not #Noun`),
      matchStrategyFactory(`of #Noun and #Noun`)
      // `#Person .? #Gerund`
      // `#Noun+ .? #Gerund`
      // `#Gerund .? #Noun+`
      // `#Gerund+ .? #Gerund+`
      // `. (#Date|#Value) .`
      // looks like EVERYTHING _should be_ in https://github.com/nlp-compromise/compromise/blob/master/src/tags/tree.js
    ]

    let posStrats = [posStrategy,
      posStrategy,
      posStrategy,
      posStrategy,
      posStrategy,
      posStrategy,
      posStrategy]

    let patternStrats = [matchPatternFactory(),
      matchPatternFactory(),
      matchPatternFactory(),
      matchPatternFactory(),
      matchPatternFactory(),
      matchPatternFactory(),
      matchPatternFactory(),
      matchPatternFactory(),
      matchPatternFactory(),
      matchPatternFactory()]

    let strategies = matchStrats.concat(posStrats, patternStrats)

    // TODO: if type of strategy passed in, use it
    // if type is matchPattern and a pattern is passed in, use them
    let strategy

    if (selectedMethod) {
      switch (selectedMethod) {
        case `matchStrats`:
          strategy = matchStrats
          break

        case `posStrats`:
          strategy = posStrats
          break

        case `patternStrats`:
        default:
          strategy = patternStrats
          break
      }
    }

    const matcherFunc = (matchPattern
      ? matchStrategyFactory(matchPattern)
      : util.pick(strategy || strategies))
    const matchedLines = matcherFunc(lines.join(' '))

    return {
      parts: matchedLines.filtered || [],
      description: matchedLines.descr
    }
  }

  const getMatchingLines = function ({ lines, method, matchPattern }) {
    const strategy = getPatterns({ lines, method, matchPattern })
    const uniques = [...(new Set(strategy.parts))]

    const smaller = lines.filter(s => uniques.find(sb => s.toLowerCase().includes(sb)))

    return {
      fragments: uniques,
      sentences: smaller,
      metadata: {
        strategy: strategy.description,
        length: uniques.length
      }
    }
  }

  return { getMatchingLines }
}

module.exports = PatternMatcher
