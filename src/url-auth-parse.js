'use strict';

const url = require('url');
const vault = require('node-vault');
const npmConfig = require('npm-conf');

module.exports = (hostURI, opts) => {
  const parsedURI = url.parse(hostURI);
  if (!parsedURI || !parsedURI.protocol || !parsedURI.host) {
    throw new Error('Bad input: could not parse host');
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
    throw new Error(`Bad input: authentication not provided.

Please provide authentication:
 - in the url as http://<user>:<password>@address:port/
 - as a Github Access Token with the --token <token> option
 - as a Github Access Token in the VAULT_GITHUB_TOKEN environment variable
 - as a Github Access Token via npm config: npm config set vault_github_token=<token>
    `);
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
