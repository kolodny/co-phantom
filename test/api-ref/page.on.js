var assert = require('assert');
var co = require('co');
var testHelpers = require('../../test-utils/test-helpers');

describe('page#on', function() {
  var env = {};
  var content = 'This is some content';

  before(testHelpers.before(env, {
    'GET /index.html': content,
  }));

  after(testHelpers.after(env));

  it('should invoke the callback when the event happens', function(next) {
    co(function *() {
      var ticks = 0;
      env.page.on('loadFinished', function() {
        ticks++;
      });
      yield env.page.open(env.baseUrl + '/index.html');
      assert.equal(ticks, 1);
      next();
    })();
  });

});
