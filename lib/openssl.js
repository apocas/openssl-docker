var Docker = require('dockerode'),
  fs = require('fs'),
  os = require('os');

var Openssl = function (opts) {
  this.docker = new Docker(opts);
}

//heavily adapted and converted to Docker from https://github.com/ericvicenti/csr-gen
Openssl.prototype.csr = function (domain, options, callback) {

  callback || (callback = function () { });

  options || (options = {});
  if (!options.outputDir) options.outputDir = os.tmpdir();
  if (!options.company) options.company = domain;
  if (!options.country) options.country = 'US';
  if (!options.state) options.state = 'California';
  if (!options.city) options.city = 'San Fransisco';
  if (!options.division) options.division = 'Operations';
  if (!options.email) options.email = '';
  if (!options.password) options.password = '';
  if (!options.keyName) options.keyName = domain + '.key';
  if (!options.csrName) options.csrName = domain + '.csr';

  options.domain = domain;

  var keyPath = options.outputDir + options.keyName;
  var csrPath = options.outputDir + options.csrName;
  var containerKeyPath = '/stuff/' + options.keyName;
  var containerCSRPath = '/stuff/' + options.csrName;

  var subj = this._createSubjectString(options);

  var opts = [
    'req',
    '-newkey', 'rsa:2048',
    '-keyout', containerKeyPath,
    '-out', containerCSRPath,
    '-subj', '\'' + subj + '\''
  ];

  opts.push('-nodes');

  var cmd = 'openssl';
  for (let i = 0; i < opts.length; i++) {
    cmd += ' ' + opts[i];
  }
  
  if (options.destroy === true) {
    cmd += '; chmod 666 /stuff/*';
  }

  if(options.stdout !== undefined) {
    console.log(cmd);
  }

  this.docker.run(options.dockerImage || 'apocas/openssl', ['bash', '-c', cmd], options.stdout, {
    'Volumes': {
      '/stuff': {}
    },
    'Hostconfig': {
      'Binds': [options.outputDir + ':/stuff'],
    }
  }, function (err, data, container) {
    if (err) {
      return callback(err);
    }
    if (data.StatusCode !== 0) {
      return callback('exit code ' + data.StatusCode);
    }

    if (options.read === true) {
      var output = {};
      fs.readFile(keyPath, { encoding: 'utf8' }, function (err, key) {
        if (err) return callback(err);

        output.key = key;

        if (options.destroy === true) {
          fs.unlink(keyPath, function (err) {
            if (err) return callback(err);
            readCSR();
          });
        } else {
          readCSR();
        }

        function readCSR() {
          fs.readFile(csrPath, { encoding: 'utf8' }, function (err, csr) {
            if (err) return callback(err);
            output.csr = csr;
            if (options.destroy === true) fs.unlink(csrPath, function (err) {
              if (err) return callback(err);
              return callback(undefined, output);
            });
            else callback(undefined, output);
          });
        }

      });
    } else callback(undefined, {});
  });
};

Openssl.prototype._createSubjectString = function (options) {

  var subj =
    '/C=' + options.country +
    '/ST=' + options.state +
    '/L=' + options.city +
    '/O=' + options.company +
    '/OU=' + options.division +
    '/CN=' + options.domain +
    '/emailAddress=' + options.email;

  return subj;
};

Openssl.prototype.pfx = function (domain, options, callback) {
  options || (options = {});
  callback || (callback = function () { });

  var mandatory = ['inputDir', 'crtName', 'pkName'];
  var missingOption = mandatory.find(function (o) {
    return options[o] === undefined;
  });
  if (missingOption) {
    return callback('missing mandatory option "' + missingOption + '"');
  }

  if (!options.pfxName) options.pfxName = domain + '.pfx';
  if (!options.outputDir) options.outputDir = os.tmpdir();
  if (!options.password) options.password = '';

  var crtPath = options.inputDir + options.crtName;
  var pkPath = options.inputDir + options.pkName;
  var containerCrtPath = '/input/' + options.crtName;
  var containerPkPath = '/input/' + options.pkName;

  var pfxPath = options.outputDir + options.pfxName;
  var containerPfxPath = '/output/' + options.pfxName;

  var opts = [
    'pkcs12',
    '-export',
    '-in', containerCrtPath,
    '-inkey', containerPkPath,
    '-out', containerPfxPath,
    '-password', options.password
  ];

  if (options.certfileName) {
    var certfilePath = '/input/' + options.certfileName;
    var additional = [
      '-certfile',
      certfilePath
    ];
    opts = opts.concat(additional);
  }

  var cmd = 'openssl';
  for (let i = 0; i < opts.length; i++) {
    cmd += ' ' + opts[i];
  }

  if (options.stdout !== undefined) {
    console.log(cmd);
  }

  this.docker.run(options.dockerImage || 'apocas/openssl', ['bash', '-c', cmd], options.stdout, {
    'Volumes': {
      '/input': {},
      '/output': {}
    },
    'Hostconfig': {
      'Binds': [
        options.inputDir + ':/input',
        options.outputDir + ':/output'
      ],
    }
  }, function (err, data, container) {
    if (err) {
      return callback(err);
    }
    if (data.StatusCode !== 0) {
      return callback('exit code ' + data.StatusCode);
    }

    callback(undefined, pfxPath);
  });
};

module.exports = Openssl;
