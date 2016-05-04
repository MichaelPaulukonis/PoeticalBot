var util = function(options) {

  options = options || { statusVerbosity: 0 };

  // capture statusVerbosity, and never [for scoped-functions] refer to it again
  var debug = function(msg, level) {
    debugOutput(msg, options.statusVerbosity, level);
  };

  var debugOutput = function(output, statusVerbosity, thisVerbosity) {
    if (statusVerbosity >= thisVerbosity ) {
      console.log(output);
    }
  };

  var randomProperty = function(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
      if (prop != 'id') {
        if (Math.random() < 1/++count)
          result = obj[prop];
      }
    return result;
  };

  var pick = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  var random = function(max){
    return getRandomInRange(0,max);
  };

  var getRandomInRange = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var coinflip = function(chance) {
    if (!chance) { chance = 0.5; }
    return (Math.random() < chance);
  };

  var pickRemove = function(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr.splice(index,1)[0];
  };


  // http://stackoverflow.com/a/6274381/41153
  var shuffle = function (a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  };

  return {
    debug: debug,
    randomProperty: randomProperty,
    pick: pick,
    random: random,
    getRandomInRange: getRandomInRange,
    coinflip: coinflip,
    pickRemove: pickRemove,
    shuffle: shuffle
  };


};

module.exports = util();
