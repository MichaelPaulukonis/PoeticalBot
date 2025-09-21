#!/usr/bin/env node

// Debug what methods are available on the tumblr.js client
require('dotenv').config({ path: '../.env' })

const config = require('./config.js')
const tumblr = require('tumblr.js')

console.log('🔍 Debugging tumblr.js client methods')
console.log('====================================\n')

const client = tumblr.createClient({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  token: config.accessToken,
  token_secret: config.accessSecret,
})

console.log('Available methods on client:')
console.log(Object.getOwnPropertyNames(client).filter(name => typeof client[name] === 'function'))

console.log('\nAll properties on client:')
console.log(Object.getOwnPropertyNames(client))

console.log('\nPrototype methods:')
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(client)).filter(name => typeof client[name] === 'function'))

// Test a simple method to see the pattern
console.log('\n🧪 Testing userInfo method...')
try {
  const userInfoResult = client.userInfo()
  console.log('userInfo returns:', typeof userInfoResult)
  
  if (userInfoResult && typeof userInfoResult.then === 'function') {
    console.log('✅ userInfo returns a promise')
    userInfoResult
      .then(data => {
        console.log('✅ userInfo promise resolved')
        console.log('User has', data.user.blogs.length, 'blogs')
      })
      .catch(err => {
        console.error('❌ userInfo promise rejected:', err.message)
      })
  } else {
    console.log('⚠️  userInfo does not return a promise')
  }
} catch (error) {
  console.error('❌ Error calling userInfo:', error.message)
}