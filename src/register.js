'use strict';

module.exports = function register(vault, vaultAuth, appUser, appPassword, appPolicy) {
  return vault.userpassLogin(vaultAuth)
  .then( result => {
    vault.token = result.auth.client_token;
    return vault.write(
      'auth/userpass/users/' + appUser,
      { password: appPassword, policies: appPolicy }
    );
  });
};
