var assert = require('assert');
var co = require('co');
var phantomCreator = require('../..').create;

describe('creating a page', function() {

  var phantom, page;

  after(function(next) {
    co(function *() {
      yield page.close();
      yield phantom.exit();
      next();
    })();
  });

  it('should return a page object', function(next) {
    co(function *() {
      phantom = yield phantomCreator();
      page = yield phantom.createPage();
      assert.equal(typeof page, 'object');
      assert.equal(typeof page.goBack, 'function');
      next();
    })();
  });

});
