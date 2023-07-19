const xbeeRx = require('xbee-rx');
const { performance } = require('perf_hooks');

const PORT = '/dev/ttyUSB0';
const DEST_MAC_ADDRESS = '0013a20042019f72';
const BAUD_RATE = 9600;
const MESSAGE = "ba/rdcf?ts=1689624677&gw=0013a2004201ae3e&cc=True&ccf=1&ccd=35&al=2000&acl=600&gth=-18.0&gr=-40&ga=0.0005&gd=0.01&hpf=2600&method=PUSH&cm=1&hours=1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1"
// const MESSAGE = "estemensajedebetenerunpayloadof110caracteressoigointtowritesomelettersthatcompletethemaxlengthoftheframeilikedtethemaxlengthoftheframeiliked"
// const MESSAGE = "MASTER/REQUEST?battery^"
const NUM_MESSAGES = 1000
const DEFAULT_TIMEOUT_MS = 30000
const API_MODE = 2

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

const remoteTransmit = (xbeeObject, remote64, data ='') => (
    new Promise((resolve, reject) => {
        countTransmit = countTransmit+1;
        console.log('[out] [%o] package %o: %o', countTransmit, remote64, data);
        xbeeObject.remoteTransmit({
          destination64: remote64,
          data,
        }).subscribe(
          (response) =>  resolve(response),
          (error) => reject(error),
          () =>  resolve('ok'),
        );
    })
  );

xbee.monitorTransmissions()
.subscribe(async (transmissionPacket) => {
const packetData = transmissionPacket.data.toString();
const { remote64 } = transmissionPacket;
countReceive = countReceive+1;
console.log('[in] [1] [%o] package %o: %o', countReceive, remote64, packetData);
})

const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

const execute = async () => {
    const initTime = performance.now()
    console.log('init time: ', initTime);
    let count = 0;
    for (let index = 0; index < NUM_MESSAGES; index++) {
      try {
        const sendResp2 = await remoteTransmit(xbee, DEST_MAC_ADDRESS, MESSAGE + count);
        count = count + 1;
      } catch (error) {
        console.error('error: ', error);
      }
    }
    const endTime = performance.now()
    console.log('end time: ', endTime);
    console.log(`Process of remoteTransmit took  ${endTime - initTime}  milliseconds.`);
    console.log(`Process of remoteTransmit took  ${millisToMinutesAndSeconds(endTime - initTime)}  minutes.`);
    process.exit();
  }

execute();