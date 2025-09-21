const config = require('./config.js')
const tumblr = require('tumblr.js')

const util = new (require('./lib/util.js'))({ statusVerbosity: 0 })

const client = tumblr.createClient({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  token: config.accessToken,
  token_secret: config.accessSecret
})

const logger = (msg) => {
  console.log(msg) // Use console.log for CloudWatch
}
util.log = logger

const prepForPublish = (poem) => {
  const lines = poem.text.split('\n')
  const leadingspacere = /^ */

  const data = JSON.parse(JSON.stringify(poem))
  delete data.text
  delete data.lines

  const clean = lines.map(line => {
    const matches = line.match(leadingspacere)
    const nbsps = matches[0].replace(/ /g, '&nbsp;')
    return line.replace(matches[0], nbsps)
  })
  const dataline = `<!-- config: ${JSON.stringify(data)} -->`

  return clean.join('<br />') + dataline
}

exports.handler = async (event, context) => {
  try {
    const poetifier = new (require('./lib/poetifier.js'))({ config: config })
    const poem = poetifier.poem()

    if (poem && poem.title && poem.text) {
      poem.printable = prepForPublish(poem)

      if (config.postLive) {
        try {
          const response = await client.createPost('poeticalbot.tumblr.com', {
            content: [
              {
                type: 'text',
                text: poem.printable
              }
            ],
            // Add title if available
            ...(poem.title && {
              content: [
                {
                  type: 'text',
                  text: `<h1>${poem.title}</h1>\n${poem.printable}`
                }
              ]
            })
          })

          logger('Posted successfully')
          logger('Post ID: ' + response.id)
          return { statusCode: 200, body: 'Poem posted successfully' }
        } catch (err) {
          logger('Post failed: ' + err.message)
          return { statusCode: 500, body: 'Failed to post poem' }
        }
      } else {
        logger(JSON.stringify(poem))
        logger(poem.text)
        return { statusCode: 200, body: 'Poem generated (no-post mode)' }
      }
    } else {
      return { statusCode: 200, body: 'No poem generated' }
    }
  } catch (error) {
    logger('Error: ' + error.message)
    return { statusCode: 500, body: 'Error generating poem' }
  }
}
