var assert = require('assert');
var co = require('co');
var testHelpers = require('../../test-utils/test-helpers');

describe('page#wait', function() {
  var env = {};
  var content = 'This is some content';

  before(testHelpers.before(env, {
    'GET /index.html': content,
  }));

  after(testHelpers.after(env));

  it('should wait until that event triggers', function(next) {
    co(function *() {
      yield env.page.open(env.baseUrl + '/index.html');

      // we need to set up this wait now because it may happen before
      // we get a chance to set up after evaluate
      var returnVal = yield env.page.evaluate(function() {
        setTimeout(function() {
          console.log('done waiting');
        }, 250);
        return 'return val';
      });
      assert.equal(returnVal, 'return val');
      var waitFor = env.page.wait('consoleMessage'); // race condition
      yield waitFor;
      next();
    })();

  });
});
