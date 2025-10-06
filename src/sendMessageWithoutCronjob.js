const xbeeRx = require('xbee-rx');
const { performance } = require('perf_hooks');
const cron = require('node-cron');

// const CRONJOB_SEND_MESSAGE = '50 54 16 * * *';
const PORT = '/dev/ttyUSB0';
const DEST_MAC_ADDRESS = '0013a20041de6174';
const BAUD_RATE = 9600;
// const MESSAGE = '>CLOUD/REQUEST?date^';
const MESSAGE =
  'bc/dev?ts=1749483829&gw=13a20041ca5820&fw=5.3.1&hw=2.4.4&rv=0&up=1748353878&rs=1828&rt=28.75&fp=nil&pd=0&fl=26';
// 'bc/dev?ts=1749483829&gw=13a20041ca5820&fw=5.3.1&hw=2.4.4&rv=0&up=1748353878&rs=1828&rt=28.75&l=-80.0581440,-2.8542054,1.40&fp=1&pd=0&fl=26';
// const MESSAGE = 'MASTER/REQUEST?battery^';
// const MESSAGE = 'bc/dev?ts=1718297882&v=13.0';
const NUM_MESSAGES = 25;
// const NUM_MESSAGES = 2;
const DEFAULT_TIMEOUT_MS = 30000;
const API_MODE = 2;

const xbeeOptions = {
  serialport: PORT,
  serialPortOptions: {
    baudRate: BAUD_RATE,
  },
  module: 'ZigBee',
  api_mode: API_MODE,
  defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
  // debug: true,
};

const xbee = xbeeRx(xbeeOptions);
let countTransmit = 0;
let countReceive = 0;

const remoteTransmit = (xbeeObject, remote64, data = '') =>
  new Promise((resolve, reject) => {
    countTransmit = countTransmit + 1;
    console.log('[out] [%o] package %o: %o', countTransmit, remote64, data);
    xbeeObject
      .remoteTransmit({
        destination64: remote64,
        data,
      })
      .subscribe(
        (response) => resolve(response),
        (error) => reject(error),
        () => resolve('ok')
      );
  });

xbee.monitorTransmissions().subscribe(async (transmissionPacket) => {
  const packetData = transmissionPacket.data.toString();
  const { remote64 } = transmissionPacket;
  countReceive = countReceive + 1;
  console.log(
    '[in] [1] [%o] package %o: %o',
    countReceive,
    remote64,
    packetData
  );
});

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

const execute = async () => {
  const initTime = performance.now();
  console.log('init time: ', initTime);
  let count = 0;
  for (let index = 0; index < NUM_MESSAGES; index++) {
    try {
      const sendResp2 = await remoteTransmit(xbee, DEST_MAC_ADDRESS, MESSAGE);
      count = count + 1;
    } catch (error) {
      console.error('error: ', error);
    }
  }
  const endTime = performance.now();
  console.log('end time: ', endTime);
  console.log(
    `Process of remoteTransmit took  ${endTime - initTime}  milliseconds.`
  );
  console.log(
    `Process of remoteTransmit took  ${millisToMinutesAndSeconds(
      endTime - initTime
    )}  minutes.`
  );
  // process.exit();
};

// cron.schedule(CRONJOB_SEND_MESSAGE, async () => {
//   console.log('cron job send message');
//   execute();
// });

execute();
