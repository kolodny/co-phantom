// var assert = require('assert');
// var co = require('co');
// var phantomCreator = require('..').create;

// describe('bootstrapping co-phantom', function() {
//   it('should return an object', function(next) {
//     co(function *() {
//       var phantom = yield phantomCreator();
//       assert.equal(typeof phantom, 'object');
//       assert.equal(typeof phantom.createPage, 'function');
//       next();
//     })();
//   })
// });

// describe('creating a page', function() {
//   it('should return a page', function(next) {
//     co(function *() {
//       var phantom = yield phantomCreator();
//       var page = yield phantom.createPage();
//       assert.equal(typeof page, 'object')
//       assert.equal(typeof page.goBack, 'function')
//       next();
//     })();
//   });
// });

