'use strict';

const write = require('./write');

module.exports = function register(vaultDetails, appUser, appPassword, appPolicy) {

  return write(vaultDetails, 'auth/userpass/users/' + appUser, { password: appPassword, policies: appPolicy });
};
