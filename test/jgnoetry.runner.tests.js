var chai = require(`chai`)
var expect = chai.expect
var util = new (require(`../lib/util.js`))({ statusVerbosity: -1 })
var Corpora = require(`common-corpus`)
var texts = new Corpora().texts
var jgRunner = require(`../lib/jgnoetryRunner.js`)

var samplePoem = jgRunner({
  config: {},
  util: util,
  texts: texts
})

describe(`jgnoetry tests`, function () {
  // TODO: logging is done explicitly even in test-mode
  // UGH UGh UGh
  it(`should return an object`, function () {
    expect(samplePoem).to.be.an(`object`)
  })

  // title, text, template (name), corpora (titles)
  it(`should return a title property`, function () {
    expect(samplePoem.title).to.be.a(`string`)
  })

  it(`should return a text property (string)`, function () {
    expect(samplePoem.text).to.be.a(`string`)
  })

  it(`should return a template (name) property (string)`, function () {
    expect(samplePoem.template).to.be.a(`string`)
  })

  it(`should return a corpora property [titles]`, function () {
    expect(samplePoem.corpora).to.be.an(`array`)
  })
})
