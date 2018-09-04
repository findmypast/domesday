'use strict';

const uuid = require('uuid');
const Promise = require('bluebird');

const log = require('./log');
const register = require('./register');
const urlAuthParse = require('./url-auth-parse');
const secretHandler = require('./secret-handler.js');

module.exports = (hostURI, appUser, appPolicy, environment, k8sContext, opts) => Promise.try(
   () => {

     const vaultDetails = urlAuthParse(hostURI, opts);
     const appPassword = uuid.v4();
     secretHandler.init(k8sContext);

     return secretHandler.hasSecret(appUser, environment)
     .then(secretExists => {
       if(secretExists === true) {
         log.out(`Secret for ${appUser} already exists, no need to recreate it.`);
       }
       if(secretExists === false) {
         return register(vaultDetails, appUser, appPassword, appPolicy)
         .then(() => secretHandler.createSecret(appUser, appPassword, environment))
         .then(() => log.out(appPassword));
       }
     })
   }
);
