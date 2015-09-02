var npm = require('npm');
var checkcommand = require('checkcommand');
var arrayToString = require('./lib/utils').arrayToString;
var spawn = require('child_process').spawn;
var Q = require('q');
var fs = require('fs');
var scripts = process.env.npm_config_scripts ? process.env.npm_config_scripts.split(',') : ['./lib/screenshots/index.js'];
var urls = process.env.npm_config_urls.split(',');

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
