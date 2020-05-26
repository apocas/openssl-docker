var assert = require('assert');

var OpenSSL = require('../lib/openssl');

var openssl = new OpenSSL();

openssl.csr('exampledomain.com', {
	outputDir: __dirname,
	read: true,
	company: 'Example, Inc.',
	email: 'joe@foobar.com'
}, function(err, keys){
	console.log('CSR created!')
	console.log('key: '+keys.private);
	console.log('csr: '+keys.csr);
});