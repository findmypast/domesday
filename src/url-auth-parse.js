'use strict';

const url = require('url');
const vault = require('node-vault');

module.exports = (hostURI) => {
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

  return { vaultAuth: vaultAuth, vaultClient: vaultClient };
}
