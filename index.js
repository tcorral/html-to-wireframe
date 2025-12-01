var npm = require('npm');
var checkcommand = require('checkcommand');
var arrayToString = require('./lib/utils').arrayToString;
var spawn = require('child_process').spawn;
var Q = require('q');
var fs = require('fs');

// Parse command line arguments
function parseArgs() {
  var args = {};
  process.argv.slice(2).forEach(function(arg) {
    if (arg.indexOf('--') === 0) {
      var parts = arg.substring(2).split('=');
      if (parts.length === 2) {
        args[parts[0]] = parts[1];
      }
    }
  });
  return args;
}

var parsedArgs = parseArgs();
var scripts = parsedArgs.scripts ? parsedArgs.scripts.split(',') : ['./lib/screenshots/index.js'];
var urls = parsedArgs.urls ? parsedArgs.urls.split(',') : [];

function installCasper() {
  var deferred = Q.defer();
  var spawn = require('child_process').spawn,
    install;
  checkcommand.ensure('casperjs', 'CasperJS does not exist in your system but we will install it for you.')
    .then(function(){
      console.log('CasperJS is already installed in your system.');
      deferred.resolve(0);
    })
    .catch(function (error){
      install = spawn('npm', ['install', '-g', 'casperjs@1.1.0-beta3']);
      console.log('installing casperjs');

      install.stdout.on('data', function (data) {
        console.log(data.toString());
        deferred.notify(data);
      });

      install.stderr.on('data', function (data) {
        console.log(data.toString());
      });

      install.on('exit', function (code) {
        console.log('child process exited with code ' + code);
        deferred.resolve(code);
      });
    });

  return deferred.promise;
}

function installPhantom() {
  var deferred = Q.defer();
  var spawn = require('child_process').spawn,
    install;
  checkcommand.ensure('phantomjs', 'PhantomJS does not exist in your system but we will install it for you.')
    .then(function(){
      console.log('PhantomJS is already installed in your system.');
      deferred.resolve(0);
    })
    .catch(function (error){
      install = spawn('npm', ['install', '-g', 'phantomjs']);
      console.log('installing phantomjs');

      install.stdout.on('data', function (data) {
        console.log(data.toString());
        deferred.notify(data);
      });

      install.stderr.on('data', function (data) {
        console.log(data.toString());
      });

      install.on('exit', function (code) {
        console.log('child process exited with code ' + code);
        deferred.resolve(code);
      });
    });

  return deferred.promise;
}

function executeScripts() {
  var promises = [];
  scripts.forEach(function (file){
    var deferred = Q.defer(),
      spawn = require('child_process').spawn,
      install    = spawn('casperjs', [file]);
    console.log('executing script ' + file);

    install.stdout.on('data', function (data) {
      console.log(data.toString());
      deferred.notify(data);
    });

    install.stderr.on('data', function (data) {
      console.log(data.toString());
    });

    install.on('exit', function (code) {
      console.log('child process exited with code ' + code);
      deferred.resolve(code);
    });
    promises.push(deferred.promise);
  });
  return Q.all(promises);
}

fs.writeFile('./lib/urls/index.js', 'module.exports = '+ arrayToString(urls), function () {
  installPhantom()
    .then(function () {
      installCasper()
        .then(function(){
          executeScripts()
            .then(function (){
              console.log('done');
            })
            .done();
        });
    });
});
