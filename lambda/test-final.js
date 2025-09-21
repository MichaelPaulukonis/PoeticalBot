#!/usr/bin/env node

// Test the final Lambda function with working tumblr.js
require('dotenv').config({ path: '../.env' })

console.log('🧪 Testing Final Lambda Function')
console.log('================================\n')

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

console.log('🎭 Testing Lambda handler with working tumblr.js...')

handler(mockEvent, mockContext)
  .then(result => {
    console.log('\n✅ Lambda handler successful!')
    console.log('Result:', result)

    const config = require('./config.js')
    if (config.postLive) {
      console.log('\n🚀 POST_LIVE is true - this posted to Tumblr!')
      console.log('Check https://poeticalbot.tumblr.com for the new post')
    } else {
      console.log('\n✅ POST_LIVE is false - safe test mode')
    }
  })
  .catch(error => {
    console.error('\n❌ Lambda handler failed:')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
  })
