'use strict';

const program = require('commander');
const version = require('../package.json').version;


program
  .version(version)
  .description('Generates a UUID and registers it to an AppID in a Vault');

program
  .arguments('<host> <app-id>')

program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ domesday http://user:password@127.0.0.1:8200 myapp');
  console.log('');
});

program.parse(process.argv);
