'use strict';

const log = require('./log');
const urlAuthParse = require('./url-auth-parse');

module.exports = async (hostURI, opts) => {
  const { vaultClient, vaultAuthenticator, vaultAuth } = urlAuthParse(hostURI, opts);

  const result = await vaultAuthenticator(vaultAuth);
  vaultClient.token = result.auth.client_token;

  const tokenResult = await vaultClient.tokenCreate({ period: opts.period });
  const { client_token } = tokenResult.auth;
  log.out(client_token);
};
