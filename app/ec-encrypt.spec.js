import sinon from 'sinon';
import { assert } from 'chai';

import ecEncrypt from './ec-encrypt';

describe('ecEncrypt', () => {
  let sandbox;

  const key = 'key';
  const string = 'some-string';
  const argv = ['node', 'filepath', key, string];

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  context('#main', () => {
    it('should pass the correct parameters into #generateToken', () =>{
      sandbox.stub(ecEncrypt, 'generateToken');

      let keyLength = argv[2].length;
      let stringLength = argv[3].length;

      let tokenLength = (stringLength + (16 * 2)) * 4;

      let args = [tokenLength, string, stringLength, key, keyLength];

      ecEncrypt.main(argv);
      assert.deepEqual(ecEncrypt.generateToken.args[0], args, 'generateToken should have been called with token length, string, string length, key, and key length');
    });
  });

  context('#generateToken', () => {
    it('should do something', () => {
    });
  });
});
