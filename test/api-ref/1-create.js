var assert = require('assert');
var co = require('co');
var phantomCreator = require('../..').create;

describe('creating a phantom instance', function() {
  it('should return an phantom object', function(next) {
    co(function *() {
      var phantom = yield phantomCreator();
      assert.equal(typeof phantom, 'object');
      assert.equal(typeof phantom.createPage, 'function');
      next();
    })();
  })
});
