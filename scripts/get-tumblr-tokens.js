#!/usr/bin/env node

/**
 * Helper script to get Tumblr OAuth tokens
 * Run this once to get your access tokens
 */

const readline = require('readline')

console.log('🔑 Tumblr OAuth Token Generator')
console.log('===============================\n')

console.log('You need to get your OAuth tokens from Tumblr. Here are your options:\n')

console.log('📋 OPTION 1: Use Tumblr API Console (Recommended)')
console.log('1. Go to: https://api.tumblr.com/console')
console.log('2. Click "Explore API"')
console.log('3. Sign in with your Tumblr account')
console.log('4. Look at any API request - you\'ll see oauth_token and oauth_token_secret in the headers')
console.log('5. Copy those values\n')

console.log('📋 OPTION 2: Manual OAuth Flow')
console.log('1. Go to: https://www.tumblr.com/oauth/apps')
console.log('2. Find your app and click "Explore API"')
console.log('3. This will generate tokens for your account\n')

console.log('📋 OPTION 3: Use tumblrwks library (Advanced)')
console.log('The tumblrwks library you\'re using can help with OAuth, but it\'s more complex.\n')

console.log('🔧 Once you have the tokens, add them to your .env file:')
console.log('CONSUMER_KEY=your_consumer_key')
console.log('CONSUMER_SECRET=your_consumer_secret')
console.log('TOKEN=your_oauth_token')
console.log('TOKEN_SECRET=your_oauth_token_secret')
console.log('POST_LIVE=false  # Set to true when ready to post live')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('\nPress Enter to open the Tumblr API Console in your browser...', () => {
  const { exec } = require('child_process')
  exec('open https://api.tumblr.com/console', (error) => {
    if (error) {
      console.log('\nManually go to: https://api.tumblr.com/console')
    }
  })
  rl.close()
})