var config = (function () {
  require(`dotenv`).config({ silent: true }) // read .env file IF IT EXISTS - which only s/b DEV

  return {
    consumerKey: process.env.consumer_key,
    consumerSecret: process.env.consumer_secret,
    accessToken: process.env.token,
    accessSecret: process.env.token_secret,

    postLive: (process.env.post_live.toLowerCase() === `true`)
  }
}())

module.exports = config
