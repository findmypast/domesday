'use strict';
/* global jest describe it expect */

jest.mock('node-vault');
const vault = require('node-vault');

jest.unmock('../src/url-auth-parse');
const urlAuthParse = require('../src/url-auth-parse');

vault.mockReturnValue({
  userpassLogin: () => {},
  githubLogin: () => {}
});

describe('URL authentication parser when not using a github token to authenticate', () => {
  const hostUri = 'http://test:testpwd@myvault.com';

  it('extract the user name and password from the host uri ', () => {
    const result = urlAuthParse(hostUri, {});

    expect(result.vaultAuth).toEqual({ username: 'test', password: 'testpwd'});
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
    expect(() => urlAuthParse(badHostUri, {})).toThrowError('Bad input: user authentication was in a invalid format');
  });

  it('throws an error if the host URI is bad', () => {
    const badHostUri = 'mybad:/myvault.com:sdfsd';
    expect(() => urlAuthParse(badHostUri, {})).toThrowError('Bad input: could not parse host');
  });
});

describe('URL authentication parser when using a github token to authenticate', () => {
  it('set the vault credentials to the token passed', () => {
    const hostUri = 'http://myvault.com';
    const expectedResult = {token: 'mytoken'};
    const result = urlAuthParse(hostUri, expectedResult);

    expect(result.vaultAuth).toEqual(expectedResult);
  });

  it('set ignore any credentials passed via the host URI and use the token credentials', () => {
    const hostUri = 'http://test:testpwd@myvault.com';
    const expectedResult = {token: 'mytoken'};
    const result = urlAuthParse(hostUri, expectedResult);

    expect(result.vaultAuth).toEqual(expectedResult);
    expect(result.vaultAuthenticator).toEqual(vault().githubLogin);
  });

  it('sets the githubLogin authenticator ', () => {
    const hostUri = 'http://myvault.com';
    const expectedResult = {token: 'mytoken'};
    const result = urlAuthParse(hostUri, expectedResult);

    expect(result.vaultAuthenticator).toEqual(vault().githubLogin);
  });
});
