var assert = require('assert');

var OpenSSL = require('../lib/openssl');

var openssl = new OpenSSL();

describe('Openssl', function () {
  it('should generate an CSR', function () {
    openssl.csr('exampledomain.com', {
      outputDir: '/tmp/',
      read: true,
      company: 'Example, Inc.',
      email: 'joe@foobar.com'
    }, function (err, keys) {
      assert.ok(keys.key);
      assert.ok(keys.csr);
    });
  });
});

