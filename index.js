require('babel-polyfill');

var ecEncrypt = require('./lib/ec-encrypt');
ecEncrypt.default.main(process.argv);
