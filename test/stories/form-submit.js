var assert = require('assert');
var co = require('co');
var testHelpers = require('../../test-utils/test-helpers');

describe('submitting a form', function() {
  var env = {};
  var formPage = [
    '<form id=form action="/submit.html" method="POST">',
    '<input id=name name="name">',
    '<button id=go>Go</button>'
  ].join('\n');

  before(testHelpers.before(env, {
  'GET /index.html': formPage,
  'POST /submit.html': 'Hello {name}!'
  }));

  after(testHelpers.after(env));

  it('submit the form', function(next) {
    co(function *() {
      var name = 'Moshe Kolodny';
      yield env.page.open(env.baseUrl + '/index.html');
      var waitFor = env.page.wait('loadFinished');
      yield env.page.evaluate(function(name) {
        document.querySelector('#name').value = name
        document.querySelector('#form').submit();
      }, name);
      yield waitFor;
      var text = yield env.page.evaluate(function() {
        return document.body.innerText;
      });
      assert.equal(text, 'Hello ' + name + '!');
      next();
    })();
  });

});
