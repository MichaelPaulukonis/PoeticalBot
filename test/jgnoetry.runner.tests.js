const chai = require(`chai`)
const expect = chai.expect
const util = new (require(`../lib/util.js`))({ statusVerbosity: -1 })
const Corpora = require(`common-corpus`)
const jgRunner = require(`../lib/jgnoetry/jgnoetryRunner.js`)

describe(`jgnoetry`, () => {
  describe(`API: runner ...`, () => {
    let samplePoem

    before(() => {
      const texts = new Corpora().texts

      samplePoem = jgRunner({
        config: {},
        util: util,
        texts: texts
      })
    })
    it(`... should return an object`, () => {
      expect(samplePoem).to.be.an(`object`)
    })

    // title, text, template (name), corpora (titles)
    it(`... should return a title property`, () => {
      expect(samplePoem.title).to.be.a(`string`)
    })

    it(`... should return a text property (string)`, () => {
      expect(samplePoem.text).to.be.a(`string`)
    })

    it(`... should return a template (name) property (string)`, () => {
      expect(samplePoem.template).to.be.a(`string`)
    })

    it(`... should return a corpora property [titles]`, () => {
      expect(samplePoem.corpora).to.be.an(`array`)
    })
  })

  describe(`running the runner ...`, () => {
    let samplePoem

    before(() => {
      const texts = new Corpora().texts

      samplePoem = jgRunner({
        config: {},
        util: util,
        texts: texts
      })
    })
    it(`... should return an object`, () => {
      expect(samplePoem).to.be.an(`object`)
    })

    // title, text, template (name), corpora (titles)
    it(`... should return a title property`, () => {
      expect(samplePoem.title).to.be.a(`string`)
    })

    it(`... should return a text property (string)`, () => {
      expect(samplePoem.text).to.be.a(`string`)
    })

    it(`... should return a template (name) property (string)`, () => {
      expect(samplePoem.template).to.be.a(`string`)
    })

    it(`... should return a corpora property [titles]`, () => {
      expect(samplePoem.corpora).to.be.an(`array`)
    })
  })
})
