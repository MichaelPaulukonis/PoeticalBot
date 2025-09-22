#!/usr/bin/env node

// Test NPF integration with the Lambda handler
require('dotenv').config({ path: '../.env' })

console.log('🧪 Testing NPF Integration with Lambda Handler')
console.log('==============================================\n')

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

console.log('🎭 Testing Lambda handler with NPF formatting...')

handler(mockEvent, mockContext)
  .then(result => {
    console.log('\n✅ Lambda handler successful!')
    console.log('Result:', result)
    
    const config = require('./config.js')
    if (config.postLive) {
      console.log('\n🚀 POST_LIVE is true - this posted to Tumblr with NPF format!')
      console.log('Check https://poeticalbot.tumblr.com for the new post')
    } else {
      console.log('\n✅ POST_LIVE is false - NPF format shown in logs above')
      console.log('💡 Set POST_LIVE=true to test live posting with NPF')
    }
  })
  .catch(error => {
    console.error('\n❌ Lambda handler failed:')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
  })