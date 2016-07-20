'use strict';

module.exports = function register(vault, vaultAuth, appId, userId) {
  return vault.userpassLogin(vaultAuth)
  .then( result => {
    vault.token = result.auth.client_token;
    return vault.write(
      'auth/userpass/users/' + appId,
      { password: userId, policies: 'application' }
    );
  });
};
