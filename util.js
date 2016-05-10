'option strict';

var util = function(options) {

  if(!(this instanceof util)) {
    return new util(options);
  }

  options = options || { statusVerbosity: 0 };

  // TODO: think this through, logging is a mess
  // this is a result of using inherited logging levels
  var debugOutput = function(output, verbosity, priority) {
    if (verbosity >= priority ) {
      console.log(output); // eslint-disable-line no-console
    }
  };

  this.debugOutput = debugOutput;

  // capture statusVerbosity, and never [for scoped-functions] refer to it again
  this.debug = function(msg, level) {
    debugOutput(msg, options.statusVerbosity, level);
  };


  this.randomProperty = function(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
      if (prop != 'id') {
        if (Math.random() < 1/++count)
          result = obj[prop];
      }
    return result;
  };

  this.pick = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  this.random = function(max){
    return getRandomInRange(0,max);
  };

  var getRandomInRange = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  this.getRandomInRange = getRandomInRange;

  this.coinflip = function(chance) {
    if (!chance) { chance = 0.5; }
    return (Math.random() < chance);
  };

  this.pickRemove = function(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr.splice(index,1)[0];
  };

  // http://stackoverflow.com/a/6274381/41153
  this.shuffle = function (a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  };

};

module.exports = util;
