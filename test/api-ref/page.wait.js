var assert = require('assert');
var co = require('co');
var phantomCreator = require('../..').create;
var server = require('../../test-server')();

var baseUrl = 'http://localhost:' + server.address().port;

describe('waiting for an event', function() {
  var phantom, page;

  before(function(next) {
    co(function *() {
      phantom = yield phantomCreator();
      page = yield phantom.createPage();
      next();
    })();
  });

  after(function(next) {
    co(function *() {
      yield page.close();
      yield phantom.exit();
      server.close();
      next();
    })();
  });

  it('should wait until that event triggers', function(next) {
    this.timeout(5000);
    co(function *() {
      yield page.open(baseUrl + '/index.html');
      yield page.evaluate(function() {
        setTimeout(function() {
          console.log('done waiting');
        }, 1000);
      });
      yield page.wait('consoleMessage');
      next();
    })();
  });

});
