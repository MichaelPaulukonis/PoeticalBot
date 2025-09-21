#!/usr/bin/env node

// Tumblr authentication diagnostic script
require('dotenv').config({ path: '../.env' })

const config = require('./config.js')

console.log('🔍 Tumblr Authentication Diagnostics')
console.log('====================================\n')

// Check environment variables
console.log('📋 Environment Variables:')
console.log('CONSUMER_KEY:', process.env.CONSUMER_KEY ? `${process.env.CONSUMER_KEY.substring(0, 8)}...` : 'MISSING')
console.log('CONSUMER_SECRET:', process.env.CONSUMER_SECRET ? `${process.env.CONSUMER_SECRET.substring(0, 8)}...` : 'MISSING')
console.log('TOKEN:', process.env.TOKEN ? `${process.env.TOKEN.substring(0, 8)}...` : 'MISSING')
console.log('TOKEN_SECRET:', process.env.TOKEN_SECRET ? `${process.env.TOKEN_SECRET.substring(0, 8)}...` : 'MISSING')
console.log('POST_LIVE:', process.env.POST_LIVE)

console.log('\n📋 Parsed Config:')
console.log('consumerKey:', config.consumerKey ? `${config.consumerKey.substring(0, 8)}...` : 'MISSING')
console.log('consumerSecret:', config.consumerSecret ? `${config.consumerSecret.substring(0, 8)}...` : 'MISSING')
console.log('accessToken:', config.accessToken ? `${config.accessToken.substring(0, 8)}...` : 'MISSING')
console.log('accessSecret:', config.accessSecret ? `${config.accessSecret.substring(0, 8)}...` : 'MISSING')
console.log('postLive:', config.postLive)

// Test with official tumblr.js library
console.log('\n🧪 Testing with Official tumblr.js Library:')

try {
  const tumblr = require('tumblr.js')

  const client = tumblr.createClient({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    token: config.accessToken,
    token_secret: config.accessSecret
  })

  console.log('✅ tumblr.js client created successfully')

  // Test basic API call
  console.log('\n🔍 Testing basic API call (userInfo)...')

  client.userInfo()
    .then(data => {
      console.log('✅ Authentication successful!')
      console.log('User blogs:')
      data.user.blogs.forEach(blog => {
        console.log(`  - ${blog.name} (${blog.url})`)
      })
    })
    .catch(error => {
      console.error('❌ Authentication failed with tumblr.js:')
      console.error('Error:', error.message)
      if (error.response) {
        console.error('Response:', error.response.data)
      }
    })
} catch (error) {
  console.error('❌ Failed to create tumblr.js client:', error.message, error.stack)
}

// Test with tumblrwks (your current library)
console.log('\n🧪 Testing with tumblrwks Library:')

try {
  const Tumblr = require('tumblrwks')

  const tumblrwks = new Tumblr(
    {
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      accessToken: config.accessToken,
      accessSecret: config.accessSecret
    },
    'poeticalbot.tumblr.com'
  )

  console.log('✅ tumblrwks client created successfully')

  // Test basic API call
  console.log('\n🔍 Testing basic API call with tumblrwks...')

  tumblrwks.get('/user/info', {}, (err, json) => {
    if (err) {
      console.error('❌ Authentication failed with tumblrwks:')
      console.error('Error:', JSON.stringify(err, null, 2))
    } else {
      console.log('✅ Authentication successful with tumblrwks!')
      console.log('User info:', JSON.stringify(json, null, 2))
    }
  })

} catch (error) {
  console.error('❌ Failed to create tumblrwks client:', error.message)
}

console.log('\n💡 Troubleshooting Tips:')
console.log('1. Verify your app is registered at: https://www.tumblr.com/oauth/apps')
console.log('2. Get fresh tokens from: https://api.tumblr.com/console')
console.log('3. Make sure your blog name matches exactly (poeticalbot.tumblr.com)')
console.log('4. Check that your app has the right permissions')
console.log('5. Try using the official tumblr.js library instead of tumblrwks')
