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

function constructToken(iv, tag, ciphertext) {
  var totalLength = iv.length + tag.length + ciphertext.length;
  var buf = Buffer.concat([iv, ciphertext, tag], totalLength);

  var token = buf.toString('base64');
  token = token.replace(/\+/g, '\-');
  token = token.replace(/\//g, '\_');

  return token;
}

function ecEncrypt(key, iv, expireTime) {
  var cipher = _crypto2.default.createCipheriv('aes-256-gcm', key, iv);
  var encrypted = cipher.update(expireTime);
  var final = cipher.final();
  var totalLength = encrypted.length + final.length;

  encrypted = Buffer.concat([encrypted, final], totalLength);

  return {
    ciphertext: encrypted,
    tag: cipher.getAuthTag()
  };
}

function generateIv() {
  return _crypto2.default.randomBytes(IV_LEN);
}

function generateHash(key) {
  return _crypto2.default.createHash('sha256').update(key, 'utf8').digest();
}

function generateToken(expireTime, key) {
  var hash = this.generateHash(key);
  var iv = this.generateIv();
  var cipher = this.ecEncrypt(hash, iv, new Buffer(expireTime));
  var token = this.constructToken(iv, cipher.tag, cipher.ciphertext);

  return token;
}

function main(argv) {
  var key = argv[2];
  var expireTime = argv[3];

  var token = this.generateToken(expireTime, key);
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