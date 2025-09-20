const chai = require('chai')
const expect = chai.expect

// Load config from parent directory
require('dotenv').config({ path: '../.env' })
const { handler } = require('../index')

describe('Lambda Handler', () => {
  let result

  const mockEvent = {}
  const mockContext = {
    getRemainingTimeInMillis: () => 30000,
    functionName: 'poeticalbot-test',
    functionVersion: '$LATEST',
    invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:poeticalbot-test',
    memoryLimitInMB: '128',
    awsRequestId: 'test-request-id'
  }

  before(async () => {
    // Set test mode to avoid posting to Tumblr
    process.env.POST_LIVE = 'false'
    
    try {
      result = await handler(mockEvent, mockContext)
    } catch (error) {
      console.error('Handler test error:', error)
      throw error
    }
  })

  describe('Lambda function execution', () => {
    it('returns a response object', () => {
      expect(result).to.be.an('object')
    })

    it('has a statusCode property', () => {
      expect(result.statusCode).to.exist()
      expect(result.statusCode).to.be.a('number')
    })

    it('returns success status code', () => {
      expect(result.statusCode).to.equal(200)
    })

    it('has a body property', () => {
      expect(result.body).to.exist()
      expect(result.body).to.be.a('string')
    })

    it('indicates successful poem generation', () => {
      expect(result.body).to.match(/generated|posted/i)
    })
  })
})