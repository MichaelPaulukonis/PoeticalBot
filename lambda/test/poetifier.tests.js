const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect

chai.use(dirtyChai)

// Load config from parent directory
require('dotenv').config({ path: '../.env' })
const config = require('../config.js')
const Poetifier = require('../lib/poetifier.js')

let newpoetifier
let poem

describe('Lambda Poetifier', () => {
  describe('API', () => {
    it('returns a new instance with new', () => {
      expect(newpoetifier).to.be.a('object')
      expect(newpoetifier).to.be.an.instanceof(Poetifier)
    })

    it('throws an error if config not supplied as parameter', () => {
      expect(() => {
        (() => new Poetifier())()
      }).to.throw(Error)
    })

    it('exposes a poem method', () => {
      expect(newpoetifier.poem).to.be.a('function')
    })
  })

  before(() => {
    console.log('🔍 Setting up Lambda Poetifier test...')
    console.log('Environment check:')
    console.log('  - AWS_LAMBDA_FUNCTION_NAME:', process.env.AWS_LAMBDA_FUNCTION_NAME)
    console.log('  - POST_LIVE:', process.env.POST_LIVE)

    config.method = 'queneau-buckets'
    config.subStrategy = 'diamond'
    config.corporaFilter = 'eliot'
    config.transform = false
    config.postLive = false // Ensure we don't post during tests
    config.log = true // Enable debug logging

    console.log('📝 Test config:', JSON.stringify(config, null, 2))

    try {
      console.log('🏗️  Creating Poetifier instance...')
      newpoetifier = new Poetifier({ config: config })

      console.log('🎭 Generating poem...')
      poem = newpoetifier.poem({})

      console.log('✅ Poem generated successfully')
      console.log('Lambda Poetifier Test Result:', JSON.stringify(poem, null, 2))
    } catch (error) {
      console.error('❌ Error in test setup:', error.message)
      console.error('Stack:', error.stack)
      throw error
    }
  })

  describe('functional tests', () => {
    it('returns an object', () => {
      expect(poem).to.be.an('object')
    })

    describe('which', () => {
      it('has a "lines" property', () => {
        expect(poem.lines).to.exist()
      })
      it('has a "title" property', () => {
        expect(poem.title).to.exist()
      })
      it('has a "seed" property', () => {
        expect(poem.seed).to.exist()
      })
      it('has a "source" property', () => {
        expect(poem.source).to.exist()
      })
    })

    describe('lines', () => {
      it('are an array', () => {
        expect(poem.lines).to.be.an('array')
      })
      it('having non-zero length', () => {
        expect(poem.lines).to.have.length.above(0)
      })
      it('and contain strings (or nothing)', () => {
        expect(poem.lines.filter(e => typeof e === 'string')).to.have.length(poem.lines.length)
      })
    })

    describe('text', () => {
      it('is a string', () => {
        expect(poem.text).to.be.a('string')
      })
      it('having non-zero length', () => {
        expect(poem.text).to.have.length.above(0)
      })
    })
  })
})
