'use strict';

const uuid = require('uuid');
const Promise = require('bluebird');

const log = require('./log');
const register = require('./register');
const urlAuthParse = require('./url-auth-parse');
const shell = require('shelljs');

function existsSecret() {
  return shell.exec(`kubectl get secrets ${appUser}`).code === 1;
}

function createSecret(appUser, appPassword) {
  if (shell.exec(`kubectl create secret generic ${appUser} --from-literal=username=${appUser} --from-literal=password=${appPassword}`).code !== 0) {
    throw new Error('Secret could not be created at K8s');
  }
  log.out(`Secret for ${appUser} created successfully at the kubernetes cluster`);
}

module.exports = (hostURI, appUser, appPolicy, opts) => Promise.try(
  () => {

    const vaultDetails = urlAuthParse(hostURI, opts);
    const appPassword = uuid.v4();

    if (existsSecret) {
      throw new Error(`Error: Secret for ${appUser} already exists, no need to recreate it, aborting.`);
    }

    return register(vaultDetails, appUser, appPassword, appPolicy)
    .then(() => log.out(appPassword))
    .then(() => createSecret(appUser, appPassword));
  }
);
