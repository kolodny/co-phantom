var assert = require('assert');
var co = require('co');
var phantomCreator = require('../..').create;

describe('creating a phantom instance', function() {

  var phantom;

  after(function(next) {
    co(function *() {
      yield phantom.exit();
      next();
    })();
  });

  it('should return an phantom object', function(next) {
    co(function *() {
      phantom = yield phantomCreator();
      assert.equal(typeof phantom, 'object');
      assert.equal(typeof phantom.createPage, 'function');
      next();
    })();
  })
});
