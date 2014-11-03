var assert = require('assert');
var co = require('co');
var phantomCreator = require('../..').create;
var server = require('../../test-server')();

var baseUrl = 'http://localhost:' + server.address().port;

describe('binding to an event with once', function() {
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

  it('should invoke the callback no more than once', function(next) {
    co(function *() {
      var ticks = 0;
      page.on('loadFinished', function() { // should happen every time
        ticks++;
      });
      page.once('loadFinished', function() { // should only happen the first time
        ticks++;
      });
      yield page.open(baseUrl + '/index.html');
      yield page.open(baseUrl + '/index.html');
      assert.equal(ticks, 3);
      next();
    })();
  });

});
