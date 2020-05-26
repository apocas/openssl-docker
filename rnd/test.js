var Docker = require('dockerode');

var docker = new Docker();

var path = '/tmp';
var cmd = "openssl req -nodes -newkey rsa:2048 -keyout /stuff/domain.com.key -out /stuff/domain.com.csr -subj '/C=US/ST=California/L=San Fransisco/O=FooBar/OU=Operations/CN=foobar.com/emailAddress=info@foobar.biz';";

//cmd = "openssl req -newkey rsa:2048 -keyout /stuff/exampledomain.com.key -out /stuff/exampledomain.com.csr -subj '/C=US/ST=California/L=San Fransisco/O=Example, Inc./OU=Operations/CN=exampledomain.com/emailAddress=joe@foobar.com' -nodes"

docker.run('apocas/openssl', ['bash', '-c', cmd], process.stdout, {
  'Volumes': {
    '/stuff': {}
  },
  'Hostconfig': {
    'Binds': [path + ':/stuff'],
  }
}, function (err, data, container) {
  console.log(err);
  console.log(data.StatusCode);
});