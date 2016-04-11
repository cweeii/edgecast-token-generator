'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

require('source-map-support/register');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Edgecast token generation ported from ectoken_v3 */

var IV_LEN = 12;

function constructToken(bufIv, bufTag, bufCiphertext) {
  var totalLength = bufIv.length + bufTag.length + bufCiphertext.length;
  var buf = Buffer.concat([bufIv, bufCiphertext, bufTag], totalLength);

  var token = buf.toString('base64');
  token = token.replace(/\+/g, '\-');
  token = token.replace(/\//g, '\_');

  return token;
}

function ecEncrypt(bufKey, bufIv, bufExpireTime) {
  var cipher = _crypto2.default.createCipheriv('aes-256-gcm', bufKey, bufIv);
  var bufEncrypted = cipher.update(bufExpireTime);
  var bufFinal = cipher.final();
  var totalLength = bufEncrypted.length + bufFinal.length;

  bufEncrypted = Buffer.concat([bufEncrypted, bufFinal], totalLength);

  return {
    bufCiphertext: bufEncrypted,
    bufTag: cipher.getAuthTag()
  };
}

function generateIv() {
  return _crypto2.default.randomBytes(IV_LEN);
}

function generateHash(key) {
  return _crypto2.default.createHash('sha256').update(key, 'utf8').digest();
}

function generateToken(key, expireTime) {
  var bufHash = this.generateHash(key);
  var bufIv = this.generateIv();
  var cipher = this.ecEncrypt(bufHash, bufIv, new Buffer(expireTime));
  var token = this.constructToken(bufIv, cipher.bufTag, cipher.bufCiphertext);

  return token;
}

function main(argv) {
  var key = argv[2];
  var expireTime = argv[3];

  var token = this.generateToken(key, expireTime);
  console.log(token);
}

exports.default = {
  constructToken: constructToken,
  ecEncrypt: ecEncrypt,
  generateIv: generateIv,
  generateHash: generateHash,
  generateToken: generateToken,
  main: main
};
//# sourceMappingURL=ec-encrypt.js.map