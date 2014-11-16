var assert = require('assert');
var co = require('co');
var testHelpers = require('../../test-utils/test-helpers');

describe('page#once', function() {
  var env = {};
  var content = 'This is some content';

  before(testHelpers.before(env, {
    'GET /index.html': content,
  }));

  after(testHelpers.after(env));

  it('should invoke the callback when the event happens', function(next) {
    co(function *() {
      var ticks = 0;
      env.page.on('loadFinished', function() { // should happen every time
        ticks++;
      });
      env.page.once('loadFinished', function() { // should only happen the first time
        ticks++;
      });
      yield env.page.open(env.baseUrl + '/index.html');
      yield env.page.open(env.baseUrl + '/index.html');
      assert.equal(ticks, 3);
      next();
    })();
  });

});
