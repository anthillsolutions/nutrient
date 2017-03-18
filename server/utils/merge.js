'use strict';

module.exports = {
  /* Merges src to dest. Suports upto only 3 nested levels*/
  mergeObjects: (dest, src) => {
    for (var attribL1 in src) {
      if (typeof src[attribL1] === 'string') {
        dest[attribL1] = src[attribL1];
      } else {
        for (var attribL2 in src[attribL1]) {
          if (typeof src[attribL1][attribL2] === 'object') {
            if (Object.keys(src[attribL1][attribL2]).length !== 0) {
              for (var attribL3 in src[attribL1][attribL2]) {
                if (typeof src[attribL1][attribL2][attribL3] === 'string') {
                  dest[attribL1][attribL2][attribL3] =
                    src[attribL1][attribL2][attribL3];
                }
              }
            } else {
              dest[attribL1][attribL2] = {};
            }
          }
        }
      }
    }
    return dest;
  },
};
