#!/usr/bin/env node

// Debug Tumblr token issues
require('dotenv').config({ path: '../.env' })

const config = require('./config.js')

console.log('🔍 Tumblr Token Debugging')
console.log('=========================\n')

console.log('📋 Current Token Values:')
console.log('CONSUMER_KEY length:', config.consumerKey ? config.consumerKey.length : 'undefined')
console.log('CONSUMER_SECRET length:', config.consumerSecret ? config.consumerSecret.length : 'undefined')
console.log('TOKEN length:', config.accessToken ? config.accessToken.length : 'undefined')
console.log('TOKEN_SECRET length:', config.accessSecret ? config.accessSecret.length : 'undefined')

console.log('\n🔍 Token Format Check:')
console.log('CONSUMER_KEY starts with:', config.consumerKey ? config.consumerKey.substring(0, 10) + '...' : 'undefined')
console.log('TOKEN starts with:', config.accessToken ? config.accessToken.substring(0, 10) + '...' : 'undefined')

// Check for common issues
const issues = []

if (!config.consumerKey || config.consumerKey.length < 10) {
  issues.push('❌ CONSUMER_KEY is missing or too short')
}

if (!config.consumerSecret || config.consumerSecret.length < 10) {
  issues.push('❌ CONSUMER_SECRET is missing or too short')
}

if (!config.accessToken || config.accessToken.length < 10) {
  issues.push('❌ TOKEN is missing or too short')
}

if (!config.accessSecret || config.accessSecret.length < 10) {
  issues.push('❌ TOKEN_SECRET is missing or too short')
}

// Check for whitespace issues
if (config.consumerKey && (config.consumerKey.startsWith(' ') || config.consumerKey.endsWith(' '))) {
  issues.push('⚠️  CONSUMER_KEY has leading/trailing whitespace')
}

if (config.accessToken && (config.accessToken.startsWith(' ') || config.accessToken.endsWith(' '))) {
  issues.push('⚠️  TOKEN has leading/trailing whitespace')
}

console.log('\n🚨 Issues Found:')
if (issues.length === 0) {
  console.log('✅ No obvious token format issues detected')
} else {
  issues.forEach(issue => console.log(issue))
}

console.log('\n💡 Token Refresh Instructions:')
console.log('1. Go to: https://api.tumblr.com/console')
console.log('2. Sign in with the account that owns poeticalbot.tumblr.com')
console.log('3. Click any API endpoint (like "Get Blog Info")')
console.log('4. Look for these values in the request:')
console.log('   - oauth_token → This is your TOKEN')
console.log('   - oauth_token_secret → This is your TOKEN_SECRET')
console.log('5. Copy them EXACTLY (no extra spaces)')
console.log('6. Update your .env file')

console.log('\n🧪 Testing with tumblrwks:')

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

  console.log('✅ tumblrwks client created successfully')

  // Test with a simple GET request
  tumblr.get('/user/info', {}, (err, json) => {
    if (err) {
      console.error('\n❌ Authentication test failed:')

      // Try to parse the error
      let errorMsg = err.message || err
      try {
        const errorData = typeof errorMsg === 'string' ? JSON.parse(errorMsg) : errorMsg
        if (errorData.meta) {
          console.error('Tumblr API Response:', errorData.meta.status, errorData.meta.msg)
          if (errorData.errors && errorData.errors.length > 0) {
            console.error('Error Details:', errorData.errors[0].detail)
            console.error('Error Code:', errorData.errors[0].code)
          }
        }
      } catch (parseError) {
        console.error('Raw error:', errorMsg)
      }

      console.log('\n🔧 Troubleshooting Steps:')
      console.log('1. Get fresh tokens from the API Console')
      console.log('2. Make sure you\'re signed in as the owner of poeticalbot.tumblr.com')
      console.log('3. Check that your app has proper permissions')
      console.log('4. Verify the blog name is exactly "poeticalbot.tumblr.com"')

    } else {
      console.log('\n✅ Authentication successful!')
      if (json && json.response && json.response.user) {
        console.log('User:', json.response.user.name)
        console.log('Blogs:', json.response.user.blogs.length)
        json.response.user.blogs.forEach(blog => {
          console.log(`  - ${blog.name} (${blog.url})`)
        })
      }
    }
  })

} catch (error) {
  console.error('❌ Failed to create tumblrwks client:', error.message)
}