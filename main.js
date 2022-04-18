const xbeeRx = require('xbee-rx');

// xbee options
const xbeeOptions = {
  serialport: '/dev/ttyUSB0',
  serialPortOptions: {
    baudRate: 9600,
  },
  module: 'ZigBee',
  api_mode: 2,
  defaultTimeoutMs: 30000,
  // debug: true,
};
// config XbeeConnection
const xbee = xbeeRx(xbeeOptions);