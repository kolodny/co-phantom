var phantomSimeple = require('node-phantom-simple');
var Promise = require('bluebird');
var coCompatibilize = require('./co-compatibilize.js');
var setupEvaluate = require('./setup-evaluate.js');

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
