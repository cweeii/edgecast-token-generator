'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require('chai');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _ecEncrypt = require('./ec-encrypt');

var _ecEncrypt2 = _interopRequireDefault(_ecEncrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('ecEncrypt', function () {
  var sandbox = void 0;

  var key = 'key';
  var string = 'some-string';
  var argv = ['node', 'filepath', key, string];

  beforeEach(function () {
    sandbox = _sinon2.default.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  context('#main', function () {
    it('should pass the correct parameters into #generateToken', function () {
      sandbox.stub(_ecEncrypt2.default, 'generateToken');

      var keyLength = argv[2].length;
      var stringLength = argv[3].length;

      var tokenLength = (stringLength + 16 * 2) * 4;

      var args = [string, key];

      _ecEncrypt2.default.main(argv);
      _chai.assert.deepEqual(_ecEncrypt2.default.generateToken.args[0], args, 'generateToken should have been called with token length, string, string length, key, and key length');
    });
  });

  context('#generateToken', function () {
    it('should call generateHash, generateIv, ecEncrypt, and constructToken', function () {
      sandbox.stub(_ecEncrypt2.default, 'generateHash');
      sandbox.stub(_ecEncrypt2.default, 'generateIv');
      sandbox.stub(_ecEncrypt2.default, 'ecEncrypt').returns({});
      sandbox.stub(_ecEncrypt2.default, 'constructToken');

      _ecEncrypt2.default.generateToken('some-string', 'some-key');

      (0, _chai.assert)(_ecEncrypt2.default.generateHash.calledOnce, 'generateHmac should have been called once');
      _chai.assert.equal(_ecEncrypt2.default.generateHash.args[0][0], 'some-key', 'generateHash should have been called with \'some-key\'');

      (0, _chai.assert)(_ecEncrypt2.default.generateIv.calledOnce, 'generateIv should have been called once');
      (0, _chai.assert)(_ecEncrypt2.default.ecEncrypt.calledOnce, 'ecEncrypt should have been called once');
      (0, _chai.assert)(_ecEncrypt2.default.constructToken.calledOnce, 'constructToken should have been called once');
    });
  });

  context('#generateIv', function () {});
});
//# sourceMappingURL=ec-encrypt.spec.js.map