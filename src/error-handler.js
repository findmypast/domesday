'use strict';

const log = require('./log');

module.exports = fn => (...args) =>
  fn(...args).catch(error => {
    log.err('');
    log.err(error.message);
    process.exit(1);
  });
