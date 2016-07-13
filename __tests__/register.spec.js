'use strict';
/* global jest describe it expect */

jest.unmock('../src/register');
const register = require('../src/register');

const username = 'John';
const password = 'P@ssw0rd!';

describe('register', () => {

  const vault = {
    login: jest.fn().mockImplementation((_, callback) => callback()),
    post: jest.fn().mockImplementation((url, data, config, callback) => callback())
  };
  const vaultAuth = [username, password];
  const appId = '7940020b-b965-4429-b61a-dd808595bd2f';
  const uuid = 'd995c658-f9db-441c-9fb0-40ecf42d4264';

  it('logs into the vault client', () => {
    register(vault, vaultAuth, appId, uuid);
    expect(vault.login.mock.calls[0][0]).toEqual({
      backend: 'userpass',
      options: {
        username: username,
        password: password
      }
    });
  });

  it('sets the uuid for the given app', () => {
    register(vault, vaultAuth, appId, uuid);
    expect(vault.post.mock.calls[0][0]).toEqual(`auth/app-id/map/user-id/${uuid}`);
    expect(vault.post.mock.calls[0][1]).toEqual({
      value: appId
    });
  });

  it('sets calls the done callback when finished', () => {
    const done = jest.fn();
    register(vault, vaultAuth, appId, uuid, done);
    expect(done.mock.calls.length).toEqual(1);
  });
});
