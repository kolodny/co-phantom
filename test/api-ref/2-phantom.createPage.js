var assert = require('assert');
var co = require('co');
var phantomCreator = require('../..').create;

describe('creating a page', function() {
  it('should return a page object', function(next) {
    co(function *() {
      var phantom = yield phantomCreator();
      var page = yield phantom.createPage();
      assert.equal(typeof page, 'object')
      assert.equal(typeof page.goBack, 'function')
      next();
    })();
  });
});
