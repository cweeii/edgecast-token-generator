require('babel-polyfill');
require('source-map-support/register');

var ecEncrypt = require('./lib/ec-encrypt');
ecEncrypt.default.main(process.argv);
