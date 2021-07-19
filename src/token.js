'use strict';

const Promise = require('bluebird');

const urlAuthParse = require('./url-auth-parse');

module.exports = (hostURI, opts) => Promise.try(
  () => {
    const vaultDetails = urlAuthParse(hostURI, opts);
    
    return vaultDetails.vaultClient.tokenCreate().then((result) => {
      console.log(result)
    })
  }
);

