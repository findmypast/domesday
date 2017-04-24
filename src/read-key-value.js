'use strict'

const urlAuthParse = require('./url-auth-parse');
const log = require('./log');
const Promise = require('bluebird');

module.exports = (hostURI, key, opts) => Promise.try(
  () => {
    const vaultDetails = urlAuthParse(hostURI, opts);

    return vaultDetails.vaultAuthenticator(vaultDetails.vaultAuth)
      .then( result => {
        vaultDetails.vaultClient.token = result.auth.client_token;

        return vaultDetails.vaultClient.read(key)
        .then(result => {
          log.out(result.data.value);

          return result.data.value;
        });
      });
  }
);
