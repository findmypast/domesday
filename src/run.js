'use strict';

const uuid = require('uuid');
const Vault = require('vault-client');
const url = require('url');

const log = require('./log');
const register = require('./register');

function gatherVaultArguments(hostURI) {
  const parsedURI = url.parse(hostURI);
  if(!parsedURI || !parsedURI.protocol || !parsedURI.host) {
    throw new Error('Bad input: could not parse host');
  }

  const vaultAuth = parsedURI.auth.split(':');
  if(!vaultAuth[0] || !vaultAuth[1]) {
    throw new Error('Bad input: user authentication was in a invalid format')
  }

  return {
    url: `${parsedURI.protocol}//${parsedURI.host}`,
    auth: {
      username: vaultAuth[0],
      password: vaultAuth[1]
    }
  }
}

module.exports = function(hostURI, appId) {
  if(!hostURI) {
    throw new Error('Bad input: no host supplied');
  }

  if(!appId) {
    throw new Error('Bad input: no appId supplied');
  }

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
