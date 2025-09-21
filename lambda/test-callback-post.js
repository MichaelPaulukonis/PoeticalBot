#!/usr/bin/env node

// Test post creation with callback patterns
require('dotenv').config({ path: '../.env' })

const config = require('./config.js')
const tumblr = require('tumblr.js')

console.log('🧪 Testing Post Creation with Callbacks')
console.log('=======================================\n')

const client = tumblr.createClient({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  token: config.accessToken,
  token_secret: config.accessSecret,
})

function testCreatePostCallback() {
  console.log('🔍 Testing client.createPost with callback...')
  
  return new Promise((resolve) => {
    try {
      client.createPost('poeticalbot', {
        content: [
          {
            type: 'text',
            text: 'Test post from callback - please ignore'
          }
        ],
        title: 'Test Callback Post'
      }, function(err, result) {
        if (err) {
          console.error('❌ createPost callback failed:', err.message)
          resolve(false)
        } else {
          console.log('✅ createPost callback worked!')
          console.log('Result:', JSON.stringify(result, null, 2))
          resolve(true)
        }
      })
    } catch (error) {
      console.error('❌ createPost callback threw error:', error.message)
      resolve(false)
    }
  })
}

function testDifferentEndpoints() {
  console.log('\n🔍 Testing different postRequest endpoints...')
  
  const endpoints = [
    '/blog/poeticalbot.tumblr.com/post',
    '/blog/poeticalbot/post', 
    '/v2/blog/poeticalbot.tumblr.com/post',
    '/v2/blog/poeticalbot/post'
  ]
  
  return Promise.all(endpoints.map(endpoint => {
    return new Promise((resolve) => {
      console.log(`  Testing endpoint: ${endpoint}`)
      
      client.postRequest(endpoint, {
        type: 'text',
        title: 'Test Endpoint',
        body: 'Test post - please ignore'
      }, function (err, json) {
        if (err) {
          console.log(`    ❌ ${endpoint}: ${err.message}`)
          resolve({ endpoint, success: false, error: err.message })
        } else {
          console.log(`    ✅ ${endpoint}: Success!`)
          resolve({ endpoint, success: true, result: json })
        }
      })
    })
  }))
}

async function testUserInfo() {
  console.log('\n🔍 Testing userInfo to verify connection...')
  
  return new Promise((resolve) => {
    client.userInfo((err, data) => {
      if (err) {
        console.error('❌ userInfo failed:', err.message)
        resolve(false)
      } else {
        console.log('✅ userInfo worked!')
        console.log('User blogs:')
        data.user.blogs.forEach(blog => {
          console.log(`  - ${blog.name} (${blog.url})`)
        })
        resolve(true)
      }
    })
  })
}

async function main() {
  if (config.postLive) {
    console.log('❌ POST_LIVE is true - aborting to avoid spam posts')
    return
  }
  
  console.log('✅ POST_LIVE is false - safe to test\n')
  
  // First verify our connection works
  const userInfoWorks = await testUserInfo()
  
  if (!userInfoWorks) {
    console.log('❌ Basic connection failed - check credentials')
    return
  }
  
  // Test callback-based createPost
  const callbackWorks = await testCreatePostCallback()
  
  // Test different endpoints
  const endpointResults = await testDifferentEndpoints()
  
  console.log('\n📊 Results:')
  console.log('userInfo:', userInfoWorks ? '✅ Works' : '❌ Failed')
  console.log('createPost callback:', callbackWorks ? '✅ Works' : '❌ Failed')
  
  console.log('\nEndpoint Results:')
  endpointResults.forEach(result => {
    console.log(`  ${result.endpoint}: ${result.success ? '✅ Works' : '❌ Failed'}`)
  })
  
  const workingEndpoint = endpointResults.find(r => r.success)
  if (workingEndpoint) {
    console.log(`\n💡 Use endpoint: ${workingEndpoint.endpoint}`)
  } else {
    console.log('\n❌ No working endpoints found')
  }
}

main().catch(console.error)