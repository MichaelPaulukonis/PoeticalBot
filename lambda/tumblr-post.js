#!/usr/bin/env node

const tumblr = require('tumblr.js')
require('dotenv').config({ path: '../.env' })

const config = require('./config.js')

const client = tumblr.createClient({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  token: config.accessToken,
  token_secret: config.accessSecret
})

// Make the request (wrapped in async function)
// THIS WORKED !!!!!
// aaaaand, today is does not ugh
// and now it does, again. Installed tumblr.js@5.x library
async function createPost () {
  try {
    const response = await client.createPost('poeticalbot.tumblr.com', {
      'content': [
        {
          'type': 'text',
          'text': 'Hello world!'
        }
      ]
    })
    console.log('post response:', JSON.stringify(response, null, 2))
  } catch (error) {
    console.error('Error:', error.message, error.stack);
  }
}

createPost();
