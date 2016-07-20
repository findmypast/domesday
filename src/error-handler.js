'use strict';

const log = require('./log');

module.exports = fn =>
  (...args) =>
    fn(...args)
    .catch(error => {
      log.err(error);
      process.exit(1);
    });
