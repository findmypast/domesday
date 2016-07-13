'use strict';
const async = require('async');

module.exports = function register(vault, vaultAuth, appId, userId, done) {
  async.series([
    function login(next) {
      vault.login({
        backend: 'userpass',
        options: {
          username: vaultAuth[0],
          password: vaultAuth[1]
        }
      }, next);
    },
    function post(next) {
      vault.post(`auth/app-id/map/user-id/${userId}`, { value: appId }, {}, next);
    }
  ], done);
};
