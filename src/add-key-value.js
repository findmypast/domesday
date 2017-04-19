'use strict'

const urlAuthParse = require('./url-auth-parse');
const write = require('./write');
const Promise = require('bluebird');

module.exports = (hostURI, key, value) => Promise.try(
  () => {

    const vaultDetails = urlAuthParse(hostURI);

    return write(vaultDetails.vaultClient, vaultDetails.vaultAuth, key, {value: value});
  }
);
