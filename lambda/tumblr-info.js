#!/usr/bin/env node

const tumblr = require('tumblr.js');

require('dotenv').config({ path: '../.env' })
const config = require('./config.js')

const client = tumblr.createClient({
  consumer_key: config.consumerKey
})

// Make the request (wrapped in async function)
async function getBlogInfo () {
  try {
    const response = await client.blogInfo('poeticalbot.tumblr.com')
    console.log('Blog info:', JSON.stringify(response, null, 2))
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getBlogInfo();
