'use strict';
/* global jest describe it expect */

jest.mock('uuid');
const uuid = require('uuid');
jest.mock('node-vault');
const vault = require('node-vault');
jest.mock('../src/log');
const log = require('../src/log');
jest.mock('../src/register');
const register = require('../src/register');
register.mockReturnValue(new Promise((resolve) => resolve()));
jest.unmock('../src/userpass');
const userpass = require('../src/userpass');

vault.mockReturnValue({
  userpassLogin: () => {},
  githubLogin: () => {}
});

describe('userpass', () => {
  const inputHost = 'test.host';
  const inputPort = 8000;
  const inputUser = 'user';
  const inputPass = 'password';
  const inputProtocol = 'http:';
  const inputUri = `${inputProtocol}//${inputUser}:${inputPass}@${inputHost}:${inputPort}`;
  const inputAppId = 'app';
  const inputPolicy = 'test-policy';

  const expectedUUID = '6ded30dc-9574-41bb-96a6-8d19b377bb9e';

  describe('when everything works fine', () => {
    it('logs the generated UUID to stdout', () => {
      uuid.v4.mockReturnValue(expectedUUID);
      return userpass(inputUri, inputAppId, inputPolicy, {}).then(() => {
        expect(log.out.mock.calls[0][0]).toBe(expectedUUID);
      });
    });
    it('generates a vault client with the right URL', () => {
      return userpass(inputUri, inputAppId, inputPolicy, {}).then(() => {
        expect(vault.mock.calls[0][0].endpoint).toBe(`${inputProtocol}//${inputHost}:${inputPort}`);
      });
    });
    it('registers the generated UUID to the AppID provided', () => {
      const expectedVaultDetails = {
        vaultClient: vault(),
        vaultAuth: { username: inputUser, password: inputPass },
        vaultAuthenticator: vault().userpassLogin
      }
      uuid.v4.mockReturnValue(expectedUUID);
      return userpass(inputUri, inputAppId, inputPolicy, {}).then(() => {
        expect(register.mock.calls[0][0]).toEqual(expectedVaultDetails);
        expect(register.mock.calls[0][1]).toEqual(inputAppId);
        expect(register.mock.calls[0][2]).toEqual(expectedUUID);
        expect(register.mock.calls[0][3]).toEqual(inputPolicy);
      });
    });
  });

  describe('when passed bad arguments', () => {
    it('throws an appropriate error for bad hostUri', () => {
      const invalidUris = [
        `${'htpp'}//${inputUser}:${inputPass}@${inputHost}:${inputPort}`,
        `${inputProtocol}//${inputUser}:${inputPass}@`
      ];
      return Promise.all(
        invalidUris.map(badUri =>
          userpass(badUri, inputAppId, inputPolicy, {})
          .catch(error => expect(error.message).toBe('Bad input: could not parse host'))));
    });

    it('throws an appropriate error when the authentication is missing', () => {
      const invalidUris = [
        '',
        `${inputUser}:`,
        `:${inputPass}`
      ].map(badAuth => `${inputProtocol}//${badAuth}@${inputHost}:${inputPort}`);
      return Promise.all(
        invalidUris.map(badUri =>
          userpass(badUri, inputAppId, inputPolicy, {})
          .catch(error => expect(error.message).toBe('Bad input: user authentication was in a invalid format'))));
    });
  });
})
