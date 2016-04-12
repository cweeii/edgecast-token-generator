import crypto from 'crypto';
import 'source-map-support/register';

/* Edgecast token generation ported from ectoken_v3 */

const IV_LEN = 12;

function constructToken (bufIv, bufTag, bufCiphertext) {
  let totalLength = bufIv.length + bufTag.length + bufCiphertext.length;
  let buf = Buffer.concat([bufIv, bufCiphertext, bufTag], totalLength);

  let token = buf.toString('base64');
  token = token.replace(/\+/g, '\-');
  token = token.replace(/\//g, '\_');

  return token;
}

function ecEncrypt (bufKey, bufIv, bufExpireTime) {
  let cipher = crypto.createCipheriv('aes-256-gcm', bufKey, bufIv);
  let bufEncrypted = cipher.update(bufExpireTime);
  let bufFinal = cipher.final();
  let totalLength = bufEncrypted.length + bufFinal.length;

  bufEncrypted = Buffer.concat([bufEncrypted, bufFinal], totalLength);

  return {
    bufCiphertext: bufEncrypted,
    bufTag: cipher.getAuthTag()
  };
}

function generateIv () {
  return crypto.randomBytes(IV_LEN);
}

function generateHash (key) {
  return crypto.createHash('sha256')
    .update(key, 'utf8')
    .digest();
}

function generateToken (key, expireTime) {
  key = String(key);
  expireTime = String(expireTime);

  const bufHash = this.generateHash(key);
  const bufIv = this.generateIv();
  const cipher = this.ecEncrypt(bufHash, bufIv, new Buffer(expireTime));
  const token = this.constructToken(bufIv, cipher.bufTag, cipher.bufCiphertext);

  return token;
}

function main (argv) {
  const key = argv[2];
  const expireTime = argv[3];

  let token = this.generateToken(key, expireTime);
  console.log(token);
}

export default {
  constructToken,
  ecEncrypt,
  generateIv,
  generateHash,
  generateToken,
  main
}
