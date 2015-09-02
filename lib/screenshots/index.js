var viewports = require('./../viewports/index');
var urls = require('./../urls/index');
urls.forEach(function (url) {
  var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    clientScripts: ['lib/wirify/index.js']
  });

  casper.start(url, function (){
    this.echo('Current location is ' + this.getCurrentUrl(), 'info');
  });

  casper.each(viewports, function (casper, viewport) {
    this.then(function () {
      this.viewport(parseInt(viewport["Portrait Width"], 10), parseInt(viewport["Landscape Width"], 10));
    });
    this.thenOpen(url, function () {
      this.wait(11000);
    });
    this.then(function () {
      this.evaluate(function () {
        var toRemove = document.getElementById('wf-info');
        toRemove.parentNode.removeChild(toRemove);
        toRemove = document.getElementById('wf-watermark');
        toRemove.parentNode.removeChild(toRemove);
      });
      this.wait(10000);
    });
    this.then(function () {
      this.echo('Screenshot for ' + viewport["Device Name"] + ' (' + viewport["Portrait Width"] + 'x' + viewport["Landscape Width"] + ')', 'info');
      this.capture('screenshots/' + url.replace(/\//g, '_') + '/' + viewport["Device Name"] + '-' + viewport["Portrait Width"] + 'x' + viewport["Landscape Width"] + '.png', {
        top: 0,
        left: 0,
        width: parseInt(viewport["Portrait Width"], 10),
        height: parseInt(viewport["Landscape Width"], 10)
      });
    });

    this.then(function () {
      this.viewport(parseInt(viewport["Landscape Width"], 10), parseInt(viewport["Portrait Width"], 10));
    });
    this.thenOpen(url, function () {
      this.wait(11000);
    });
    this.then(function () {
      this.evaluate(function () {
        var toRemove = document.getElementById('wf-info');
        toRemove.parentNode.removeChild(toRemove);
        toRemove = document.getElementById('wf-watermark');
        toRemove.parentNode.removeChild(toRemove);
      });
      this.wait(10000);
    });
    this.then(function () {
      this.echo('Screenshot for ' + viewport["Device Name"] + ' (' + viewport["Landscape Width"] + 'x' + viewport["Portrait Width"] + ')', 'info');
      this.capture('screenshots/' + url.replace(/\//g, '_') + '/' + viewport["Device Name"] + '-' + viewport["Landscape Width"] + 'x' + viewport["Portrait Width"] + '.png', {
        top: 0,
        left: 0,
        width: parseInt(viewport["Landscape Width"], 10),
        height: parseInt(viewport["Portrait Width"], 10)
      });
    });

  });
  casper.run();
});
