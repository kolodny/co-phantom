var assert = require('assert');
var co = require('co');
var testHelpers = require('../test-utils/test-helpers');

describe('waiting for an event', function() {
  var env = {};
  var content = 'This is some content';

  before(testHelpers.before(env, {
    'GET /index.html': content,
  }));

  after(testHelpers.after(env));

  it('should wait until that event triggers', function(next) {
    this.timeout(5000);
    co(function *() {
      yield env.page.open(env.baseUrl + '/index.html');
      yield env.page.evaluate(function() {
        setTimeout(function() {
          console.log('done waiting');
        }, 250);
      });
      yield env.page.wait('consoleMessage');
      next();
    })();

  });
});
