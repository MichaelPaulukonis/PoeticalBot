#!/usr/bin/env node

// Local test script for Lambda function
// require('dotenv').config({ path: '../.env' })

const handler = require('./index').handler

// Mock Lambda event and context
const mockEvent = {}
const mockContext = {
  getRemainingTimeInMillis: () => 30000,
  functionName: 'poeticalbot-test',
  functionVersion: '$LATEST',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:poeticalbot-test',
  memoryLimitInMB: '128',
  awsRequestId: 'test-request-id'
}

console.log('Testing Lambda function locally...')
console.log('Environment variables loaded from ../.env')

handler(mockEvent, mockContext)
  .then(result => {
    console.log('\n✅ Success!')
    console.log('Result:', result)
  })
  .catch(error => {
    console.log('\n❌ Error!')
    console.error('Error:', error)
  })
