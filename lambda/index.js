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

const { convertPoemToNPF, validateNPF } = require('./lib/npf-formatter')

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

const prepForNPF = (poem) => {
  const npfPost = convertPoemToNPF(poem)

  if (!validateNPF(npfPost)) {
    throw new Error('Invalid NPF structure generated')
  }

  return npfPost
}

exports.handler = async (event, context) => {
  try {
    const poetifier = new (require('./lib/poetifier.js'))({ config: config })
    const poem = poetifier.poem()

    if (poem && poem.title && poem.text) {
      if (config.postLive) {
        try {
          // Use NPF format for posting
          const npfPost = prepForNPF(poem)

          const response = await client.createPost('poeticalbot.tumblr.com', npfPost)

          logger('Posted successfully with NPF format')
          logger('Post ID: ' + response.id)
          logger('Poem metadata: ' + JSON.stringify({
            seed: poem.seed,
            source: poem.source,
            template: poem.template,
            method: poem.method
          }))

          return { statusCode: 200, body: 'Poem posted successfully' }
        } catch (err) {
          logger('NPF post failed: ' + err.message)

          // Fallback to HTML format if NPF fails
          try {
            poem.printable = prepForPublish(poem)
            const response = await client.createPost('poeticalbot.tumblr.com', {
              content: [
                {
                  type: 'text',
                  text: `${poem.title}\n\n${poem.printable}`
                }
              ]
            })

            logger('Posted successfully with HTML fallback')
            logger('Post ID: ' + response.id)
            return { statusCode: 200, body: 'Poem posted successfully (HTML fallback)' }
          } catch (fallbackErr) {
            logger('Both NPF and HTML posting failed: ' + fallbackErr.message)
            return { statusCode: 500, body: 'Failed to post poem' }
          }
        }
      } else {
        // Test mode - show both formats
        const npfPost = prepForNPF(poem)
        logger('NPF format: ' + JSON.stringify(npfPost, null, 2))
        logger('Original poem: ' + JSON.stringify(poem, null, 2))
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
