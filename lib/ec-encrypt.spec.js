'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require('chai');

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

      var args = [tokenLength, string, stringLength, key, keyLength];

      _ecEncrypt2.default.main(argv);
      _chai.assert.deepEqual(_ecEncrypt2.default.generateToken.args[0], args, 'generateToken should have been called with token length, string, string length, key, and key length');
    });
  });

  context('#generateToken', function () {
    it('should do something', function () {});
  });
});
//# sourceMappingURL=ec-encrypt.spec.js.map