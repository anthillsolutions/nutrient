'use strict';

const PORT = 3000;

module.exports = {
  getNormalizedPort: (port = PORT) => {
    const normalizedPort = parseInt(port, 10);

    if (isNaN(normalizedPort)) {
      return PORT;
    }

    if (normalizedPort >= 0) {
      return normalizedPort;
    }

    return PORT;
  },
};
