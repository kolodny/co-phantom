var phantomSimeple = require('node-phantom-simple');
var Promise = require('bluebird');
var coCompatibilize = require('./co-compatibilize.js');

exports.create = create;

function create() {
  return new Promise(function(res, rej) {
    phantomSimeple.create(function(err, ph) {
      if (err) {
        return rej(err);
      }
      res(new PhantomAPI(ph));
    });
  });
}

function PhantomAPI(ph) {
  coCompatibilize(ph, this);
  setupCreatePage(this);
}

function PageAPI(page) {
  coCompatibilize(page, this);
  setupEvaluate(this, page);
}

function setupCreatePage(phantomAPI) {
  var createPage = phantomAPI.createPage;
  phantomAPI.createPage = function() {
    return createPage().then(function(page) {
      return new PageAPI(page);
    });
  };
}

function setupEvaluate(pageAPI, page) {

  // the evaluate function takes the callback as the second of varargs
  // we need to rewerite the args order to work with co

  var evaluate = pageAPI.evaluate;

  pageAPI.evaluate = function() {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function(res, rej) {
      var next = function(err, value) {
        if (err) {
          return rej(err);
        }
        res(value)
      }
      args.splice(1, 0, next);
      evaluate.apply(ctx, args);
    });
  }

}
