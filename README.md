# openssl-docker

Every openssl module I found unsafely executed openssl via childprocess with external data. (very unsafe!, shell injection and what not...)

Small and quick openssl-docker module to execute openssl features inside Docker containers.

## Usage

``` js
var OpensslDocker = require('openssl-docker');
var openssl = new OpensslDocker();

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
```