#!/usr/bin/env node

// Tumblr auth test with proper async handling
require('dotenv').config({ path: '../.env' })

const config = require('./config.js')

console.log('🔍 Tumblr Auth Test (with proper waiting)')
console.log('==========================================\n')

async function testTumblrJS () {
  return new Promise((resolve) => {
    console.log('🧪 Testing tumblr.js (official library):')

    try {
      const tumblr = require('tumblr.js')

      const client = tumblr.createClient({
        consumer_key: config.consumerKey,
        consumer_secret: config.consumerSecret,
        token: config.accessToken,
        token_secret: config.accessSecret
      })

      console.log('✅ tumblr.js client created')

      // Set a timeout in case callback never fires
      const timeout = setTimeout(() => {
        console.log('⏰ tumblr.js callback timed out after 10 seconds')
        resolve(false)
      }, 10000)

      // Try callback pattern
      try {
        client.userInfo((err, data) => {
          clearTimeout(timeout)

          if (err) {
            console.error('❌ tumblr.js authentication failed:')
            console.error('Error:', err.message || err)
            if (err.response && err.response.data) {
              console.error('Response:', JSON.stringify(err.response.data, null, 2))
            }
            resolve(false)
          } else {
            console.log('✅ tumblr.js authentication successful!')
            if (data && data.user && data.user.blogs) {
              console.log('User blogs:')
              data.user.blogs.forEach(blog => {
                console.log(`  - ${blog.name} (${blog.url})`)
              })
              resolve(true)
            } else {
              console.log('⚠️  Unexpected data structure:', JSON.stringify(data, null, 2))
              resolve(false)
            }
          }
        })
      } catch (callbackError) {
        clearTimeout(timeout)
        console.error('❌ Callback pattern failed:', callbackError.message)
        resolve(false)
      }
    } catch (error) {
      console.error('❌ Failed to create tumblr.js client:', error.message)
      resolve(false)
    }
  })
}

async function testTumblrWKS () {
  return new Promise((resolve) => {
    console.log('🧪 Testing tumblrwks (current library):')

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

      // Set a timeout
      const timeout = setTimeout(() => {
        console.log('⏰ tumblrwks callback timed out after 10 seconds')
        resolve(false)
      }, 10000)

      // Test user info endpoint
      tumblr.get('/user/info', {}, (err, json) => {
        clearTimeout(timeout)

        if (err) {
          console.error('❌ tumblrwks authentication failed:')
          console.error('Status:', err.status || 'unknown')
          console.error('Message:', err.message || 'unknown')

          // Parse the error if it's a JSON string
          try {
            const errorData = typeof err.message === 'string' ? JSON.parse(err.message) : err
            if (errorData.meta) {
              console.error('Tumblr API Error:', errorData.meta.status, errorData.meta.msg)
              if (errorData.errors && errorData.errors.length > 0) {
                console.error('Details:', errorData.errors[0].detail)
              }
            }
          } catch (parseError) {
            console.error('Raw error:', err)
          }

          resolve(false)
        } else {
          console.log('✅ tumblrwks authentication successful!')
          if (json && json.response && json.response.user) {
            console.log('User:', json.response.user.name)
            console.log('Blogs:', json.response.user.blogs.length)
            json.response.user.blogs.forEach(blog => {
              console.log(`  - ${blog.name} (${blog.url})`)
            })
            resolve(true)
          } else {
            console.log('⚠️  Unexpected response structure:', JSON.stringify(json, null, 2))
            resolve(false)
          }
        }
      })
    } catch (error) {
      console.error('❌ Failed to create tumblrwks client:', error.message)
      resolve(false)
    }
  })
}

async function main () {
  console.log('📋 Credentials Check:')
  console.log('CONSUMER_KEY:', config.consumerKey ? '✅ Present' : '❌ Missing')
  console.log('CONSUMER_SECRET:', config.consumerSecret ? '✅ Present' : '❌ Missing')
  console.log('TOKEN:', config.accessToken ? '✅ Present' : '❌ Missing')
  console.log('TOKEN_SECRET:', config.accessSecret ? '✅ Present' : '❌ Missing')
  console.log()

  if (!config.consumerKey || !config.consumerSecret || !config.accessToken || !config.accessSecret) {
    console.log('❌ Missing credentials - check your .env file')
    return
  }

  // Test both libraries
  const tumblrJSWorks = await testTumblrJS()
  console.log()
  const tumblrWKSWorks = await testTumblrWKS()

  console.log('\n📊 Results Summary:')
  console.log('tumblr.js (official):', tumblrJSWorks ? '✅ Working' : '❌ Failed')
  console.log('tumblrwks (current):', tumblrWKSWorks ? '✅ Working' : '❌ Failed')

  console.log('\n💡 Recommendations:')
  if (tumblrJSWorks && !tumblrWKSWorks) {
    console.log('✅ Switch to tumblr.js - it works with your credentials!')
  } else if (tumblrWKSWorks) {
    console.log('✅ tumblrwks is working - your current setup is fine')
  } else {
    console.log('❌ Both libraries failed - check your tokens:')
    console.log('   1. Go to https://api.tumblr.com/console')
    console.log('   2. Sign in with the account that owns poeticalbot.tumblr.com')
    console.log('   3. Get fresh oauth_token and oauth_token_secret')
    console.log('   4. Make sure your app callback URL is set (can be http://localhost)')
  }
}

main().catch(console.error)
