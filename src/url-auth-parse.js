'use strict';

const url = require('url');
const vault = require('node-vault');
const npmConfig = require('npm-conf');
const { BAD_HOST, AUTHENTICATION_MISSING } = require('./error-messages');

module.exports = (hostURI, opts) => {
  const parsedURI = url.parse(hostURI);
  if (!parsedURI || !parsedURI.protocol || !parsedURI.host) {
    throw new Error(BAD_HOST);
  }

  const vaultURL = `${parsedURI.protocol}//${parsedURI.host}`;
  const vaultClient = vault({
    endpoint: vaultURL,
  });

  const [username, password] = parsedURI.auth ? parsedURI.auth.split(':') : [];

  const token =
    opts.token ||
    process.env.VAULT_GITHUB_TOKEN ||
    npmConfig().get('vault_github_token');

  const useToken = opts.token || !(username && password);

  if (useToken && !token) {
    throw new Error(AUTHENTICATION_MISSING);
  }
  const vaultAuth = useToken ? { token } : { username, password };

  const authenticator = useToken
    ? vaultClient.githubLogin
    : vaultClient.userpassLogin;

  return {
    vaultAuth: vaultAuth,
    vaultClient: vaultClient,
    vaultAuthenticator: authenticator,
  };
};
