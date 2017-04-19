'use strict';

const log = require('./log');

module.exports = (vault, vaultAuth, key, value) => {

    return vault.userpassLogin(vaultAuth)
    .then( result => {
      vault.token = result.auth.client_token;
      return vault.write(key, value);
    });
}
