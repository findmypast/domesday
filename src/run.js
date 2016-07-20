'use strict';

const uuid = require('uuid');
const url = require('url');
const vault = require('node-vault');

const log = require('./log');
const register = require('./register');

module.exports = function(hostURI, appUser) {
  if(!hostURI) {
    throw new Error('Bad input: no host supplied');
  }
  if(!appUser) {
    throw new Error('Bad input: no application name supplied');
  }

  const parsedURI = url.parse(hostURI);
  if(!parsedURI || !parsedURI.protocol || !parsedURI.host) {
    throw new Error('Bad input: could not parse host');
  }
  const vaultURL = `${parsedURI.protocol}//${parsedURI.host}`;
  const vaultClient = vault({
    endpoint: vaultURL
  })

  const authParts = parsedURI.auth.split(':');
  if(!authParts[0] || !authParts[1]) {
    throw new Error('Bad input: user authentication was in a invalid format')
  }
  const vaultAuth = {
    username: authParts[0],
    password: authParts[1]
  };

  const appPassword = uuid.v4();

  return register(vaultClient, vaultAuth, appUser, appPassword)
  .then(() => log.out(appPassword));
}
