var co = require('co');
var simpleServe = require('simple-serve');
var phantomCreator = require('..').create;

exports.before = function(env, routes, callback) {
  return function(next) {
    co(function *() {
      env.server = yield simpleServe(routes, callback);
      env.baseUrl = 'http://localhost:' + env.server.address().port;
      env.phantom = yield phantomCreator();
      env.page = yield env.phantom.createPage();
      next();
    })();
  };
};

exports.after = function(env) {
  return function(next) {
    co(function *() {
      yield env.page.close();
      yield env.phantom.exit();
      env.server.close();
      next();
    })();
  };
};
