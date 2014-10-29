var assert = require('assert');
var co = require('co');
var phantomCreator = require('../..').create;
var server = require('../../test-server')();
var fs = require('fs');
var Promise = require('bluebird');

var readFile = Promise.promisify(fs.readFile);

var baseUrl = 'http://localhost:' + server.address().port;

describe('getting page content', function() {
  var phantom, page;

  before(function(next) {
    co(function *() {
      phantom = yield phantomCreator();
      page = yield phantom.createPage();
      next();
    })();
  });

  after(function(next) {
    co(function *() {
      yield page.close();
      yield phantom.exit();
      server.close();
      next();
    })();
  });

  it('should return the content', function(next) {
    co(function *() {
      yield page.open(baseUrl + '/file.txt');
      var content = (yield page.get('content')).toString();
      var fileContents = (yield readFile(__dirname + '/../../test-server/public/file.txt')).toString();
      assert(content.indexOf(fileContents) > -1);
      next();
    })();
  });
});
