var poetifier = function() {

  var jGnoetry = require('./jgnoetry.headless.js'),
      texts = require('./defaultTexts.js'),
      // {
      //   "handlePunctuation": "noParen",
      //   "byNewlineOrPunctuation": "punctuation",
      //   "capitalize": {
      //     "method": "capitalizeCustom",
      //     "customSentence": true,
      //     "customLine": false,
      //     "customI": false
      //   },
      //   "appendToPoem": "appendExclamation",
      //   "areWordsSelectedBegin": "startSelected",
      //   "thisWordSelectedBegin": "startSelected",
      //   "changeSelectionEffect": "requiresClick",
      //   "statusVerbosity": 1
      // }
      options = {
        'handlePunctuation': 'noParen',
        'byNewlineOrPunctuation': 'punctuation',
        'capitalize': {
          'method': 'capitalizeCustom', // capitalizeNone, capitalizeAsCorpus
          'customSentence': true, // sentence beginning
          'customLine': true, // line beginnings
          'customI': true // capitalize "I"
        },
        'appendToPoem': 'appendPeriod',
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
        'renga': '[s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [s] ',
        'howl': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[n]\n[s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[n]\n[s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] ',
        'kb': '[s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [s] [s] [n]\n[s] [s] [s] [s] [n]\n[n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s] [s] [s] [s] [n]\n[n]\n[s] [s] [s] [s] [s] [s]'
      };

  var corpora = {
    texts: texts,
    weights: []
  };

  var capitalizations = ['capitalizeCustom', 'capitalizeNone', 'capitalizeAsCorpus'],
      endPuncts = ['appendNothing', 'appendPeriod', 'appendQuestion', 'appendExclamation'];


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

  var assignWeights = function(count) {

    var strategies = [assignWeightsRandom, weightsPickOne, weightsPickTwo],
        strategy = pick(strategies);

    return strategy(count);

  };

  // TODO: reduce size of corpora.texts
  var reduceCorpora = function() {
    // assume corpora.texts is in-scope
    var newCorpus = [];

    for (var i = 0, len = corpora.texts.length; i < 7; i++) {
      newCorpus.push(pickRemove(corpora.texts));
    }

    corpora.texts = newCorpus;
  };


  var initializeArray = function(count) {
    var arr = Array.apply(null, Array(count));
    return arr.map(function(x) { return 0; });
  };

  // TODO: this would be easier if we just prune the texts, and THEN assign weight randomly
  var weightsPickOne = function(count) {
    var arr = initializeArray(count);
    arr[random(arr.length)] = 100;
    return arr;
  };

  var weightsPickTwo = function(count) {
    // TODO: implement
    // pick one, then do a while loop, do make sure we get a DIFFERENT number...
    var arr = initializeArray(count);
    var first = random(arr.length),
        second = random(arr.length);
    arr[first] = 50;
    while (second === first) {
      second = random(arr.length);
    }
    arr[second] = 50;
    return arr;
  };

  // return an array of length n, where n := texts.lengh
  // and sum(array) := 100
  var assignWeightsRandom = function(count) {
    var weights = [],
        total = 0;

    // naive implementation
    // first value has a greater chance of being > other values
    // last value has a greater chance of being < other value
    // but then we shuffle 'em all
    for(var i = 0; i < count-1; i++) {
      weights[i] = random(100-total);
      total += weights[i];
    }
    weights.push(100-total);
    shuffle(weights);

    return weights;
  };

  var wordbag = function(text) {

    var wb = {},
        splits = text.split(/\W/g),
        alphanumeric = /[a-z0-9]+/i;

    for( var i = 0, len = splits.length; i < len; i++) {
      var word = splits[i];
      if (alphanumeric.test(word) && word.length > 3) {
        if (!wb[word]) {
          wb[word] = [];
        }
        wb[word].push(word);
      }
    }

    return wb;

  };

  var sortedArray = function(wordbag) {

    var words = [];
    for(var word in wordbag) {
      words.push({ word: word, count: wordbag[word].length});
    }

    words.sort(function(a,b) {
      if (a.count < b.count) {
        return 1;
      }

      if (a.count > b.count) {
        return -1;
      }

      return 0;
    });

    return words;

  };

  var assignCapitalization = function() {

    var cap = {
      method: pick(capitalizations),
      customSentence: true, // sentence beginning
      customLine: true, // line beginnings
      customI: true // capitalize "I"
    };

    if (cap.method !== 'capitalizeCustom') {
      cap.customSentence = false;
      cap.customLine = false;
      cap.customI = false;
    }

    return cap;

  };

  var titlifier = function(text) {

    var title = '';

    if (Math.random() > 0.5) {
      return templateName.replace(/[0-9]/g, '') + ' ' + corpora.weights.join(' ');
    }

    var wordfreqs = sortedArray(wordbag(text));
    if (wordfreqs.length > 4) {
      var wordCount = getRandomInRange(2, wordfreqs.length > 10 ? 10 : 4);
      title = wordfreqs.slice(0,wordCount).map(function(elem) { return elem.word; }).join(' ');
    } else {
      title = wordfreqs[0].word;
    }

    return title.toUpperCase();

  };

  // TODO: this should go elsewhere (CRUDE!)
  // extracted from my modified lexeduct, gh-pages branch
  var InitialSpaces = function(cfg) {

    if(!(this instanceof InitialSpaces)) {
      return new InitialSpaces(cfg);
    }

    var defaultConfig = {
      offset: 20,
      offsetVariance: 20,
      offsetProbability: 0.8
    };

    this.config = {
      offset: (cfg && cfg.offset ? cfg.offset : defaultConfig.offset),
      offsetVariance: (cfg && cfg.offsetVariance ? cfg.offsetVariance : defaultConfig.offsetVariance),
      offsetProbability: (cfg && cfg.offsetProbability ? cfg.offsetProbability : defaultConfig.offsetProbability)
    };

    this.generate = function(text) {

      var out = [];
      var lines = text.split('\n');

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.length > 0 && coinflip(this.config.offsetProbability)) {
          var variance = getRandomInRange(-this.config.offsetVariance, this.config.offsetVariance);
          // +1, since when you join a 1-length array, you don't get the join-character.
          var spaceCount = this.config.offset + variance + 1;
          var spaces = Array(spaceCount).join(' ');
          line = spaces + line;
        }
        out.push(line);
      }

      return out.join('\n');

    };

  };


  var jg = new jGnoetry(debug);
  reduceCorpora();
  corpora.weights = assignWeights(corpora.texts.length);
  var templateName = pick(Object.keys(templates));
  options.capitalize = assignCapitalization();
  options.appendToPoem = pick(endPuncts);
  var spaces = new InitialSpaces();

  debug(JSON.stringify(options, null, 2), 0);
  debug(templateName, 0);
  debug(corpora.weights.join(' '), 0);
  // TODO: ugh. that's a lot of ugly parameters
  var output = jg.generate(templates[templateName], options, corpora, existingText);

  var text = output.displayText;
  var noLeadingSpaceTemplates = ['howl', 'haiku', 'couplet'];
  if (noLeadingSpaceTemplates.templateName > -1 && coinflip(0.25)) {
    debug('initial spaces', 0);
    text = spaces.generate(text);
  }

  return {
    title: titlifier(output.displayText),
    text: text
  };


};

module.exports =  poetifier;
