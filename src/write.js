'use strict';

const Promise = require('bluebird');

module.exports = (vaultDetails, key, value) => {
  const vault = vaultDetails.vaultClient;
  const vaultAuth = vaultDetails.vaultAuth;
  const authenticator = vaultDetails.vaultAuthenticator;

  if(!key) {
    Promise.reject('You must supply a key');
  }

  if(!value) {
    Promise.reject('You must supply a value');
  }

  return authenticator(vaultAuth)
    .then( result => {
      vault.token = result.auth.client_token;

      return vault.write(key, value);
    });
}
