'use strict'

const urlAuthParse = require('./url-auth-parse');
const log = require('./log');

module.exports = async (hostURI, key, opts) => {
  const vaultDetails = urlAuthParse(hostURI, opts);

  const result = await vaultDetails.vaultAuthenticator(vaultDetails.vaultAuth);
  vaultDetails.vaultClient.token = result.auth.client_token;

  const readResult = await vaultDetails.vaultClient.read(key);
  log.out(readResult.data.value);

  return readResult.data.value;
};
