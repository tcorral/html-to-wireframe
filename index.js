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

// Removed CasperJS and PhantomJS installation functions - now using Puppeteer

function executeScripts() {
  var promises = [];
  scripts.forEach(function (file){
    var deferred = Q.defer(),
      spawn = require('child_process').spawn,
      install = spawn('node', [file]);
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
  console.log('Puppeteer is ready (no installation needed)');
  executeScripts()
    .then(function (){
      console.log('done');
    })
    .done();
});
