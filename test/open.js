// var assert = require('assert');
// var co = require('co');
// var phantomCreator = require('..').create;
// var server = require('../test-server');

// var baseUrl = 'http://localhost:' + server.address().port;

// describe('opening a url', function() {
//   var phantom, page;

//   after(function() {
//     server.close();
//   });

//   beforeEach(function(next) {
//     co(function *() {
//       phantom = yield phantomCreator();
//       page = yield phantom.createPage();
//       next();
//     })();
//   });
//   afterEach(function(next) {
//     co(function *() {
//       yield page.close();
//       yield phantom.exit();
//       next();
//     })();
//   })

//   it('should get the page content', function(next) {
//     co(function *() {
//       yield page.open(baseUrl);
//       var content = yield page.get('content');
//       assert(/body class="the-body"/.test(content));

//       next();
//     })();
//   })
// });


