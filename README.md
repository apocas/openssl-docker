# openssl-docker

Small and quick openssl-docker module to execute openssl features inside Docker containers.

## Installation

`npm install openssl-docker`

## Usage

### Getting started

``` js
var OpensslDocker = require('openssl-docker');
var openssl = new OpensslDocker();

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
```

## Tests

 * `docker pull apocas/openssl` to prepare your system for the tests.
 * Tests are implemented using `mocha` and `chai`. Run them with `npm test`.

## Examples

Check the examples folder for more specific use cases examples.

## License

Pedro Dias - [@pedromdias](https://twitter.com/pedromdias)

Licensed under the Apache license, version 2.0 (the "license"); You may not use this file except in compliance with the license. You may obtain a copy of the license at:

    http://www.apache.org/licenses/LICENSE-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the license is distributed on an "as is" basis, without warranties or conditions of any kind, either express or implied. See the license for the specific language governing permissions and limitations under the license.
