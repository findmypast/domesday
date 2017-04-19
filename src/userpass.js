'use strict';

const uuid = require('uuid');
const Promise = require('bluebird');

const log = require('./log');
const register = require('./register');
const urlAuthParse = require('./url-auth-parse');

module.exports = (hostURI, appUser, appPolicy, opts) => Promise.try(
  () => {

    const vaultDetails = urlAuthParse(hostURI, opts);
    const appPassword = uuid.v4();

    return register(vaultDetails, appUser, appPassword, appPolicy)
    .then(() => log.out(appPassword));
  }
);
