var assert = require('assert');
var fs = require('fs');
var co = require('co');
var testHelpers = require('../../test-utils/test-helpers');

describe('page#evaluate', function() {
  var env = {};

  before(testHelpers.before(env, {
    'GET /index.html': '<html><body>test</body></html>'
  }));

  after(testHelpers.after(env));

  it('should catch synchronise errors', function(next) {
    co(function *() {
      yield env.page.open(env.baseUrl + '/index.html');
      var yeller = '!!';
      var caught;
      try {
        yield env.page.evaluate(function(yellerer) {
          throw 'catch me';
        }, yeller);
      } catch(e) {
        caught = e;
      }
      assert.equal(caught, 'catch me');
      next();
    })();
  });

  it('should catch asynchronise errors', function(next) {
    co(function *() {
      yield env.page.open(env.baseUrl + '/index.html');
      var yeller = '!!';
      var caught;
      try {
        yield env.page.evaluate(function(yellerer, next) {
          next('catch me')
        }, yeller);
      } catch(e) {
        caught = e;
      }
      assert.equal(caught, 'catch me');
      next();
    })();
  });

});
