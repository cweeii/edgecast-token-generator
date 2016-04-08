import sinon from 'sinon';
import { assert } from 'chai';
import crypto from 'crypto';

import ecEncrypt from './ec-encrypt';

describe('ec-encrypt', () => {
  let sandbox;

  const IV_LEN = 12;
  const algorithm = 'aes-256-gcm';
  const key = 'secret-key';
  const iv = 'some-iv';
  const string = 'some-expiration-time';
  const argv = ['node', 'filepath', key, string];

  const bufIv = new Buffer(iv);
  const bufEncrypted = new Buffer('encrypted');
  const bufFinal = new Buffer('final');
  const bufTag = new Buffer('tag');
  const bufCiphertext = new Buffer('some-ciphertext');

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  context('#constructToken', () => {
    function generateToken() {
      let totalLength = bufIv.length + bufTag.length + bufCiphertext.length;
      let buf = Buffer.concat([bufIv, bufCiphertext, bufTag], totalLength);

      let token = buf.toString('base64');
      token = token.replace(/\+/g, '\-');
      token = token.replace(/\//g, '\_');

      return token;
    }

    it('should generate a url safe base64 encoded string', () => {
      let exptoken = generateToken();

      let token = ecEncrypt.constructToken(bufIv, bufTag, bufCiphertext);
      assert.equal(token.indexOf('\+'), -1, 'the character \'\+\' should have been replaced with \'\-\' in the token');
      assert.equal(token.indexOf('\/'), -1, 'the character \'\/\' should have been replaced with \'\_\' in the token');
      assert.equal(exptoken, token, 'returned token should have been equal to the expected token');
    });
  });

  context('#ecEncrypt', () => {
    it('should call crypto.createCipheriv and transform cipher', () => {
      let totalLength = bufEncrypted.length + bufFinal.length;

      let cipher = {
        update: sandbox.spy(() => {
          return bufEncrypted;
        }),
        final: sandbox.spy(() => {
          return bufFinal;
        }),
        getAuthTag: sandbox.spy(() => {
          return bufTag;
        })
      };
      let expReturnedCipher = {
        ciphertext: Buffer.concat([bufEncrypted, bufFinal], totalLength),
        tag: bufTag
      };

      sandbox.stub(crypto, 'createCipheriv').returns(cipher);

      let returnedCipher = ecEncrypt.ecEncrypt(key, iv, string);

      assert.deepEqual(crypto.createCipheriv.args[0], [algorithm, key, iv], 'crypto.createCipheriv should have been called with key, iv, and string');
      assert.equal(cipher.update.args[0][0], string, 'cipher.update should have been called with \'some-expieration-time\'');
      assert(cipher.final.calledOnce, 'cipher.final should have been called once');

      assert.deepEqual(expReturnedCipher, returnedCipher, 'returnedCipher should be equal to the expReturnedCipher');
    });
  });

  context('#generateIv', () => {
    it('should call crypto.randomBytes to generate a random 12 byte number', () => {
      sandbox.stub(crypto, 'randomBytes')

      ecEncrypt.generateIv();

      assert.equal(crypto.randomBytes.args[0][0], IV_LEN, 'crypto.randomBytes should have been called with 12');
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
