var assert = require('assert');
var co = require('co');
var testHelpers = require('../../test-utils/test-helpers');

describe('page.get("content")', function() {
  var env = {};
  var content = 'This is some content';

  before(testHelpers.before(env, {
    'GET /index.html': content,
  }));

  after(testHelpers.after(env));

  it('should return the content of the page', function(next) {
    co(function *() {
      yield env.page.open(env.baseUrl + '/index.html');
      var pageContent = (yield env.page.get('content')).toString();
      assert(pageContent.trim().indexOf(content.trim()) > -1);
      next();
    })();
  });

});
