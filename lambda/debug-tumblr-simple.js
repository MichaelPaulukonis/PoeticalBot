#!/usr/bin/env node

// Simple Tumblr authentication test
require('dotenv').config({ path: '../.env' })

const config = require('./config.js')

console.log('🔍 Simple Tumblr Auth Test')
console.log('==========================\n')

// Check credentials
console.log('📋 Credentials Check:')
console.log('CONSUMER_KEY:', config.consumerKey ? '✅ Present' : '❌ Missing')
console.log('CONSUMER_SECRET:', config.consumerSecret ? '✅ Present' : '❌ Missing')
console.log('TOKEN:', config.accessToken ? '✅ Present' : '❌ Missing')
console.log('TOKEN_SECRET:', config.accessSecret ? '✅ Present' : '❌ Missing')

if (!config.consumerKey || !config.consumerSecret || !config.accessToken || !config.accessSecret) {
  console.log('\n❌ Missing credentials - check your .env file')
  process.exit(1)
}

// Test with tumblrwks (your current library)
console.log('\n🧪 Testing tumblrwks (current library):')

try {
  const Tumblr = require('tumblrwks')
  
  const tumblr = new Tumblr(
    {
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      accessToken: config.accessToken,
      accessSecret: config.accessSecret
    },
    'poeticalbot.tumblr.com'
  )

  console.log('✅ tumblrwks client created')
  
  // Test user info endpoint
  tumblr.get('/user/info', {}, (err, json) => {
    if (err) {
      console.error('❌ tumblrwks authentication failed:')
      console.error('Status:', err.status || 'unknown')
      console.error('Message:', err.message || 'unknown')
      console.error('Full error:', JSON.stringify(err, null, 2))
    } else {
      console.log('✅ tumblrwks authentication successful!')
      if (json && json.response && json.response.user) {
        console.log('User:', json.response.user.name)
        console.log('Blogs:', json.response.user.blogs.length)
      }
    }
  })

} catch (error) {
  console.error('❌ Failed to test tumblrwks:', error.message)
}

// Test with official tumblr.js using callback pattern
console.log('\n🧪 Testing tumblr.js (official library):')

try {
  const tumblr = require('tumblr.js')

  const client = tumblr.createClient({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    token: config.accessToken,
    token_secret: config.accessSecret
  })

  console.log('✅ tumblr.js client created')

  // Try callback pattern (older versions)
  try {
    client.userInfo((err, data) => {
      if (err) {
        console.error('❌ tumblr.js callback authentication failed:')
        console.error('Error:', err.message || err)
      } else {
        console.log('✅ tumblr.js callback authentication successful!')
        if (data && data.user && data.user.blogs) {
          console.log('User blogs:')
          data.user.blogs.forEach(blog => {
            console.log(`  - ${blog.name}`)
          })
        }
      }
    })
  } catch (callbackError) {
    console.log('⚠️  Callback pattern not supported, trying promise pattern...')
    
    // Try promise pattern (newer versions)
    const userInfoCall = client.userInfo()
    if (userInfoCall && typeof userInfoCall.then === 'function') {
      userInfoCall
        .then(data => {
          console.log('✅ tumblr.js promise authentication successful!')
          if (data && data.user && data.user.blogs) {
            console.log('User blogs:')
            data.user.blogs.forEach(blog => {
              console.log(`  - ${blog.name}`)
            })
          }
        })
        .catch(promiseError => {
          console.error('❌ tumblr.js promise authentication failed:')
          console.error('Error:', promiseError.message)
        })
    } else {
      console.error('❌ Neither callback nor promise pattern worked')
    }
  }

} catch (error) {
  console.error('❌ Failed to test tumblr.js:', error.message)
}

console.log('\n💡 Next Steps:')
console.log('1. If tumblrwks works, your current setup is fine')
console.log('2. If tumblr.js works but tumblrwks fails, consider switching libraries')
console.log('3. If both fail, check your tokens at: https://api.tumblr.com/console')
console.log('4. Verify your blog name is exactly: poeticalbot.tumblr.com')