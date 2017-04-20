'use strict';
/* global jest describe it expect */

jest.unmock('../src/write');
const write = require('../src/write');
jest.unmock('bluebird');
const Promise = require('bluebird');


const resultObject = {auth: {client_token: 'test'}};

const vaultAuthenticator = () => Promise.resolve(resultObject);
const vaultAuth = {username: 'test', password: 'password'};
const vaultClient = {
  write: jest.fn()
}
const vaultDetails = {
  vaultClient: vaultClient,
  vaultAuth: vaultAuth,
  vaultAuthenticator
};

const key = 'test-key';
const value = 'test-value';

describe('write', () => {
  it('gets called with the correct params', () => {
    return write(vaultDetails, key, value)
    .then(() => {
      expect(vaultClient.write.mock.calls[0][0]).toEqual(key);
      expect(vaultClient.write.mock.calls[0][1]).toEqual(value);
    })
  });

  it('fails when no key is passed', () => {
    return write(vaultDetails, '', value)
    .catch((err) => {
      expect(err.toEqual('You must supply a key'));
    });
  });

  it('fails when no value is passed', () => {
    return write(vaultDetails, key, '')
    .catch((err) => {
      expect(err.toEqual('You must supply a value'));
    });
  });
});
