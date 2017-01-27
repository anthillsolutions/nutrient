'use strict';

const express = require('express');
const port = require('./utils/port.js');
require('dotenv').config({ silent: true });

const app = express();
const index = require('./routes/index.js');
const PORT = port.getNormalizedPort(process.env.PORT);

app.use(index);

module.exports = app.listen(PORT, () => {
  console.log('app listening on port ' + PORT + '!');
});
