'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

require('source-map-support/register');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Edgecast token generation ported from ectoken_v3 */

var G_IV_LEN = 12;

function constructToken(lIv, lTag, lCiphertext) {
  var totalLength = lIv.length + lTag.length + lCiphertext.length;
  var buf = Buffer.concat([lIv, lCiphertext, lTag], totalLength);

  var token = buf.toString('base64');
  token = token.replace(/\+/g, '\-');
  token = token.replace(/\//g, '\_');

  return token;
}

function ecEncrypt(aKey, aIv, string) {
  var cipher = _crypto2.default.createCipheriv('aes-256-gcm', aKey, aIv);
  var encrypted = cipher.update(string);
  var final = cipher.final();
  var totalLength = encrypted.length + final.length;

  encrypted = Buffer.concat([encrypted, final], totalLength);

  return {
    ciphertext: encrypted,
    tag: cipher.getAuthTag()
  };
}

function generateIv() {
  return _crypto2.default.randomBytes(G_IV_LEN);
}

function generateHash(key) {
  return _crypto2.default.createHash('sha256').update(key, 'utf8').digest();
}

function generateToken(string, key) {
  var lKey = this.generateHash(key);
  var lIv = this.generateIv();
  var lCipher = this.ecEncrypt(lKey, lIv, new Buffer(string));
  var lToken = this.constructToken(lIv, lCipher.tag, lCipher.ciphertext);

  return lToken;
}

function main(argv) {
  var key = argv[2];
  var string = argv[3];

  var token = this.generateToken(string, key);
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