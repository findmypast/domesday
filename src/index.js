#!/usr/bin/env node

'use strict';

const program = require('commander');
const version = require('../package.json').version;
const handle = require('./error-handler');
const userpass = handle(require('./userpass'));
const log = require('./log');

program
  .version(version);

program
  .command('userpass <host> <app-name> <policy>')
  .description('Generates a UUID and registers as the password for user <app-name> with policy <policy>')
  .action(userpass);

program.on('--help', function(){
  log.out('  Examples:');
  log.out('');
  log.out('    $ domesday userpass http://user:password@127.0.0.1:8200 myapp application');
  log.out('');
});

program.parse(process.argv);
