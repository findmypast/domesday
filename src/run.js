'use strict';

const uuid = require('uuid');
const vault = require('node-vault');
const log = require('./log');

module.exports = function(hostUri, appId) {
  const userId = uuid.v4();

  log.out(userId);
}
