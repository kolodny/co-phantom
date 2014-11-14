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
  return ret;
}
