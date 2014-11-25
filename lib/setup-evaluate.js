module.exports = function(pageAPI, page) {

  // the evaluate function takes the callback as the second of varargs
  // we need to rewerite the args order to work with co
  // we also want to let it run async since we need a callback anyway

  var evaluate = pageAPI.evaluate;

  pageAPI.evaluate = function() {
    var ctx = this;
    var args = Array.prototype.slice.call(arguments);
    var isAsync = args[0].length === args.length;

    return new Promise(function(resolve, reject) {
      var id = 'co-phantom-cb' + +new Date() + Math.random();
      if (isAsync) {
        var onCallback = function(obj) {
          if (obj.id === id) {
            pageAPI.off('callback', onCallback);
            if (obj.err) {
              reject(obj.err);
            } else {
              resolve(obj.result);
            }
          }
        };
        pageAPI.on('callback', onCallback);
      }
      var fn = args[0];
      args[0] = function() {
        var argumentsArray = Array.prototype.slice.call(arguments);
        var fn = eval('(' + argumentsArray[0] + ')');
        var id = argumentsArray[1];
        var isAsync = argumentsArray[2];

        // the last arg is always null (*shrugs*)
        var fnApplier = argumentsArray.slice(3, -1);
        var next = function(err, result) {
          window.callPhantom({id: id, err: err, result: result});
        };
        try {
          var result = fn.apply(this, fnApplier.concat(next));
        } catch (e) {
          if (!isAsync) {
            return [e];
          }
          setTimeout(function() {
            next(e);
          });
        }
        if (!isAsync) {
          return [null, result];
        }
      }
      args.splice(1, 0, fn.toString(), id, isAsync);

      var next = function(err, value) {
        if (err) {
          return reject(err);
        }
        if (!isAsync) {
          // console.log(arguments)
          if (value && value[0]) {
            return reject(value[0]);
          } else {
            return resolve(value && value[1]);
          }
        }
      }
      args.splice(1, 0, next);
      var promise = evaluate.apply(ctx, args);
      // console.log(promise)

    });



  }

};
