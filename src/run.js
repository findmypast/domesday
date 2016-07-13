'use strict';

const uuid = require('uuid');
const Vault = require('vault-client');
const url = require('url');

const log = require('./log');
const register = require('./register');

module.exports = function(hostURI, appId) {
  const userId = uuid.v4();

  const parsedURI = url.parse(hostURI);
  const vaultURL = `${parsedURI.protocol}//${parsedURI.host}`
  const vaultAuth = parsedURI.auth.split(':');

  const vault = new Vault({
    url: vaultURL
  });

  register(vault, vaultAuth, appId, userId);

  log.out(userId);
}
