var assert = require('assert');
var fs = require('fs');
var co = require('co');
var testHelpers = require('../../test-utils/test-helpers');

describe('asynchronise page#evaluate', function() {
  var html = [
    '<html><body>',
    '<script src="/jquery.js"></script>',
    '<script>$("<div>").text("appended text").appendTo("body")</script>',
    '</body></html>'
  ].join('\n');
  var jquery = fs.readFileSync(__dirname + '/../../test-utils/jquery.js').toString();
  var env = {};

  before(testHelpers.before(env, {
    'GET /index.html': html,
    'GET /jquery.js': jquery,
  }));

  after(testHelpers.after(env));

  it('should run the function in the page context', function(next) {
    co(function *() {
      yield env.page.open(env.baseUrl + '/index.html');
      var yeller = '!!';
      var innerText = yield env.page.evaluate(function(yellerer, done) {
        setTimeout(function() {
          done(null, document.body.innerText + yellerer);
        }, 100);
      }, yeller);
      assert.equal(innerText, 'appended text' + yeller);
      next();
    })();
  });

});
