'use strict';

const Promise = require('bluebird');
const log = require('./log');
const urlAuthParse = require('./url-auth-parse');

module.exports = (hostURI, opts) => Promise.try(
  () => {
    const { vaultClient, vaultAuthenticator, vaultAuth } = urlAuthParse(hostURI, opts);

    return vaultAuthenticator(vaultAuth)
      .then(result => {
        vaultClient.token = result.auth.client_token;

        return vaultClient.tokenCreate({ period: opts.period }).then((result) => {
          const { client_token } = result.auth;
          log.out(client_token);
        });
      });
  });
