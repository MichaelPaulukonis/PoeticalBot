#!/usr/bin/env node

// Test post creation with proper promise handling
require('dotenv').config({ path: '../.env' })

const config = require('./config.js')
const tumblr = require('tumblr.js')

console.log('🧪 Testing Post Creation with Proper Promises')
console.log('==============================================\n')

const client = tumblr.createClient({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  token: config.accessToken,
  token_secret: config.accessSecret
})

async function testUserInfo() {
  console.log('🔍 Testing userInfo (known working method)...')

  try {
    const data = await client.userInfo()
    console.log('✅ userInfo works with promises!')
    console.log('User blogs:')
    data.user.blogs.forEach(blog => {
      console.log(`  - ${blog.name} (${blog.url})`)
    })
    return true
  } catch (error) {
    console.error('❌ userInfo failed:', error.message)
    return false
  }
}

async function testCreatePostMinimal() {
  console.log('\n🔍 Testing createPost with minimal content...')

  try {
    const result = await client.createPost('poeticalbot', {
      content: [
        {
          type: 'text',
          text: 'Test post - please ignore'
        }
      ]
    })

    console.log('✅ createPost minimal worked!')
    console.log('Post ID:', result.id)
    return true
  } catch (error) {
    console.error('❌ createPost minimal failed:', error.message)
    console.error('Full error:', error)
    return false
  }
}

async function testCreatePostWithLayout() {
  console.log('\n🔍 Testing createPost with layout...')

  try {
    const result = await client.createPost('poeticalbot', {
      content: [
        {
          type: 'text',
          text: 'Test post with layout - please ignore'
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
      ]
    })

    console.log('✅ createPost with layout worked!')
    console.log('Post ID:', result.id)
    return true
  } catch (error) {
    console.error('❌ createPost with layout failed:', error.message)
    return false
  }
}

async function testBlogInfo() {
  console.log('\n🔍 Testing blogInfo to verify blog access...')

  try {
    const result = await client.blogInfo('poeticalbot')
    console.log('✅ blogInfo worked!')
    console.log('Blog title:', result.blog.title)
    console.log('Blog description:', result.blog.description)
    return true
  } catch (error) {
    console.error('❌ blogInfo failed:', error.message)
    return false
  }
}

async function main() {
  if (config.postLive) {
    console.log('❌ POST_LIVE is true - aborting to avoid spam posts')
    return
  }

  console.log('✅ POST_LIVE is false - safe to test\n')

  // Test in order of complexity
  const userInfoWorks = await testUserInfo()
  const blogInfoWorks = await testBlogInfo()
  const minimalPostWorks = await testCreatePostMinimal()
  const layoutPostWorks = await testCreatePostWithLayout()

  console.log('\n📊 Results Summary:')
  console.log('userInfo:', userInfoWorks ? '✅ Works' : '❌ Failed')
  console.log('blogInfo:', blogInfoWorks ? '✅ Works' : '❌ Failed')
  console.log('createPost (minimal):', minimalPostWorks ? '✅ Works' : '❌ Failed')
  console.log('createPost (with layout):', layoutPostWorks ? '✅ Works' : '❌ Failed')

  if (minimalPostWorks || layoutPostWorks) {
    console.log('\n💡 createPost works! Use this method in your Lambda function.')
  } else if (blogInfoWorks) {
    console.log('\n⚠️  Blog access works but posting fails - check permissions')
  } else {
    console.log('\n❌ Basic blog access failed - check blog name or permissions')
  }
}

main().catch(error => {
  console.error('\n💥 Unhandled error:', error.message)
  console.error('Stack:', error.stack)
})
