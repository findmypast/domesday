'use strict'
/* global jest describe it expect */

jest.mock('../src/write');
const write = require('../src/write');
jest.unmock('bluebird');
const Promise = require('bluebird');
jest.unmock('../src/add-key-value');
const addKeyValue = require('../src/add-key-value');

const username = 'John';
const password = 'P@ssw0rd!';

write.mockReturnValue(Promise.resolve());

describe('add-key-value', () => {
  const key = 'testKey';
  const value = 'testValue';
  const uri = `http://${username}:${password}@test.com`;
  const opts = {};

  it('should write with the correct values', () => {
    return addKeyValue(uri, key, value, opts)
    .then(() => {
      expect(write.mock.calls[0][1]).toEqual(key);
      expect(write.mock.calls[0][2]).toEqual({value: value});
    });
  });
});
