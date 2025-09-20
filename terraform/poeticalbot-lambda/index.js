const config = require('./config.js')
const Tumblr = require('tumblrwks')

const util = new (require('./lib/util.js'))({ statusVerbosity: 0 })

const tumblr = new Tumblr(
  {
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
    accessToken: config.accessToken,
    accessSecret: config.accessSecret
  },
  'poeticalbot.tumblr.com'
)

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
        return new Promise((resolve, reject) => {
          tumblr.post('/post',
            { type: 'text', title: poem.title, body: poem.printable },
            function (err, json) {
              if (err) {
                logger(JSON.stringify(err))
                reject(err)
              } else {
                logger('Posted successfully')
                resolve({ statusCode: 200, body: 'Poem posted successfully' })
              }
            })
        })
      } else {
        logger(JSON.stringify(poem))
        logger(poem.text)
        return { statusCode: 200, body: 'Poem generated (test mode)' }
      }
    } else {
      return { statusCode: 200, body: 'No poem generated' }
    }
  } catch (error) {
    logger('Error: ' + error.message)
    return { statusCode: 500, body: 'Error generating poem' }
  }
}