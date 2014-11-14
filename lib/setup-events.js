module.exports = function(obj, api) {
  var callbacks = {}; // hash of arrays
  api.on = function(event, callback) {
    if (!callbacks[event]) {
      callbacks[event] = [];
      obj['on' + capitalize(event)] = function() {
        for (var i = 0; i < callbacks[event].length; i++) {
          callbacks[event][i].apply(this, arguments);
        }
      }
    }
    callbacks[event].push(callback);
  };
  api.off = function(event, fn) {
    if (callbacks[event]) { // in case off is called before on
      if (fn) {
        var index;
        while ((index = callbacks[event].indexOf(fn)) > -1) {
          callbacks[event].splice(index, 1);
        }
      } else {
        callbacks[event] = [];
      }
    }
  };
  api.once = function(event, fn) {
    var wrapper = function() {
      api.off(event, wrapper);
      fn();
    };
    api.on(event, wrapper);
  };

  // return a co-able so we can do something like `yield page.wait('loadComplete');`
  api.wait = function(name) {
    return new Promise(function(res) {
      api.once(name, res);
    });
  };
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
