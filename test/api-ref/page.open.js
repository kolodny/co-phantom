var assert = require('assert');
var co = require('co');
var testHelpers = require('../test-utils/test-helpers');

describe('page#open', function() {
  var env = {};
  var content = 'This is some content';
  var log = [];

  before(testHelpers.before(env, {
    'GET /index.html': content,
  }, function(route) {
    log.push(route);
  }));

  after(testHelpers.after(env));

  it('should make a request for the page', function(next) {
    co(function *() {
      var ticks = 0;
      env.page.on('loadFinished', function() {
        ticks++;
      });
      yield env.page.open(env.baseUrl + '/index.html');
      assert.equal(log.length, 1);
      next();
    })();
  });

});
