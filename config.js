// Put your own Twitter App keys here. See README.md for more detail.
// if you see 'process.env.SOMETHING' that means it's a heroku environment variable
// heroku plugins:install https://github.com/ddollar/heroku-config.git
// and will only work with 'foreman start worker'
module.exports = {

    consumerKey:    process.env.consumer_key,
    consumerSecret: process.env.consumer_secret,
    accessToken:    process.env.token,
    accessSecret:   process.env.token_secret,

    postLive:       (process.env.POST_LIVE.toLowerCase() === 'true')

};
