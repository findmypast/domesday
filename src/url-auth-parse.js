'use strict';

const url = require('url');
const vault = require('node-vault');

module.exports = (hostURI, opts) => {
  const parsedURI = url.parse(hostURI);
  if(!parsedURI || !parsedURI.protocol || !parsedURI.host) {
    throw new Error('Bad input: could not parse host');
  }
  const vaultURL = `${parsedURI.protocol}//${parsedURI.host}`;
  const vaultClient = vault({
    endpoint: vaultURL
  })

  const authParts = parsedURI.auth ? parsedURI.auth.split(':') : [];
  if(!opts.token && (!authParts[0] || !authParts[1])) {
    throw new Error('Bad input: user authentication was in a invalid format')
  }
  const vaultAuth = opts.token ? { token: opts.token } : {
    username: authParts[0],
    password: authParts[1]
  };

  const authenticator = opts.token ? vaultClient.githubLogin : vaultClient.userpassLogin;

  return { vaultAuth: vaultAuth, vaultClient: vaultClient, vaultAuthenticator: authenticator };
}
