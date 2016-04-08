import crypto from 'crypto';
import 'source-map-support/register';

/* Edgecast token generation ported from ectoken_v3 */

const IV_LEN = 12;

function constructToken (iv, tag, ciphertext) {
  let totalLength = iv.length + tag.length + ciphertext.length;
  let buf = Buffer.concat([iv, ciphertext, tag], totalLength);

  let token = buf.toString('base64');
  token = token.replace(/\+/g, '\-');
  token = token.replace(/\//g, '\_');

  return token;
}

function ecEncrypt (aKey, aIv, string) {
  const cipher = crypto.createCipheriv('aes-256-gcm', aKey, aIv);
  let encrypted = cipher.update(string);
  let final = cipher.final();
  let totalLength = encrypted.length + final.length;

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

function generateToken (string, key) {
  const hash = this.generateHash(key);
  const iv = this.generateIv();
  const cipher = this.ecEncrypt(hash, iv, new Buffer(string));
  const token = this.constructToken(iv, cipher.tag, cipher.ciphertext);

  return token;
}

function main (argv) {
  let key = argv[2];
  let string = argv[3];

  let token = this.generateToken(string, key);
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
