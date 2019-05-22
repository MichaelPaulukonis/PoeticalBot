const chai = require(`chai`)
const expect = chai.expect
const Util = require(`../lib/util.js`)
const util = new Util()
const JGnoetry = require(`../lib/jgnoetry/jgnoetry.headless.js`)
const jg = new JGnoetry(util)

describe(`jGnoetry.headless tests`, () => {
  describe(`API tests`, () => {
    it(`should return a new instance with new`, () => {
      const jg = new JGnoetry(util)
      expect(jg).to.be.a(`object`)
      expect(jg).to.be.an.instanceof(JGnoetry)
    })

    it(`should return a new instance even without new`, () => {
      const jg = JGnoetry(util)
      expect(jg).to.be.a(`object`)
      expect(jg).to.be.an.instanceof(JGnoetry)
    })

    it(`should expose a generate method`, () => {
      expect(jg.generate).to.be.a(`function`)
    })
  })

  describe(`generate()`, () => {
    it(`should return a string when called with proper params`, () => {
      // NOTE: if you don't want to set all this up, use the runner!
      const options = { 'handlePunctuation': `noParen`, 'byNewlineOrPunctuation': `punctuation`, 'capitalize': { 'method': `capitalizeCustom`, 'customSentence': true, 'customLine': true, 'customI': true }, 'appendToPoem': `appendPeriod`, 'areWordsSelectedBegin': `startSelected`, 'thisWordSelectedBegin': `startSelected`, 'changeSelectionEffect': `requiresClick`, 'statusVerbosity': 1 }
      const corpora = { texts: [`this is the cat that was over there with the mill.`], weights: [100] }
      const template = `[s] [n] `
      const existingText = ``

      // corpora.texts = reduceCorpora(corpora.texts);
      // corpora.weights = assignWeights(corpora.texts.length);
      // const templateName = util.pick(Object.keys(templates));
      // options.capitalize = assignCapitalization();
      // options.appendToPoem = util.pick(endPuncts);

      const output = jg.generate(template, options, corpora, existingText)

      expect(output).to.be.an(`object`)
    })

    /*
     TODO: there is a bug (?) where existing text is shifted becuase new words have too many syllables

     ex: [s] [s] [s] [s] [s] [s] => s s {{random}} s s (where {{..}} denote "kept" text)
     output: Shake gently random from =< s s s {{random}} s
     Cannot reproduce "on-demand" since it randomly outputs this stuff
     need to wire-up a random-seed thing, and then trap a random seed for an instance when it happens
     NOTE: I'm reproducing this in the GUI version, so need to get tests in here once random-seed is set up
     */
    it(`should keep existingText when told`, () => {
      const options = { 'handlePunctuation': `noParen`, 'byNewlineOrPunctuation': `punctuation`, 'capitalize': { 'method': `capitalizeCustom`, 'customSentence': true, 'customLine': true, 'customI': true }, 'appendToPoem': `appendPeriod`, 'areWordsSelectedBegin': `startSelected`, 'thisWordSelectedBegin': `startSelected`, 'changeSelectionEffect': `requiresClick`, 'statusVerbosity': 1 }
      const corpora = { texts: [`the cat the dog the oboe and the mill were in the dob barn with the rat`], weights: [100] }
      const template = `[s] [s] [n] `
      const existingText = [{ text: `the`, keep: true }, { text: `the`, keep: false }]
      const output = jg.generate(template, options, corpora, existingText)

      // hrm. we've got a leading-space issue in jgnoetry....
      // hey... displayText is a STUPID NAME for a headless module...

      const words = output.displayText.trim().split(` `)

      expect(output).to.be.an(`object`)
      expect(output.displayText).to.be.a(`string`)
      expect(words[0].toLowerCase()).to.equal(existingText[0].text.toLowerCase())
    })
  })
})
