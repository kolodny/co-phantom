var assert = require('assert');
var co = require('co');
var phantomCreator = require('../..').create;
var server = require('../../test-server');

var baseUrl = 'http://localhost:' + server.address().port;

describe('opening a url', function() {
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

  it('should open the page', function(next) {
    co(function *() {
      yield page.open(baseUrl + '/file.txt');
      assert.equal(server.logged.length, 1);
      next();
    })();
  })


});


