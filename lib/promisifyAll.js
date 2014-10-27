var Promise = require('bluebird');

module.exports = promisifyAll;

function promisifyAll(obj, ret) {
  ret = ret || {};
  for (var i in obj) {
    if (Object.hasOwnProperty.call(obj, i)) {
     if (typeof obj[i] === 'function') {
      ret[i] = Promise.promisify(obj[i]);
     } else {
      ret[i] = obj[i];
     }
    }
  }
  return ret;
}
