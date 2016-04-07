import crypto from 'crypto';

const G_IV_LEN = 12;

function constructToken(lIv, lTag, lCiphertext) {
  let totalLength = lIv.length + lTag.length + lCiphertext.length;
  let token = Buffer.concat([lIv, lCiphertext, lTag], totalLength);
  token = token.toString('base64')
  token = encodeURI(token);

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

function generateHmac(key) {
  return crypto.createHmac('sha256', key).digest();
}

function generateToken(string, key) {
  const lKey = this.generateHmac(key);
  const lIv = this.generateIv();
  const lCiphertext = this.ecEncrypt(lKey, lIv, new Buffer(string));
  const lToken = this.constructToken(lIv, lCiphertext.tag, lCiphertext.ciphertext);

  console.log('ciphertext', lCiphertext);
  console.log('lToken', lToken);
  return lToken;
}

function main (argv) {
  let key = argv[2];
  let string = argv[3];

  console.log('key', key);
  console.log('string', string);
  this.generateToken(string, key);
}

export default {
  main,
  generateToken,
  generateHmac,
  generateIv,
  ecEncrypt,
  constructToken
}
