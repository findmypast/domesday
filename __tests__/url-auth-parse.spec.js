'use strict';
/* global jest describe it expect */

jest.mock('node-vault');
const vault = require('node-vault');

jest.mock('npm-conf');
const npmConfig = require('npm-conf');

jest.unmock('../src/url-auth-parse');
const urlAuthParse = require('../src/url-auth-parse');

vault.mockReturnValue({
  userpassLogin: () => {},
  githubLogin: () => {},
});

npmConfig.mockReturnValue({
  get: () => null,
});

describe('URL authentication parser when not using a github token to authenticate', () => {
  const hostUri = 'http://test:testpwd@myvault.com';

  it('extract the user name and password from the host uri ', () => {
    const result = urlAuthParse(hostUri, {});

    expect(result.vaultAuth).toEqual({ username: 'test', password: 'testpwd' });
  });

  it('sets the userpassLogin authenticator ', () => {
    const result = urlAuthParse(hostUri, {});

    expect(result.vaultAuthenticator).toEqual(vault().userpassLogin);
  });

  it('sets the vault client', () => {
    const result = urlAuthParse(hostUri, {});

    expect(result.vaultClient).toEqual(vault());
  });

  it('throws an error if the authentication credentials are missing', () => {
    const badHostUri = 'http://myvault.com';
    expect(() => urlAuthParse(badHostUri, {})).toThrowError(/authentication/);
  });

  it('throws an error if the host URI is bad', () => {
    const badHostUri = 'mybad:/myvault.com:sdfsd';
    expect(() => urlAuthParse(badHostUri, {})).toThrowError(
      'Bad input: could not parse host'
    );
  });
});

describe('URL authentication parser when using a github token to authenticate', () => {
  it('set the vault credentials to the token passed', () => {
    const hostUri = 'http://myvault.com';
    const expectedResult = { token: 'mytoken' };
    const result = urlAuthParse(hostUri, expectedResult);

    expect(result.vaultAuth).toEqual(expectedResult);
  });

  it('set ignore any credentials passed via the host URI and use the token credentials', () => {
    const hostUri = 'http://test:testpwd@myvault.com';
    const expectedResult = { token: 'mytoken' };
    const result = urlAuthParse(hostUri, expectedResult);

    expect(result.vaultAuth).toEqual(expectedResult);
    expect(result.vaultAuthenticator).toEqual(vault().githubLogin);
  });

  it('sets the githubLogin authenticator ', () => {
    const hostUri = 'http://myvault.com';
    const expectedResult = { token: 'mytoken' };
    const result = urlAuthParse(hostUri, expectedResult);

    expect(result.vaultAuthenticator).toEqual(vault().githubLogin);
  });
});

describe('URL authentication parser when the github token is set via npm config', () => {
  beforeAll(() => {
    npmConfig.mockReturnValue({
      get: () => 'mytoken',
    });
  });

  afterAll(() => {
    npmConfig.mockReturnValue({
      get: () => null,
    });
  });

  it('set the vault credentials to the token passed and uses github auth', () => {
    const hostUri = 'http://myvault.com';
    const result = urlAuthParse(hostUri, {});

    expect(result.vaultAuth).toEqual({ token: 'mytoken' });
    expect(result.vaultAuthenticator).toEqual(vault().githubLogin);
  });

  it('prefers userpass credentials if included in the URL', () => {
    const hostUri = 'http://test:testpwd@myvault.com';
    const result = urlAuthParse(hostUri, {});

    expect(result.vaultAuth).toEqual({ username: 'test', password: 'testpwd' });
    expect(result.vaultAuthenticator).toEqual(vault().userpassLogin);
  });

  it('prefers token passed in as options', () => {
    const hostUri = 'http://myvault.com';
    const result = urlAuthParse(hostUri, { token: 'myothertoken' });

    expect(result.vaultAuth).toEqual({ token: 'myothertoken' });
    expect(result.vaultAuthenticator).toEqual(vault().githubLogin);
  });

  it('prefers token set in environment variable', () => {
    const hostUri = 'http://myvault.com';

    process.env.VAULT_GITHUB_TOKEN = 'myothertoken';
    const result = urlAuthParse(hostUri, {});
    delete process.env.VAULT_GITHUB_TOKEN;

    expect(result.vaultAuth).toEqual({ token: 'myothertoken' });
    expect(result.vaultAuthenticator).toEqual(vault().githubLogin);
  });
});

describe('URL authentication parser when the github token is set via environment variable', () => {
  beforeAll(() => {
    process.env.VAULT_GITHUB_TOKEN = 'mytoken';
  });

  afterAll(() => {
    delete process.env.VAULT_GITHUB_TOKEN;
  });

  it('set the vault credentials to the token passed and uses github auth', () => {
    const hostUri = 'http://myvault.com';
    const result = urlAuthParse(hostUri, {});

    expect(result.vaultAuth).toEqual({ token: 'mytoken' });
    expect(result.vaultAuthenticator).toEqual(vault().githubLogin);
  });

  it('prefers userpass credentials if included in the URL', () => {
    const hostUri = 'http://test:testpwd@myvault.com';
    const result = urlAuthParse(hostUri, {});

    expect(result.vaultAuth).toEqual({ username: 'test', password: 'testpwd' });
    expect(result.vaultAuthenticator).toEqual(vault().userpassLogin);
  });

  it('prefers token passed in as options', () => {
    const hostUri = 'http://test:testpwd@myvault.com';
    const result = urlAuthParse(hostUri, { token: 'myothertoken' });

    expect(result.vaultAuth).toEqual({ token: 'myothertoken' });
    expect(result.vaultAuthenticator).toEqual(vault().githubLogin);
  });
});
