'use strict';
/* global jest describe it expect */

jest.unmock('../src/register');
const register = require('../src/register');
jest.unmock('bluebird');
const Promise = require('bluebird');

const username = 'John';
const password = 'P@ssw0rd!';

describe('register', () => {
  const vault = {
    userpassLogin: jest.fn(),
    write: jest.fn()
  }
  const vaultAuth =  { username: username, password: password };
  const appId = '7940020b-b965-4429-b61a-dd808595bd2f';
  const uuid = 'd995c658-f9db-441c-9fb0-40ecf42d4264';

  it('logs into the vault client when given valid credentials ', () => {
    const expectedToken = 'test-token';
    const loginResult = {
      auth : {
        client_token: expectedToken
      }
    }
    vault.userpassLogin.mockReturnValue(new Promise(resolve => resolve(loginResult)))
    vault.write.mockReturnValue(new Promise(resolve => resolve()));

    return register(vault, vaultAuth, appId, uuid)
    .then( () => {
      expect(vault.userpassLogin.mock.calls[0][0]).toEqual({
        username: username,
        password: password
      });
      expect(vault.token).toBe(expectedToken);
    });
  });

  // it('sets the uuid for the given app', () => {
  //   register(vault, vaultAuth, appId, uuid);
  //   expect(vault.post.mock.calls[0][0]).toEqual(`auth/app-id/map/user-id/${uuid}`);
  //   expect(vault.post.mock.calls[0][1]).toEqual({
  //     value: appId
  //   });
  // });
  //
  // it('sets calls the done callback when finished', () => {
  //   const done = jest.fn();
  //   register(vault, vaultAuth, appId, uuid, done);
  //   expect(done.mock.calls.length).toEqual(1);
  // });
});
