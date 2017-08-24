#!/usr/bin/env node

'use strict';

const program = require('commander');
const version = require('../package.json').version;
const handle = require('./error-handler');
const userpass = handle(require('./userpass'));
const addKeyValue = handle(require('./add-key-value'));
const readKeyValue = handle(require('./read-key-value'));
const log = require('./log');

const tokenOption = {
  flag: '-t, --token <token>',
  description:
    'The authentication token to access Vault - typically your Github access token.',
};

program.version(version);

program
  .command('userpass <host> <app-name> <policy>')
  .description(
    'Generates a UUID and registers as the password for user <app-name> with policy <policy>'
  )
  .option(tokenOption.flag, tokenOption.description)
  .action(userpass);

program
  .command('add-key-value <host> <key> <value>')
  .description('Add a key value pair to the Vault')
  .option(tokenOption.flag, tokenOption.description)
  .action(addKeyValue);

program
  .command('read-key-value <host> <key>')
  .description('Read the value of a key from the Vault')
  .option(tokenOption.flag, tokenOption.description)
  .action(readKeyValue);

program.on('--help', function() {
  log.out('');
  log.out('  Examples:');
  log.out('');
  log.out(
    '    $ domesday userpass http://user:password@127.0.0.1:8200 myapp application'
  );
  log.out('');
});

program.parse(process.argv);
