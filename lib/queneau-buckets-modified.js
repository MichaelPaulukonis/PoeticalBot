// modified from https://github.com/coleww/queneau-buckets

module.exports = function (config) {
  // var pick = require('pick-random')
  var pick = (arr) => [config.util.pick(arr)] // original implementation always returned array
  return {
    a: [],
    b: [],
    c: [],
    seed: function (ls) {
      var that = this
      ls.forEach(function (l) {
        // for each line
        var ws = l.split(' ')
        // put the first word in a bucket
        that.a.push(ws.shift())
        // last word in c bucket
        if (ws.length) that.c.push(ws.pop())
        // and everything else in the b bucket.
        if (ws.length) that.b.push(ws.join(' '))
      })
      return this
    },
    fill: function (length) {
      // if user passes 0, umm, undefined!
      if (length) {
        // we start with a random word from the a bucket
        var res = [pick(this.a)]
        // then we pick a random middle thing and split it up
        var mid = pick(this.b)[0].split(' ')
        // as long as we have stuff from the middle thing,
        // and our res is not one less than the target length...
        while (res.length < length - 1 && mid.length) {
          // we push the next word from our middle thing
          res.push(mid.shift())
          // if the middle thing is depleted, we pick a new one.
          // if the buckets are insufficiently filled this might error out. i should fix that sometime
          if (!mid.length) mid = pick(this.b)[0].split(' ')
        }
        // if the user wants length > 2, pop an ending thing from the c bucket on the end
        if (length > 1) res.push(pick(this.c))
        // return the generated string
        return res.join(' ')
      }
    }
  }
}
