'use strict';

const uuid = require('uuid');

const log = require('./log');
const register = require('./register');
const urlAuthParse = require('./url-auth-parse');
const secretHandler = require('./secret-handler.js');

module.exports = async (hostURI, appUser, appPolicy, environment, k8sContext, opts) => {
  const vaultDetails = urlAuthParse(hostURI, opts);
  const appPassword = uuid.v4();
  secretHandler.init(k8sContext);

  const secretExists = await secretHandler.hasSecret(appUser, environment);
  
  if(secretExists === true) {
    log.out(`Secret for ${appUser} already exists, no need to recreate it.`);
  }
  if(secretExists === false) {
    await register(vaultDetails, appUser, appPassword, appPolicy);
    await secretHandler.createSecret(appUser, appPassword, environment);
    log.out(appPassword);
  }
};
