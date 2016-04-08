import crypto from 'crypto';
import 'source-map-support/register';

/* Edgecast token generation ported from ectoken_v3 */

const IV_LEN = 12;

function constructToken (iv, tag, ciphertext) {
  const totalLength = iv.length + tag.length + ciphertext.length;
  let buf = Buffer.concat([iv, ciphertext, tag], totalLength);

  let token = buf.toString('base64');
  token = token.replace(/\+/g, '\-');
  token = token.replace(/\//g, '\_');

  return token;
}

function ecEncrypt (key, iv, expireTime) {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(expireTime);
  let final = cipher.final();
  const totalLength = encrypted.length + final.length;

  encrypted = Buffer.concat([encrypted, final], totalLength);

  return {
    ciphertext: encrypted,
    tag: cipher.getAuthTag()
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

function generateToken (expireTime, key) {
  const hash = this.generateHash(key);
  const iv = this.generateIv();
  const cipher = this.ecEncrypt(hash, iv, new Buffer(expireTime));
  const token = this.constructToken(iv, cipher.tag, cipher.ciphertext);

  return token;
}

function main (argv) {
  let key = argv[2];
  let expireTime = argv[3];

  let token = this.generateToken(expireTime, key);
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
