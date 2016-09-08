// modified from https://github.com/coleww/queneau-buckets

module.exports = function (config) {
  // throw error if not provided with config
  // OR use a default implementation... ???
  if (config === undefined || config.util === undefined || config.util.pick === undefined) {
    throw Error('util.pick must be supplied as part of config');
  }

  var pick = (arr) => [config.util.pick(arr)];// original implementation always returned array
  return {
    firsts: [],
    middles: [],
    lasts: [],

    seed: function (lines) {
      var that = this;
      lines.forEach(function (line) {
        var words = line.split(' ');
        // first word
        that.firsts.push(words.shift());
        // last word
        if (words.length) that.lasts.push(words.pop());
        // everything else
        if (words.length) that.middles.push(words.join(' '));
      });
      // this is an elaboration not found in the original (which would error on 1,2 word sentences)
      if (that.middles.length == 0) {
        that.middles = that.firsts;
      }
      if (that.lasts.length == 0) {
        that.lasts = that.middles;
      }
      return this;
    },
    fill: function (length) {
        if (!length) return '';
        // we start with a random first word
        var res = [pick(this.firsts)];
        // then we pick a random middle thing and split it up
        var mid = pick(this.middles)[0].split(' ');
        // as long as we have stuff from the middle thing,
        // and our res is not one less than the target length...
        while (res.length < length - 1 && mid.length) {
          // we push the next word from our middle thing
          res.push(mid.shift());
          // if the middle thing is depleted, we pick a new one.
          // if the buckets are insufficiently filled this might error out. i should fix that sometime
          if (!mid.length) mid = pick(this.middles)[0].split(' ');
        }
        // if the user wants length > 2, pop an ending thing from the c bucket on the end
        if (length > 1) res.push(pick(this.lasts));
        // return the generated string
        return res.join(' ');
    }
  };
};
