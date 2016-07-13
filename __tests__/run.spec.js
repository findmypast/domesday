/* global jest describe beforeEach it expect */

jest.mock('uuid');
const uuid = require('uuid');
jest.mock('vault-client');
const Vault = require('vault-client');
jest.mock('../src/log');
const log = require('../src/log');
jest.mock('../src/register');
const register = require('../src/register');
jest.unmock('../src/run');
const run = require('../src/run');

describe('run', () => {
  const inputHost = 'test.host';
  const inputPort = 8000;
  const inputUser = 'user';
  const inputPass = 'password';
  const inputProtocol = 'http:';
  const inputUri = `${inputProtocol}//${inputUser}:${inputPass}@${inputHost}:${inputPort}`;
  const inputAppId = 'app';

  const expectedUUID = '6ded30dc-9574-41bb-96a6-8d19b377bb9e'

  describe('when everything works fine', () => {
    beforeEach(() => {
      register.mockImplementation((vault, vaultAuth, appId, userId, callback) => callback());
    });

    it('logs the generated UUID to stdout', () => {
      uuid.v4.mockReturnValue(expectedUUID);
      run(inputUri, inputAppId);
      expect(log.out.mock.calls[0][0]).toBe(expectedUUID);
    });
    it('generates a Vault client with the right URL', () => {
      run(inputUri, inputAppId);
      expect(Vault.mock.calls[0][0].url).toBe(`${inputProtocol}//${inputHost}:${inputPort}`);
    });
    it('registers the generated UUID to the AppID provided', () => {
      uuid.v4.mockReturnValue(expectedUUID);
      run(inputUri, inputAppId);
      expect(register.mock.calls[0][0]).toEqual(Vault.mock.instances[0]);
      expect(register.mock.calls[0][1]).toEqual([inputUser, inputPass]);
      expect(register.mock.calls[0][2]).toEqual(inputAppId);
      expect(register.mock.calls[0][3]).toEqual(expectedUUID);
    });
  });

  describe('when register returns an error', () => {
    const errorMsg = 'Test Error';
    beforeEach(() => {
      register.mockImplementation((vault, vaultAuth, appId, userId, callback) => callback(new Error(errorMsg)));
    });

    it('throws the error', () => {
      expect(() => run(inputUri, inputAppId)).toThrow(new Error(errorMsg));
    });
  });
})
