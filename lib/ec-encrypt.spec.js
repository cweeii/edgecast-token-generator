'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require('chai');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _ecEncrypt = require('./ec-encrypt');

var _ecEncrypt2 = _interopRequireDefault(_ecEncrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('ec-encrypt', function () {
  var sandbox = void 0;

  var IV_LEN = 12;
  var algorithm = 'aes-256-gcm';
  var key = 'secret-key';
  var iv = 'some-iv';
  var string = 'some-expiration-time';
  var argv = ['node', 'filepath', key, string];

  var bufIv = new Buffer(iv);
  var bufEncrypted = new Buffer('encrypted');
  var bufFinal = new Buffer('final');
  var bufTag = new Buffer('tag');
  var bufCiphertext = new Buffer('some-ciphertext');

  beforeEach(function () {
    sandbox = _sinon2.default.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  context('#constructToken', function () {
    function generateToken() {
      var totalLength = bufIv.length + bufTag.length + bufCiphertext.length;
      var buf = Buffer.concat([bufIv, bufCiphertext, bufTag], totalLength);

      var token = buf.toString('base64');
      token = token.replace(/\+/g, '\-');
      token = token.replace(/\//g, '\_');

      return token;
    }

    it('should generate a url safe base64 encoded string', function () {
      var exptoken = generateToken();

      var token = _ecEncrypt2.default.constructToken(bufIv, bufTag, bufCiphertext);

      _chai.assert.equal(token.indexOf('\+'), -1, 'the character \'\+\' should have been replaced with \'\-\' in the token');
      _chai.assert.equal(token.indexOf('\/'), -1, 'the character \'\/\' should have been replaced with \'\_\' in the token');
      _chai.assert.equal(exptoken, token, 'returned token should have been equal to the expected token');
    });
  });

  context('#ecEncrypt', function () {
    it('should call crypto.createCipheriv and transform cipher', function () {
      var totalLength = bufEncrypted.length + bufFinal.length;
      var cipher = {
        update: sandbox.spy(function () {
          return bufEncrypted;
        }),
        final: sandbox.spy(function () {
          return bufFinal;
        }),
        getAuthTag: sandbox.spy(function () {
          return bufTag;
        })
      };
      var expReturnedCipher = {
        bufCiphertext: Buffer.concat([bufEncrypted, bufFinal], totalLength),
        bufTag: bufTag
      };
      sandbox.stub(_crypto2.default, 'createCipheriv').returns(cipher);

      var returnedCipher = _ecEncrypt2.default.ecEncrypt(key, iv, string);

      _chai.assert.deepEqual(_crypto2.default.createCipheriv.args[0], [algorithm, key, iv], 'crypto.createCipheriv should have been called with key, iv, and string');
      _chai.assert.equal(cipher.update.args[0][0], string, 'cipher.update should have been called with \'some-expieration-time\'');
      (0, _chai.assert)(cipher.final.calledOnce, 'cipher.final should have been called once');
      _chai.assert.deepEqual(expReturnedCipher, returnedCipher, 'returnedCipher should be equal to the expReturnedCipher');
    });
  });

  context('#generateIv', function () {
    it('should call crypto.randomBytes to generate a random 12 byte number', function () {
      sandbox.stub(_crypto2.default, 'randomBytes');

      _ecEncrypt2.default.generateIv();

      _chai.assert.equal(_crypto2.default.randomBytes.args[0][0], IV_LEN, 'crypto.randomBytes should have been called with 12');
    });
  });

  context('#generateToken', function () {
    it('should call generateHash, generateIv, ecEncrypt, and constructToken', function () {
      sandbox.stub(_ecEncrypt2.default, 'generateHash');
      sandbox.stub(_ecEncrypt2.default, 'generateIv');
      sandbox.stub(_ecEncrypt2.default, 'ecEncrypt').returns({});
      sandbox.stub(_ecEncrypt2.default, 'constructToken');

      _ecEncrypt2.default.generateToken('some-key', 'some-string');

      (0, _chai.assert)(_ecEncrypt2.default.generateHash.calledOnce, 'generateHmac should have been called once');
      _chai.assert.equal(_ecEncrypt2.default.generateHash.args[0][0], 'some-key', 'generateHash should have been called with \'some-key\'');
      (0, _chai.assert)(_ecEncrypt2.default.generateIv.calledOnce, 'generateIv should have been called once');
      (0, _chai.assert)(_ecEncrypt2.default.ecEncrypt.calledOnce, 'ecEncrypt should have been called once');
      (0, _chai.assert)(_ecEncrypt2.default.constructToken.calledOnce, 'constructToken should have been called once');
    });
  });

  context('#main', function () {
    it('should pass the correct parameters into #generateToken', function () {
      sandbox.stub(_ecEncrypt2.default, 'generateToken').returns('stub returned');
      var keyLength = argv[2].length;
      var stringLength = argv[3].length;
      var tokenLength = (stringLength + 16 * 2) * 4;
      var args = [key, string];

      _ecEncrypt2.default.main(argv);

      _chai.assert.deepEqual(_ecEncrypt2.default.generateToken.args[0], args, 'generateToken should have been called with token length, string, string length, key, and key length');
    });
  });
});
//# sourceMappingURL=ec-encrypt.spec.js.map