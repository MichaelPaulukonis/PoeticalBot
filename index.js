'use strict'

let config = require(`./config.js`)
let Tumblr = require(`tumblrwks`)
let ALWAYS_PRINT = 0

let util = new (require(`./lib/util.js`))({ statusVerbosity: 0 })

let tumblr = new Tumblr(
  {
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
    accessToken: config.accessToken,
    accessSecret: config.accessSecret
  },
  `poeticalbot.tumblr.com`
)

let logger = (msg) => {
  util.debug(msg, ALWAYS_PRINT)
}
util.log = logger

var prepForPublish = (poem) => {
  let lines = poem.text.split(`\n`)
  let leadingspacere = /^ */

  let data = JSON.parse(JSON.stringify(poem))
  delete data.text
  delete data.lines

  let clean = lines.map(line => {
    var matches = line.match(leadingspacere)
    var nbsps = matches[0].replace(/ /g, `&nbsp;`)
    return line.replace(matches[0], nbsps)
  })
  let dataline = `<!-- config: ${JSON.stringify(data)} -->`

  return clean.join(`\n`) + dataline
}

let teller = function () {
  let poetifier = new (require(`./lib/poetifier.js`))({ config: config })
  let poem = poetifier.poem()

  if (poem && poem.title && poem.text) {
    poem.printable = prepForPublish(poem)

    if (config.postLive) {
      tumblr.post(`/post`,
        { type: `text`, title: poem.title, body: poem.printable },
        function (err, json) { // eslint-disable-line no-unused-vars
          if (err) {
            logger(JSON.stringify(err))
            logger(err)
          }
        })
    } else {
      logger(JSON.stringify(poem))
      logger(poem.text)
    }
  }
}

let program = require(`commander`)
program
  .version(`0.0.2`)
  .option(`-l, --log`, `dump to log`)
  .option(`-x, --xform [percent]`, `percent chance of text transform (in hundreths, eg 0.25 = 25%`)
  .option(`-m, --method [jgnoetry, buckets, drone]`, `specify poem generate method`)
  .option(`-t, --templateName [jgnoetry template name]`, `specify jgnoetry template to use`)
  .option(`-c, --corporaFilter [string]`, `filename substring filter (non-case sensitive)`)
  .option(`-s --seed [string]`, `seed for random generator`)
  .option(`-r --reduce`, `force line-reduce`)
  .option(`--reduceType [string]`, `reduce type`)
  .option(`-p, --patternMatch [string]`, `nlp-compromise matchPattern for list elements`)
  .option(`-f --file [string]`, `external source file`)
  .option(`--subStrategy [string]`, `method strategy`)
  .option(`--no-publish`, `do NOT publish (live)`)
  .parse(process.argv)

config.postLive = config.postLive && program.publish

if (program.log) {
  config.log = true
}

if (program.xform) {
  let chance = parseFloat(program.xform, 10)
  if (!isNaN(chance)) {
    config.transformChance = chance
  }
}

if (program.templateName) {
  config.templateName = program.templateName
}

if (program.method) {
  config.method = program.method
}

if (program.corporaFilter) {
  config.corporaFilter = program.corporaFilter
}

if (program.seed) {
  config.seed = program.seed
}

if (program.reduce) {
  config.reduce = true
}

if (program.reduceType) {
  config.reduce = true
  config.reduceType = program.reduceType
}

if (program.file) {
  config.file = program.file
}

if (program.subStrategy) {
  config.subStrategy = program.subStrategy
}

teller()
