var poetifier = function() {

  var jGnoetry = require('./jgnoetry.headless.js'),
      corpora = require('./defaultTexts.js'),
      options = {
        'handlePunctuation': 'noParen',
        'byNewlineOrPunctuation': 'punctuation',
        'capitalize': {
          'method': 'capitalizeCustom',
          'customSentence':true,
          'customLine':true,
          'customI':true
        },
        'appendToPoem': 'appendPeriod',
        'areWordsSelectedBegin': 'startSelected',
        'thisWordSelectedBegin': 'startSelected',
        'changeSelectionEffect': 'requiresClick',
        'statusVerbosity': 0
      },
      existingText = [],
      templates = {
        'couplet': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] ',
        'quatrain': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s]',
        'blankSonnet': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s]',
        'blankSonnet2': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s]',
        'blankSonnet3': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s]',
        'haiku': '[s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] ',
        'tanka': '[s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] ',
        'renga': '[s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] '
      };

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


  var jg = new jGnoetry(debug);
  // TODO: ugh. that's a lot of ugly parameters
  var output = jg.generate(randomProperty(templates), options, corpora, existingText);

  // console.log(output.displayText);

  return output.displayText;


};

module.exports =  poetifier;
