#!/usr/bin/env node

// Standalone debug script for poetifier
require('dotenv').config({ path: '../.env' })

const config = require('./config.js')
const Poetifier = require('./lib/poetifier.js')

console.log('🔍 Debugging Poetifier...')
console.log('Environment variables loaded from ../.env')
console.log('POST_LIVE:', process.env.POST_LIVE)
console.log('AWS_LAMBDA_FUNCTION_NAME:', process.env.AWS_LAMBDA_FUNCTION_NAME)

// Set debug config
config.method = 'queneau-buckets'
config.subStrategy = 'diamond'
config.corporaFilter = 'eliot'
config.transform = false
config.postLive = false
config.log = true // Enable logging

console.log('\n📝 Config:', JSON.stringify(config, null, 2))

try {
  console.log('\n🏗️  Creating Poetifier instance...')
  const poetifier = new Poetifier({ config: config })
  
  console.log('\n🎭 Generating poem...')
  const poem = poetifier.poem({})
  
  console.log('\n✅ Success! Generated poem:')
  console.log('Title:', poem.title)
  console.log('Source:', poem.source)
  console.log('Seed:', poem.seed)
  console.log('Lines count:', poem.lines ? poem.lines.length : 'undefined')
  console.log('\nText:')
  console.log(poem.text)
  
} catch (error) {
  console.error('\n❌ Error generating poem:')
  console.error('Message:', error.message)
  console.error('Stack:', error.stack)
}