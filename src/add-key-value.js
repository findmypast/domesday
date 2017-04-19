'use strict'

const urlAuthParse = require('./url-auth-parse');
const write = require('./write');
const Promise = require('bluebird');

module.exports = (hostURI, key, value, opts) => Promise.try(
  () => {

    const vaultDetails = urlAuthParse(hostURI, opts);

    return write(vaultDetails, key, {value: value});
  }
);
