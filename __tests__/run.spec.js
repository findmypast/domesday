/* global jest describe it expect */

jest.mock('uuid');
const uuid = require('uuid');
jest.mock('node-vault');
const vault = require('node-vault');
jest.mock('../src/log');
const log = require('../src/log');
jest.unmock('../src/run');
const run = require('../src/run');

describe('run', () => {
  const inputHost = 'test.host';
  const inputPort = 8000;
  const inputUser = 'user';
  const inputPass = 'password';
  const inputProtocol = 'http';
  const inputUri = `${inputProtocol}://${inputUser}:${inputPass}@${inputHost}`;
  const inputAppId = 'app';

  const expectedUUID = '6ded30dc-9574-41bb-96a6-8d19b377bb9e'

  it('logs the generated UUID to stdout', () => {
    uuid.v4.mockReturnValue(expectedUUID);
    run(inputUri, inputAppId);
    expect(log.out.mock.calls[0]).to.equal(expectedUUID);
  });
  it('sends the generated UUID to Vault', () => {
    uuid.v4.mockReturnValue(expectedUUID);
    run(inputUri, inputAppId);
    expect(vault.write.mock.calls[0][1].value).to.equal(expectedUUID);
  });
})
