'use strict';

let program = require('commander'),
    config = {};

program
  .version('0.0.2')
  .option('-l, --log', 'dump to log')
  .option('-t, --transform [percent]', 'percent chance of text transform (in hundreths, eg 0.25 = 25%')
  .option('-m, --method [jgnoetry, buckets]', 'specify poem generate method')
  .parse(process.argv);

if (program.log) {
  config.log = true;
}

if (program.transform) {
  let chance = parseFloat(program.transform, 10);
  if (!isNaN(chance)) {
    config.transformChance = chance;
  }
}

if (program.method) {
  config.method = program.method;
}

let poetifier = new require('./lib/poetifier.js')({config: config});

poetifier.poem();
