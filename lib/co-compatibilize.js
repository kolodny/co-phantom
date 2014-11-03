var Promise = require('bluebird');

module.exports = coCompatibilize;

function coCompatibilize(obj, ret) {
  ret = ret || {};
  for (var i in obj) {
    if (Object.hasOwnProperty.call(obj, i)) {
     if (typeof obj[i] === 'function' && i !== 'on') {
      ret[i] = Promise.promisify(obj[i]);
     } else {
      ret[i] = obj[i];
     }
    }
  }
  if (!ret.on) {
    var callbacks = {}; // hash of arrays
    ret.on = function(event, callback) {
      if (!callbacks[event]) {
        callbacks[event] = [];
        obj['on' + capitalize(event)] = function() {
          for (var i = 0; i < callbacks[event].length; i++) {
            callbacks[event][i]();
          }
        }
      }
      callbacks[event].push(callback);
    };
    ret.off = function(event, fn) {
      if (fn) {
        var index;
        while ((index = callbacks[event].indexOf(fn)) > -1) {
          callbacks[event].splice(index, 1);
        }
      } else {
        callbacks[event] = [];
      }
    };
    ret.once = function(event, fn) {
      var wrapper = function() {
        ret.off(event, wrapper);
        fn();
      };
      ret.on(event, wrapper);
    };

    // return a thunk for co so we can do `yield page.wait('loadComplete');`
    ret.wait = function(name) {
      return function(cb) {
        ret.once(name, cb);
      };
    };
  }
  return ret;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
