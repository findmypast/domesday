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
         throw new Error(`Error: Secret for ${appUser} already exists, no need to recreate it, aborting.`);
       }
       if(secretExists === false) {
         return register(vaultDetails, appUser, appPassword, appPolicy)
         .then(() => log.out(appUser, appPassword, appPolicy))
         .then(() => secretHandler.createSecret(appUser, appPassword));
       }
     })
   }
);
