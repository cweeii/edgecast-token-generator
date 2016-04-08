import sinon from 'sinon';
import { assert } from 'chai';
import crypto from 'crypto';

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

  context('#constructToken', () => {

  });

  context('#ecEncrypt', () => {
    it('should call crypto.createCipheriv and transform cipher', () => {
      let algorithm = 'some-algorithm';
      let key = 'some-key';
      let iv = 'some-iv';
      let string = 'some-expiration-time';
      let algorithm = 'aes-256-gcm';
      let cipher = {
        update: sandbox.spy(() => {
          return new Buffer('encrypted');
        }),
        final: sandbox.spy(() => {
          return new Buffer('final');
        }),
        getAuthTag: sandbox.spy(() => {
          return new Buffer('tag');
        })
      }
      sandbox.stub(crypto, 'createCipheriv').returns(cipher);

      ecEncrypt.ecEncrypt(key, iv, string);

      assert.deepEqual(crypto.createCipheriv.args[0], [algorithm, key, iv], 'crypto.createCipheriv should have been called with key, iv, and string');
    });
  });

  context('#generateIv', () => {
    it('should call crypto.randomBytes to generate a random 12 byte number', () => {
      sandbox.stub(crypto, 'randomBytes')

      ecEncrypt.generateIv();

      assert.equal(crypto.randomBytes.args[0][0], 12, 'crypto.randomBytes should have been called with 12');
    })
  });

  context('#generateToken', () => {
    it('should call generateHash, generateIv, ecEncrypt, and constructToken', () => {
      sandbox.stub(ecEncrypt, 'generateHash');
      sandbox.stub(ecEncrypt, 'generateIv');
      sandbox.stub(ecEncrypt, 'ecEncrypt').returns({});
      sandbox.stub(ecEncrypt, 'constructToken');

      ecEncrypt.generateToken('some-string', 'some-key');

      assert(ecEncrypt.generateHash.calledOnce, 'generateHmac should have been called once');
      assert.equal(ecEncrypt.generateHash.args[0][0], 'some-key', 'generateHash should have been called with \'some-key\'');

      assert(ecEncrypt.generateIv.calledOnce, 'generateIv should have been called once');
      assert(ecEncrypt.ecEncrypt.calledOnce, 'ecEncrypt should have been called once');
      assert(ecEncrypt.constructToken.calledOnce, 'constructToken should have been called once');
    });
  });

  context('#main', () => {
    it('should pass the correct parameters into #generateToken', () => {
      sandbox.stub(ecEncrypt, 'generateToken').returns('stub returned');

      let keyLength = argv[2].length;
      let stringLength = argv[3].length;

      let tokenLength = (stringLength + (16 * 2)) * 4;

      let args = [string, key];

      ecEncrypt.main(argv);
      assert.deepEqual(ecEncrypt.generateToken.args[0], args, 'generateToken should have been called with token length, string, string length, key, and key length');
    });
  });
});
