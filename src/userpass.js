'use strict';

const uuid = require('uuid');
const url = require('url');
const vault = require('node-vault');
const Promise = require('bluebird');

const log = require('./log');
const register = require('./register');
const urlAuthParse = require('./url-auth-parse');

module.exports = (hostURI, appUser, appPolicy) => Promise.try(
  () => {

    const vaultDetails = urlAuthParse(hostURI);
    const appPassword = uuid.v4();

    return register(vaultDetails.vaultClient, vaultDetails.vaultAuth, appUser, appPassword, appPolicy)
    .then(() => log.out(appPassword));
  }
);
