'use strict';

const write = require('./write');

module.exports = function register(vault, vaultAuth, appUser, appPassword, appPolicy) {

  return write(vault, vaultAuth, 'auth/userpass/users/' + appUser, { password: appPassword, policies: appPolicy });
};
