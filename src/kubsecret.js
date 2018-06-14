'use strict';

const uuid = require('uuid');
const Promise = require('bluebird');

const log = require('./log');
const register = require('./register');
const urlAuthParse = require('./url-auth-parse');
const secretHandler = require('./secret-handler.js');

module.exports = (hostURI, appUser, appPolicy, opts) => Promise.try(
   () => {

     const vaultDetails = urlAuthParse(hostURI, opts);
     const appPassword = uuid.v4();

     return secretHandler.hasSecret(appUser)
     .then(secretExists => {
       if(secretExists === true) {
         log.out(`Secret for ${appUser} already exists, no need to recreate it.`);
       }
       if(secretExists === false) {
         return register(vaultDetails, appUser, appPassword, appPolicy)
         .then(() => secretHandler.createSecret(appUser, appPassword))
         .then(() => log.out(appPassword));
       }
     })
   }
);
