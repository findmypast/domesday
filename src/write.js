'use strict';

module.exports = async (vaultDetails, key, value) => {
  const vault = vaultDetails.vaultClient;
  const vaultAuth = vaultDetails.vaultAuth;
  const authenticator = vaultDetails.vaultAuthenticator;

  if(!key) {
    throw new Error('You must supply a key');
  }

  if(!value) {
    throw new Error('You must supply a value');
  }

  const result = await authenticator(vaultAuth);
  vault.token = result.auth.client_token;

  return vault.write(key, value);
};
