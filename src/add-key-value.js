'use strict'

const urlAuthParse = require('./url-auth-parse');
const write = require('./write');

module.exports = async (hostURI, key, value, opts) => {
  const vaultDetails = urlAuthParse(hostURI, opts);
  return write(vaultDetails, key, {value: value});
};
