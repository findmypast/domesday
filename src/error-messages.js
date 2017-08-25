'use strict';

const AUTHENTICATION_MISSING = `Bad input: authentication not provided.

Please provide authentication:
- in the url as http://<user>:<password>@address:port/
- as a Github Access Token with the --token <token> option
- as a Github Access Token in the VAULT_GITHUB_TOKEN environment variable
- as a Github Access Token via npm config: npm config set vault_github_token=<token>`;

const BAD_HOST = 'Bad input: could not parse host';

module.exports = {
  AUTHENTICATION_MISSING,
  BAD_HOST,
};
