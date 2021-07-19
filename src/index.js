#!/usr/bin/env node

'use strict';

const program = require('commander');
const version = require('../package.json').version;
const handle = require('./error-handler');
const userpass = handle(require('./userpass'));
const kubsecret = handle(require('./kubsecret'));
const addKeyValue = handle(require('./add-key-value'));
const readKeyValue = handle(require('./read-key-value'));
const token = handle(require('./token'));

const log = require('./log');

const tokenOption = {
  flag: '-t, --token <token>',
  description: 'The authentication token to access Vault - typically your Github access token.',
};

program.version(version);

program
  .command('userpass <host> <app-name> <policy>')
  .description('Generates a UUID and registers as the password for user <app-name> with policy <policy>')
  .option(tokenOption.flag, tokenOption.description)
  .action(userpass);

program
  .command('token <host>')
  .description('Generates a token')
  .option(tokenOption.flag, tokenOption.description)
  .action(token);

program
  .command('kubsecret <host> <app-name> <policy> <environment> <k8sContext>')
  .description('Generates and registers an UUID as the password for user <app-name> with policy <policy> and also creates a Kubernetes secret in <environment>')
  .option(tokenOption.flag, tokenOption.description)
  .action(kubsecret);

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
  log.out(`
  Examples:

    $ domesday userpass http://user:password@127.0.0.1:8200 myapp application
    $ domesday add-key-value http://user:password@127.0.0.1:8200 secret/my-secret SECRET_CONTENT
    $ domesday read-key-value http://user:password@127.0.0.1:8200 secret/my-secret
  `);
});

program.parse(process.argv);
