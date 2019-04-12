let expect = require(`chai`).expect
let util = new (require(`../lib/util.js`))()
let newcorpora = new (require(`common-corpus`))()
let config = { util: util, texts: [newcorpora.texts[2]] }
let queneauBuckets = require(`../lib/queneau-buckets-modified`)
// bucketCore = queneauBuckets(config).seed(
//     // must provide util AND texts
//     // texts 0 (history of art, > 2000ms) ,1 are a bit long. ugh. this is awkward
//     // 2 is Ginsberg's Howl
//     bucketRunner = new BucketRunner({util: util, texts: [newcorpora.texts[2]]});

describe(`queneau-buckets-modified core tests`, () => {
  describe(`API`, () => {
    var qb = queneauBuckets(config)

    it(`should return a function`, () => {
      expect(queneauBuckets).to.be.a(`function`)
    })

    it(`the function should return an object`, () => {
      expect(qb).to.be.a(`object`)
    })

    it(`should throw a custom error if not provided with a util`, () => {
      expect(() => queneauBuckets()).to.throw(`util.pick must be supplied as part of config`)
    })

    it(`should expose a seed method`, () => {
      expect(qb.seed).to.be.a(`function`)
    })

    it(`should expose a fill method`, () => {
      expect(qb.fill).to.be.a(`function`)
    })
  })

  describe(`fill tests`, () => {
    let qb
    describe(`test seed of single line, multi-word sentence`, () => {
      before(() => {
        qb = queneauBuckets(config)
        qb.seed([`This is a sentence.`])
      })
      it(`request 3 words should return 3 words`, () => {
        let poem = qb.fill(3)
        expect(poem).to.be.a(`string`)
        expect(poem).to.have.length.above(0)
        expect(poem.split(` `)).to.have.length(3)
      })
      it(`request 0 words should return empty string`, () => {
        let poem = qb.fill(0)
        expect(poem).to.be.a(`string`)
        expect(poem).to.have.length(0)
        expect(poem.split(` `)).to.have.length(1) // ''.split(' ') => ['']
      })
    })

    // test 1,2,3, 3+ words on single-line
    // original implementation would fail on 1- and 2-word sentences
    describe(`test seed of single line, single-word sentence`, () => {
      let qb
      const sentence = `Dreamers`
      before(() => {
        qb = queneauBuckets(config)
        qb.seed([sentence])
      })
      it(`request 5 words should return 5 words`, () => {
        let poem = qb.fill(5)
        expect(poem).to.be.a(`string`)
        expect(poem).to.have.length.above(sentence.length)
        expect(poem.split(` `)).to.have.length(5)
      })
      it(`request 0 words should return empty string`, () => {
        let poem = qb.fill(0)
        expect(poem).to.be.a(`string`)
        expect(poem).to.have.length(0)
        expect(poem.split(` `)).to.have.length(1) // ''.split(' ') => ['']
      })
    })

    describe(`test seed of single line, two-word sentence`, () => {
      var qb = queneauBuckets(config)
      let sentence = `Dreamers dream!`
      qb.seed([sentence])
      it(`request 5 words should return 5 words`, () => {
        let poem = qb.fill(5)
        expect(poem).to.be.a(`string`)
        expect(poem).to.have.length.above(sentence.length)
        expect(poem.split(` `)).to.have.length(5)
      })
      it(`request 0 words should return empty string`, () => {
        let poem = qb.fill(0)
        expect(poem).to.be.a(`string`)
        expect(poem).to.have.length(0)
        expect(poem.split(` `)).to.have.length(1) // ''.split(' ') => ['']
      })
    })

    describe(`test seed of single line, three-word sentence`, () => {
      var qb = queneauBuckets(config)
      let sentence = `Dreamers can dream!`
      qb.seed([sentence])
      it(`request 5 words should return 5 words`, () => {
        let poem = qb.fill(5)
        expect(poem).to.be.a(`string`)
        expect(poem).to.have.length.above(0)
        expect(poem.split(` `)).to.have.length(5)
      })
      it(`request 0 words should return empty string`, () => {
        let poem = qb.fill(0)
        expect(poem).to.be.a(`string`)
        expect(poem).to.have.length(0)
        expect(poem.split(` `)).to.have.length(1) // ''.split(' ') => ['']
      })
    })

    describe(`test seed of multi-line sentences`, () => {
      var qb = queneauBuckets(config)
      let sentences = [`Dreamers can dream!`, `Tests can be run automatically.`]
      qb.seed(sentences)
      it(`request 5 words should return 5 words`, () => {
        let poem = qb.fill(5)
        expect(poem).to.be.a(`string`)
        expect(poem).to.have.length.above(0)
        expect(poem.split(` `)).to.have.length(5)
      })
      it(`request 0 words should return empty string`, () => {
        let poem = qb.fill(0)
        expect(poem).to.be.a(`string`)
        expect(poem).to.have.length(0)
        expect(poem.split(` `)).to.have.length(1) // ''.split(' ') => ['']
      })
    })
  })
})
