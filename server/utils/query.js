'use strict';

module.exports = {
  byProducts: (queryObject) => {
    let lt, gt, val, tmp;
    let result = {};
    for (let param in queryObject) {
      /* istanbul ignore else */
      if (queryObject.hasOwnProperty(param)) {
        lt = true;
        gt = true;
        val = '' + queryObject[param];
        // Match a number
        if (val.match(/^\d+\.?\d*$/)) {
          result[param] = '' + queryObject[param];
          break;
        }

        result[param] = {};

        // Match a min value
        tmp = val.match(/(?=<=(\d+\.?\d*))/);
        if (tmp) {
          lt = false;
          result[param].$lte = tmp[1];
        }

        // Match a max value
        tmp = val.match(/(?=>=(\d+\.?\d*))/);
        if (tmp) {
          gt = false;
          result[param].$gte = tmp[1];
        }

        // Match a min equal value
        tmp = val.match(/(?=<(\d+\.?\d*))/);
        if (lt && tmp) {
          result[param].$lt = tmp[1];
        }

        // Match a max equal value
        tmp = val.match(/(?=>(\d+\.?\d*))/);
        if (gt && tmp) {
          result[param].$gt = tmp[1];
        }
      }
    }
    return result;
  },
};
