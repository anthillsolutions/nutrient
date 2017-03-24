'use strict';

const tokens = require('express-token-api-middleware');
const crypto = require('crypto');

module.exports = {
  getTokenMiddleware: () => {
    return tokens({
      password: process.env.TOKEN_PASSWORD || 'A-S1impl3P4ssword',
      salt: process.env.NODE_ENV === 'production' ?
        crypto.randomBytes(32) : 'a test salt not to be use in production',
    });
  },
};
