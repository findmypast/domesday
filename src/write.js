'use strict';

module.exports = (vaultDetails, key, value) => {
  const vault = vaultDetails.vaultClient;
  const vaultAuth = vaultDetails.vaultAuth;
  const authenticator = vaultDetails.vaultAuthenticator;

  return authenticator(vaultAuth)
  .then( result => {
    vault.token = result.auth.client_token;

    return vault.write(key, value);
  });
}
