'use strict';

const uuid = require('uuid');

const log = require('./log');
const register = require('./register');
const urlAuthParse = require('./url-auth-parse');

module.exports = async (hostURI, appUser, appPolicy, opts) => {
  const vaultDetails = urlAuthParse(hostURI, opts);
  const appPassword = uuid.v4();

  await register(vaultDetails, appUser, appPassword, appPolicy);
  log.out(appPassword);
};
