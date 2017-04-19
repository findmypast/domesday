'use strict';
/* global jest describe it expect */

jest.mock('../src/write');
const write = require('../src/write');

jest.unmock('../src/register');
const register = require('../src/register');
jest.unmock('bluebird');
const Promise = require('bluebird');

const username = 'John';
const password = 'P@ssw0rd!';

write.mockReturnValue(Promise.resolve());

describe('register', () => {
  const vaultDetails = {
    vaultAuth: { username: username, password: password }
  };
  const appUser = '7940020b-b965-4429-b61a-dd808595bd2f';
  const appPassword = 'd995c658-f9db-441c-9fb0-40ecf42d4264';
  const appPolicy = 'test-policy';

  it('sets the password for the given user', () => {
    return register(vaultDetails, appUser, appPassword, appPolicy)
    .then(() => {
      expect(write.mock.calls[0][1]).toEqual(`auth/userpass/users/${appUser}`);
      expect(write.mock.calls[0][2]).toEqual({ password: appPassword, policies: appPolicy });
    });
  });
});
