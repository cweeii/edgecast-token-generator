import crypto from 'crypto';
// require('source-map-support/register');

const G_IV_LEN = 12;

function constructToken(lIv, lTag, lCiphertext) {
  let totalLength = lIv.length + lTag.length + lCiphertext.length;
  let token = Buffer.concat([lIv, lCiphertext, lTag], totalLength);

  token = token.toString('base64');
  token = token.replace(/\+/g, '\-');
  token = token.replace(/\//g, '\_');

  return token;
}

function ecEncrypt(aKey, aIv, string) {
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

function generateIv() {
  return crypto.randomBytes(G_IV_LEN);
}

function generateHash(key) {
  return crypto.createHash('sha256')
    .update(key, 'utf8')
    .digest();
}

function generateToken(string, key) {
  const lKey = this.generateHash(key);
  const lIv = this.generateIv();
  const lCiphertext = this.ecEncrypt(lKey, lIv, new Buffer(string));
  const lToken = this.constructToken(lIv, lCiphertext.tag, lCiphertext.ciphertext);

  return lToken;
}

function main (argv) {
  let key = argv[2];
  let string = argv[3];

  let token = this.generateToken(string, key);
  console.log(token);
}

export default {
  main,
  generateToken,
  generateHash,
  generateIv,
  ecEncrypt,
  constructToken
}
