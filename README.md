# Edgecast Token Generator
This is the Edgecast token generator written in javascript.  It is ported over from ectoken_v3.c.

## Usage
es2015:
```javascript
import ecEncrypt from 'edgecast-token-generator';
ecEncrypt.generateToken(key, expireTime);
```

or using es5:
```javascript
var ecEncrypt = require('edgecast-token-generator');
ecEncrypt.defaults.generateToken(key, expireTime);
```

Parameters: 
  * key: secret key (string or number)
  * expireTime: expiration epoch time of token (string or number)

Returns: 
  * a token in string format

## Development
1) `npm install`

2) `npm run watch-js`

3) `npm run watch-test`

4) `npm run encrypt <key> <expireTime>`
