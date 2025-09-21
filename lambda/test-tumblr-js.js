#!/usr/bin/env node

// Test the new tumblr.js integration
require('dotenv').config({ path: '../.env' })

const config = require('./config.js')
const tumblr = require('tumblr.js')

console.log('🧪 Testing Lambda with tumblr.js')
console.log('=================================\n')

const client = tumblr.createClient({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  token: config.accessToken,
  token_secret: config.accessSecret
})

console.log('✅ tumblr.js client created')

// Test the Lambda handler
const { handler } = require('./index')

const mockEvent = {}
const mockContext = {
  getRemainingTimeInMillis: () => 30000,
  functionName: 'poeticalbot-test',
  functionVersion: '$LATEST',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:poeticalbot-test',
  memoryLimitInMB: '128',
  awsRequestId: 'test-request-id'
}

console.log('🎭 Testing Lambda handler...')

handler(mockEvent, mockContext)
  .then(result => {
    console.log('\n✅ Lambda handler successful!')
    console.log('Result:', result)

    if (config.postLive) {
      console.log('\n⚠️  POST_LIVE is true - this would have posted to Tumblr!')
    } else {
      console.log('\n✅ POST_LIVE is false - safe test mode')
    }
  })
  .catch(error => {
    console.error('\n❌ Lambda handler failed:')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
  })
