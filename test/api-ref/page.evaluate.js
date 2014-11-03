var assert = require('assert');
var co = require('co');
var phantomCreator = require('../..').create;
var server = require('../../test-server')();

var baseUrl = 'http://localhost:' + server.address().port;

describe('evaluate', function() {
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

  it('should run the function in the page context', function(next) {
    co(function *() {
      yield page.open(baseUrl + '/index.html');
      var innerText = yield page.evaluate(function() {
        return document.body.innerText;
      });
      assert.equal(innerText, 'appended text');
      next();
    })();
  });

});
