#!/usr/bin/env node

'use strict';

const program = require('commander');
const version = require('../package.json').version;
const run = require('./run');
const log = require('./log');

program
  .version(version)
  .description('Generates a UUID and registers it to an AppID in a Vault');

program
  .arguments('<host> <app-id>')
  .action(run);

program.on('--help', function(){
  log.out('  Examples:');
  log.out('');
  log.out('    $ domesday http://user:password@127.0.0.1:8200 myapp');
  log.out('');
});

program.parse(process.argv);
