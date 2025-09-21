#!/usr/bin/env node

// Test different post creation methods
require('dotenv').config({ path: '../.env' })

const config = require('./config.js')
const tumblr = require('tumblr.js')

console.log('🧪 Testing Post Creation Methods')
console.log('================================\n')

const client = tumblr.createClient({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  token: config.accessToken,
  token_secret: config.accessSecret
})

async function testCreatePost () {
  console.log('🔍 Testing client.createPost (promise-based)...')

  try {
    const result = await client.createPost('poeticalbot', {
      content: [
        {
          type: 'text',
          text: 'Test post from tumblr.js - please ignore'
        }
      ],
      layout: [
        {
          type: 'rows',
          display: [
            {
              blocks: [0]
            }
          ]
        }
      ],
      title: 'Test Post'
    })

    console.log('✅ createPost worked!')
    console.log('Result:', JSON.stringify(result, null, 2))
    return true
  } catch (error) {
    console.error('❌ createPost failed:', error.message)
    return false
  }
}

async function testCreateLegacyPost () {
  console.log('\n🔍 Testing client.createLegacyPost...')

  try {
    const result = await client.createLegacyPost('poeticalbot', {
      type: 'text',
      title: 'Test Legacy Post',
      body: 'Test post from createLegacyPost - please ignore'
    })

    console.log('✅ createLegacyPost worked!')
    console.log('Result:', JSON.stringify(result, null, 2))
    return true
  } catch (error) {
    console.error('❌ createLegacyPost failed:', error.message)
    return false
  }
}

async function testPostRequest () {
  console.log('\n🔍 Testing client.postRequest...')

  return new Promise((resolve) => {
    client.postRequest('/blog/poeticalbot.tumblr.com/post', {
      type: 'text',
      title: 'Test PostRequest',
      body: 'Test post from postRequest - please ignore'
    }, function (err, json) {
      if (err) {
        console.error('❌ postRequest failed:', err.message)
        resolve(false)
      } else {
        console.log('✅ postRequest worked!')
        console.log('Result:', JSON.stringify(json, null, 2))
        resolve(true)
      }
    })
  })
}

async function main () {
  console.log('⚠️  WARNING: This will create test posts on poeticalbot.tumblr.com')
  console.log('Make sure POST_LIVE is false to avoid this!\n')

  if (config.postLive) {
    console.log('❌ POST_LIVE is true - aborting to avoid spam posts')
    return
  }

  console.log('✅ POST_LIVE is false - safe to test (no actual posts will be made)\n')

  // Test all methods
  const createPostWorks = await testCreatePost()
  const createLegacyPostWorks = await testCreateLegacyPost()
  const postRequestWorks = await testPostRequest()

  console.log('\n📊 Results:')
  console.log('createPost:', createPostWorks ? '✅ Works' : '❌ Failed')
  console.log('createLegacyPost:', createLegacyPostWorks ? '✅ Works' : '❌ Failed')
  console.log('postRequest:', postRequestWorks ? '✅ Works' : '❌ Failed')

  if (createPostWorks) {
    console.log('\n💡 Recommendation: Use createPost with new content format')
  } else if (createLegacyPostWorks) {
    console.log('\n💡 Recommendation: Use createLegacyPost')
  } else if (postRequestWorks) {
    console.log('\n💡 Recommendation: Use postRequest')
  } else {
    console.log('\n❌ None of the methods worked - check your credentials or blog name')
  }
}

main().catch(console.error)
