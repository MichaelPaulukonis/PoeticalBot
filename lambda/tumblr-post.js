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

// NPF Migration Tests - Phase 1
// Testing different NPF structures for PoeticalBot

// Sample data based on current HTML output
const samplePoem = {
  title: 'LOVE GO COME STILL HONEST OLD STOPPED BOOKS HAWAII BATTERY',
  text: `. Still 'Honest Old stopped the books so in hawaii
being in love. My battery to
keep my colors are more than to go by
its part only lunch. Enough we take the
slave, go? It cannot come up this nation
is not Ohio. Got it would like the car.
No man Did patriotic instinct so they
can come soon, i cant race of vikes on
how about money. I am glad you trade
it my dad's is the score I just the outcome
triumph.`,
  metadata: {
    seed: 'sw85h80.seae',
    source: 'quotations/the.lincoln.year.book spam/sms.00'
  }
}

// Test 1: Simple single text block (current approach)
async function testSimpleText() {
  console.log('\n🧪 Test 1: Simple single text block')
  try {
    const response = await client.createPost('poeticalbot.tumblr.com', {
      content: [
        {
          type: 'text',
          text: `${samplePoem.title}\n\n${samplePoem.text}`
        }
      ]
    })
    console.log('✅ Posted successfully - ID:', response.id)
    return response.id
  } catch (error) {
    console.error('❌ Error:', error.message)
    return null
  }
}

// Test 2: Title as separate block
async function testTitleAndContent() {
  console.log('\n🧪 Test 2: Title as separate block')
  try {
    const response = await client.createPost('poeticalbot.tumblr.com', {
      content: [
        {
          type: 'text',
          text: samplePoem.title,
          formatting: [
            {
              start: 0,
              end: samplePoem.title.length,
              type: 'bold'
            }
          ]
        },
        {
          type: 'text',
          text: samplePoem.text
        }
      ]
    })
    console.log('✅ Posted successfully - ID:', response.id)
    return response.id
  } catch (error) {
    console.error('❌ Error:', error.message)
    return null
  }
}

// Test 3: Multi-paragraph poem (split by double newlines)
async function testMultiParagraph() {
  console.log('\n🧪 Test 3: Multi-paragraph poem')
  try {
    const paragraphs = samplePoem.text.split('\n\n')
    const content = [
      {
        type: 'text',
        text: samplePoem.title,
        formatting: [
          {
            start: 0,
            end: samplePoem.title.length,
            type: 'bold'
          }
        ]
      }
    ]

    // Add each paragraph as separate block
    paragraphs.forEach(paragraph => {
      if (paragraph.trim()) {
        content.push({
          type: 'text',
          text: paragraph.trim()
        })
      }
    })

    const response = await client.createPost('poeticalbot.tumblr.com', {
      content: content
    })
    console.log('✅ Posted successfully - ID:', response.id)
    return response.id
  } catch (error) {
    console.error('❌ Error:', error.message)
    return null
  }
}

// Test 4: Preserve poem formatting with metadata
async function testFormattedPoem() {
  console.log('\n🧪 Test 4: Formatted poem with metadata')
  try {
    const metaContent = `Generated with seed: ${samplePoem.metadata.seed}\nSource: ${samplePoem.metadata.source}`
    const response = await client.createPost('poeticalbot.tumblr.com', {
      content: [
        {
          type: 'text',
          subtype: 'heading2',
          text: samplePoem.title,
          formatting: [
            {
              start: 0,
              end: samplePoem.title.length,
              type: 'bold'
            }
          ]
        },
        {
          type: 'text',
          text: samplePoem.text
        },
        {
          type: 'text',
          text: metaContent,
          formatting: [
            {
              start: 0,
              end: metaContent.length,
              type: 'italic'
            }
          ]
        }
      ],
      tags: ['poetry', 'generated', 'poeticalbot']
    })
    console.log('✅ Posted successfully - ID:', response.id)
    return response.id
  } catch (error) {
    console.error('❌ Error:', error.message)
    return null
  }
}

// Test runner
async function runAllTests() {
  console.log('🚀 Starting NPF Migration Tests')
  console.log('⚠️  WARNING: This will create test posts on poeticalbot.tumblr.com')

  const results = {
    // simpleText: await testSimpleText(),
    // titleAndContent: await testTitleAndContent(),
    // multiParagraph: await testMultiParagraph(),
    formattedPoem: await testFormattedPoem()
  }

  console.log('\n📊 Test Results Summary:')
  Object.entries(results).forEach(([test, id]) => {
    console.log(`${test}: ${id ? '✅ Success (ID: ' + id + ')' : '❌ Failed'}`)
  })

  console.log('\n💡 Next steps:')
  console.log('1. Check poeticalbot.tumblr.com to see visual results')
  console.log('2. Compare formatting with existing HTML posts')
  console.log('3. Document which approach works best')
  console.log('4. Delete test posts if needed')

  return results
}

// Run tests
runAllTests().catch(console.error);
