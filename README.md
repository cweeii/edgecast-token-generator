# Edgecast Token Generator
This is the Edgecast token generator written in javascript.  It is ported over from ectoken_v3.c.

## Usage
`import ecEncrypt from 'ec-encrypt'`

`ecEncrypt(key, expireTime);`

Parameters: 
  * key: secret key (string)
  * expireTime: expiration epoch time of token (string)

Returns: 
  * a token in string format

## Development
1) `npm install`

2) `npm run watch-js`

3) `npm run watch-test`

4) `npm run encrypt <key> <expireTime>`
