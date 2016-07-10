'use strict';

let program = require('commander'),
    config = {};

program
  .version('0.0.2')
  .option('-l, --log', 'dump to log')
  .option('-x, --xform [percent]', 'percent chance of text transform (in hundreths, eg 0.25 = 25%')
  .option('-m, --method [jgnoetry, buckets]', 'specify poem generate method')
  .option('-t, --templateName [jgnoetry template name]', 'specify jgnoetry template to use')
  .option('-c, --corporaFilter [string]', 'filename substring filter (non-case sensitive)')
  .option('-s --seed [string]', 'seed for random generator')
  .option('-r --reduce', 'force line-reduce')
  .parse(process.argv);

// if (program.log) {
// of COURSE we dump to log
// maybe make a param for something more detailed?
  config.log = true;
// }

if (program.xform) {
  let chance = parseFloat(program.xform, 10);
  if (!isNaN(chance)) {
    config.transformChance = chance;
  }
}

if (program.templateName) {
  config.templateName = program.templateName;
}

if (program.method) {
  config.method = program.method;
}

if (program.corporaFilter) {
  config.corporaFilter = program.corporaFilter;
}

if (program.seed) {
  config.seed = program.seed;
}

if (program.reduce) {
  config.reduce = true;
}

let poetifier = new require('./lib/poetifier.js')({config: config});

poetifier.poem();
