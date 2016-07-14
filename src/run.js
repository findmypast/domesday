'use strict';

const uuid = require('uuid');
const Vault = require('vault-client');
const url = require('url');

const log = require('./log');
const register = require('./register');

function gatherVaultArguments(hostURI) {
  const parsedURI = url.parse(hostURI);
  const vaultUrl = `${parsedURI.protocol}//${parsedURI.host}`
  const vaultAuth = parsedURI.auth.split(':');
  return {
    url: vaultUrl,
    auth: {
      username: vaultAuth[0],
      password: vaultAuth[1]
    }
  }
}

module.exports = function(hostURI, appId) {
  const userId = uuid.v4();
  const vaultArgs = gatherVaultArguments(hostURI);

  const vault = new Vault({
    url: vaultArgs.url
  });

  register(vault, vaultArgs.auth, appId, userId, (error) => {
    if(error) {
      throw error;
    }
    log.out(userId)
  });
}
