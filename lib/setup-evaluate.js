module.exports = function(pageAPI, page) {

  // the evaluate function takes the callback as the second of varargs
  // we need to rewerite the args order to work with co
  // we also want to let it run async since we need a callback anyway

  var evaluate = pageAPI.evaluate;

  pageAPI.evaluate = function() {
    var ctx = this;
    var args = Array.prototype.slice.call(arguments);
    var isAsync = args[0].length === args.length;

    if (isAsync) {
      var resolvePromise, rejectPromise;
      var id = 'co-phantom-cb' + +new Date() + Math.random();
      var onCallback = function(obj) {
        if (obj.id === id) {
          pageAPI.off('callback', onCallback);
          if (obj.err) {
            rejectPromise(obj.err);
          } else {
            resolvePromise(obj.result);
          }
        }
      };
      pageAPI.on('callback', onCallback);
      var fn = args[0];
      args[0] = function() {
        var argumentsArray = Array.prototype.slice.call(arguments);
        var fn = eval('(' + argumentsArray[0] + ')');
        var id = argumentsArray[1];

        // the last arg is always null (*shrugs*)
        var fnApplier = argumentsArray.slice(2, -1);
        var next = function(err, result) {
          window.callPhantom({id: id, err: err, result: result});
        };
        fn.apply(this, fnApplier.concat(next));
      }
      args.splice(1, 0, fn.toString(), id);
    }

    return new Promise(function(res, rej) {
      var next = function(err, value) {
        if (err) {
          return rej(err);
        }
        if (!isAsync) {
          res(value);
        } else {
          resolvePromise = res;
          rejectPromise = rej;
        }
      }
      args.splice(1, 0, next);
      evaluate.apply(ctx, args);
    });

  }

};