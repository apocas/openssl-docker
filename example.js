var OpenSSL = require('./lib/openssl');

var openssl = new OpenSSL();

openssl.csr('exampledomain.com', {
  outputDir: '/tmp/',
  read: true,
  company: 'Example, Inc.',
  email: 'joe@foobar.com'
}, function (err, keys) {
  if (err) {
    console.log(err)
  } else {
    console.log('CSR created!')
    console.log('key: ' + keys.key);
    console.log('csr: ' + keys.csr);
  }
});

openssl.pfx('exampledomain.com', {
  inputDir: '/tmp/',
  pkName: 'exampledomain.com.pk',
  crtName: 'exampledomain.com.crt',
  outputDir: '/tmp/',
  certfileName: 'exampledomain.com.cert',
  password: 'mypassword'
}, function (err, outputPath) {
  if (err) {
    console.log(err);
  } else {
    console.log(undefined, outputPath);
  }
});

