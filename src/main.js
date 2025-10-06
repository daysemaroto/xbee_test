// const xbeeRx = require('xbee-rx');
// const { performance } = require('perf_hooks');

// var debug = require('debug')('bcg:o');
// var errors = require('debug')('bcg:error');
// var debugGW = require('debug')('bcg:gw');
// var debugNode = require('debug')('bcg:node');

// // xbee options
// const xbeeOptions = {
//   serialport: '/dev/ttyUSB0',
//   serialPortOptions: {
//     baudRate: 9600,
//   },
//   module: 'ZigBee',
//   api_mode: 2,
//   defaultTimeoutMs: 30000,
//   // debug: true,
// };
// // xbee options
// const xbeeOptions2 = {
//   serialport: '/dev/ttyUSB1',
//   serialPortOptions: {
//     baudRate: 9600,
//   },
//   module: 'ZigBee',
//   api_mode: 2,
//   defaultTimeoutMs: 30000,
//   // debug: true,
// };
// // xbee options
// const xbeeOptions3 = {
//   serialport: '/dev/ttyUSB2',
//   serialPortOptions: {
//     baudRate: 9600,
//   },
//   module: 'ZigBee',
//   api_mode: 2,
//   defaultTimeoutMs: 30000,
//   // debug: true,
// };
// // config XbeeConnection

// const xbee1 = xbeeRx(xbeeOptions);
// const xbee2 = xbeeRx(xbeeOptions2);
// const xbee3 = xbeeRx(xbeeOptions3);

// const xbeeRemote64_1 = '0013a20041de61d4';
// // const xbeeRemote64_2 = '0013a20041de6174';
// const xbeeRemote64_2 = '0013a20041de3597';
// // const xbeeRemote64_3 = '0013a20041de3597';
// const xbeeArray = [xbeeRemote64_1, xbeeRemote64_2];

// // const packetsToSend = 20;
// // const packetsToSend = 50;
// // const packetsToSend = 100;
// // const packetsToSend = 150;
// // const packetsToSend = 200;
// // const packetsToSend = 250;
// // const packetsToSend = 300;
// const packetsToSend = 500;

// let countTransmit1 =0;
// let countTransmit2 =0;
// let countTransmit3 =0;

// let countReceive1 =0;
// let countReceive2 =0;
// let countReceive3 =0;

// // await new Promise((resolve) => setTimeout(resolve, 3000));

// // 4
// const str = 'casa';

// // 10
// // const str = 'estemensaj';

// // 30
// // const str = 'estemensajedebetenerunpayloado';

// // 40
// // const str = 'estemensajedebetenerunpayloadof110caract';

// // 60
// // const str = 'estemensajedebetenerunpayloadof110caracteressoigointtowrites';

// // 75
// // const str = 'estemensajedebetenerunpayloadof110caracteressoigointtowritesomelettersthatc';

// // 80
// // const str = 'estemensajedebetenerunpayloadof110caracteressoigointtowritesomelettersthatcomple';

// // 110
// // const str = 'estemensajedebetenerunpayloadof110caracteressoigointtowritesomelettersthatcompletethemaxlengthoftheframeiliked';

// // 140
// // const str = 'estemensajedebetenerunpayloadof110caracteressoigointtowritesomelettersthatcompletethemaxlengthoftheframeilikedtethemaxlengthoftheframeiliked';


// // 160
// // const str = 'estemensajedebetenerunpayloadof110caracteressoigointtowritesomelettersthatcompletethemaxlengthoftheframeilikedtethemaxlengthoftheframeilikedngthoftheframeiliked';

// // 240
// // const str = 'anotherestemensajedebetenerunpayloadof110caracteressoigointtowritesomelettersthatcompletethemaxlengthoftheframeilikedqwersdfasdasdfasdfdsfasdfweregfsdgapoiewjifoksfpoeijoweifoewirjkkpwoierfioermfpodskmpoerfpo3i4jgip34jwer34kwjepoirtu3p4wert';

// // 107
// // const str = 'bc/engs?ts=1649420436&st=END&dh=3&vD=null,13.67,null&cD=null,6.03,null&vE=null,13.68,null&cE=null,0.07,null';

// const remoteTransmit = (xbeeObject, remote64, data ='') => (
//   new Promise((resolve, reject) => {
//       countTransmit1 = countTransmit1+1;
//       debugGW('[out] [1] [%o] package %o: %o', countTransmit1, remote64, data);
//       xbeeObject.remoteTransmit({
//         destination64: remote64,
//         data,
//       }).subscribe(
//         (response) =>  resolve(response),
//         (error) => reject(error),
//         () =>  resolve('ok'),
//       );
//   })
// );
// const remoteTransmit2 = (xbeeObject, remote64, data ='') => (
//   new Promise((resolve, reject) => {
//     countTransmit2 = countTransmit2+1;
//       debugNode('[out] [2] [%o] package %o: %o', countTransmit2, remote64, data);
//       xbeeObject.remoteTransmit({
//         destination64: remote64,
//         data,
//       }).subscribe(
//         (response) =>  resolve(response),
//         (error) => reject(error),
//         () =>  resolve('ok'),
//       );
//   })
// );
// // const remoteTransmit3 = (xbeeObject, remote64, data ='') => (
// //   new Promise((resolve, reject) => {
// //     countTransmit3 = countTransmit3+1;
// //       debugNode('[out] [3] [%o] package %o: %o', countTransmit3, remote64, data);
// //       xbeeObject.remoteTransmit({
// //         destination64: remote64,
// //         data,
// //       }).subscribe(
// //         (response) =>  resolve(response),
// //         (error) => reject(error),
// //         () =>  resolve('ok'),
// //       );
// //   })
// // );

// xbee1.monitorTransmissions()
//   .subscribe(async (transmissionPacket) => {
//     const packetData = transmissionPacket.data.toString();
//     const { remote64 } = transmissionPacket;
//     countReceive1 = countReceive1+1;
//     debugGW('[in] [1] [%o] package %o: %o', countReceive1, remote64, packetData);
//   })
// xbee2.monitorTransmissions()
//   .subscribe(async (transmissionPacket) => {
//     const packetData = transmissionPacket.data.toString();
//     const { remote64 } = transmissionPacket;
//     countReceive2 = countReceive2+1;
//     debugNode('[in] [2] [%o] package %o: %o', countReceive2, remote64, packetData);
//   })
// xbee3.monitorTransmissions()
//   .subscribe(async (transmissionPacket) => {
//     const packetData = transmissionPacket.data.toString();
//     const { remote64 } = transmissionPacket;
//     countReceive3 = countReceive3+1;
//     debugNode('[in] [3] [%o] package %o: %o', countReceive3, remote64, packetData);
//   })

//   const millisToMinutesAndSeconds = (millis) => {
//     var minutes = Math.floor(millis / 60000);
//     var seconds = ((millis % 60000) / 1000).toFixed(0);
//     return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
//   }

// const execute = async () => {
//   const initTime = performance.now()
//   debug('init time: ', initTime);
//   let count = 0;
//   for (let index = 0; index < packetsToSend; index++) {
//     try {
//       // const sendResp =  remoteTransmit(xbeeArray[0], str); // don't work - finish so fast, but doesn't make anything
//       // const sendResp = await remoteTransmit(xbee1, xbeeArray[0], str);
//       // debugGW("🚀 ~ file: main.js ~ line 75 ~ execute ~ sendResp", sendResp)
//       // const sendResp2 =  remoteTransmit(xbeeArray[1], str); // don't work - finish so fast, but doesn't make anything
//       const sendResp2 = await remoteTransmit(xbee1, xbeeArray[1], str);
//       debugGW("🚀 ~ file: main.js ~ line 78 ~ execute ~ sendResp2", sendResp2)


//       // const sendResp3 = await remoteTransmit2(xbee2, xbeeArray[2], str );
//       // debugNode("🚀 ~ file: main.js ~ line 120 ~ execute ~ sendResp3", sendResp3)

//       // const sendResp4 = await remoteTransmit3(xbee3, xbeeArray[2], str );
//       // debugNode("🚀 ~ file: main.js ~ line 123 ~ execute ~ sendResp4", sendResp4);

//       count = count + 1;
//       debug("🚀 ~ file: main.js ~ line 81 ~ execute ~ count", count)
//     } catch (error) {
//       errors('error: ', error);
//     }
//   }

//   const endTime = performance.now()
//   debug('end time: ', endTime);

//   debug(`Process of remoteTransmit took  ${endTime - initTime}  milliseconds.`);
//   debug(`Process of remoteTransmit took  ${millisToMinutesAndSeconds(endTime - initTime)}  minutes.`);
//   // process.exit();
// }

// execute();


// /**
//  * ASYNC with time out 3000 ms
//  * ========================================================================================================
//  */

const xbeeRx = require('xbee-rx');
const { performance } = require('perf_hooks');

var debug = require('debug')('bcg:o');
var errors = require('debug')('bcg:error');
var debugGW = require('debug')('bcg:gw');
var debugNode1 = require('debug')('bcg:nod1');
var debugNode2 = require('debug')('bcg:nod2');

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
// xbee options
const xbeeOptions2 = {
  serialport: '/dev/ttyUSB1',
  serialPortOptions: {
    baudRate: 9600,
  },
  module: 'ZigBee',
  api_mode: 2,
  defaultTimeoutMs: 30000,
  // debug: true,
};
// xbee options
const xbeeOptions3 = {
  serialport: '/dev/ttyUSB2',
  serialPortOptions: {
    baudRate: 9600,
  },
  module: 'ZigBee',
  api_mode: 2,
  defaultTimeoutMs: 30000,
  // debug: true,
};
// config XbeeConnection

const xbee1 = xbeeRx(xbeeOptions);
const xbee2 = xbeeRx(xbeeOptions2);
const xbee3 = xbeeRx(xbeeOptions3);

const xbeeRemote64_1 = '0013a20041de61d4';
const xbeeRemote64_2 = '0013a20041de6174';
// const xbeeRemote64_2 = '0013a20041de3597';
const xbeeRemote64_gw = '0013a20041de3597';
const xbeeArray = [xbeeRemote64_gw, xbeeRemote64_1, xbeeRemote64_2];
// const xbeeArray = [xbeeRemote64_1, xbeeRemote64_2];

const packetsToSend = 20;
// const packetsToSend = 50;
// const packetsToSend = 100;
// const packetsToSend = 150;
// const packetsToSend = 200;
// const packetsToSend = 250;
// const packetsToSend = 300;
// const packetsToSend = 500;

let countTransmit1 =0;
let countTransmit2 =0;
let countTransmit3 =0;

let countReceive1 =0;
let countReceive2 =0;
let countReceive3 =0;

// await new Promise((resolve) => setTimeout(resolve, 3000));

let arrayFunctions= [];

// 4
// const str = 'casa';

// 110
const str = 'estemensajedebetenerunpayloadof110caracteressoigointtowritesomelettersthatcompletethemaxlengthoftheframeiliked';

// 240
// const str = 'anotherestemensajedebetenerunpayloadof110caracteressoigointtowritesomelettersthatcompletethemaxlengthoftheframeilikedqwersdfasdasdfasdfdsfasdfweregfsdgapoiewjifoksfpoeijoweifoewirjkkpwoierfioermfpodskmpoerfpo3i4jgip34jwer34kwjepoirtu3p4wert';

// 107
// const str = 'bc/engs?ts=1649420436&st=END&dh=3&vD=null,13.67,null&cD=null,6.03,null&vE=null,13.68,null&cE=null,0.07,null';

const remoteTransmitGW = (xbeeObject, remote64, data ='') => (
  new Promise((resolve, reject) => {
      countTransmit1 = countTransmit1+1;
      debugGW('[out] [GW] [%o] package %o: %o', countTransmit1, remote64, data);
      xbeeObject.remoteTransmit({
        destination64: remote64,
        data,
      }).subscribe(
        (response) =>  resolve(response),
        (error) => reject(console.log('[GW] %o',error)),
        () =>  resolve('ok'),
      );
  })
);
const remoteTransmit2 = (xbeeObject, remote64, data ='') => (
  new Promise((resolve, reject) => {
    countTransmit2 = countTransmit2+1;
      debugNode1('[out] [N1] [%o] package %o: %o', countTransmit2, remote64, data);
      xbeeObject.remoteTransmit({
        destination64: remote64,
        data,
      }).subscribe(
        (response) =>  resolve(response),
        (error) => reject(console.log('[N1] %o',error)),
        () =>  resolve('ok'),
      );
  })
);

const remoteTransmit3 = (xbeeObject, remote64, data ='') => (
  new Promise((resolve, reject) => {
    countTransmit3 = countTransmit3+1;
      debugNode2('[out] [N2] [%o] package %o: %o', countTransmit3, remote64, data);
      xbeeObject.remoteTransmit({
        destination64: remote64,
        data,
      }).subscribe(
        (response) =>  resolve(response),
        (error) => reject(console.log('[N2] %o',error)),
        () =>  resolve('ok'),
      );
  })
);

xbee1.monitorTransmissions()
  .subscribe(async (transmissionPacket) => {
    const packetData = transmissionPacket.data.toString();
    const { remote64 } = transmissionPacket;
    countReceive1 = countReceive1+1;
    debugGW('[in] [GW] [%o] package %o: %o', countReceive1, remote64, packetData);
  })
xbee2.monitorTransmissions()
  .subscribe(async (transmissionPacket) => {
    const packetData = transmissionPacket.data.toString();
    const { remote64 } = transmissionPacket;
    countReceive2 = countReceive2+1;
    debugNode1('[in] [N1] [%o] package %o: %o', countReceive2, remote64, packetData);
  })

xbee3.monitorTransmissions()
  .subscribe(async (transmissionPacket) => {
    const packetData = transmissionPacket.data.toString();
    const { remote64 } = transmissionPacket;
    countReceive3 = countReceive3+1;
    debugNode2('[in] [N2] [%o] package %o: %o', countReceive3, remote64, packetData);
  })

  const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return '00:'+ minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

const fillArrayFunctions = (array) => {
  for (let index = 0; index < packetsToSend; index++) {
    array.push(remoteTransmitGW(xbee1, xbeeArray[1], str));
    array.push(remoteTransmitGW(xbee1, xbeeArray[2], str));
    array.push(remoteTransmit2(xbee2, xbeeArray[0], str));
    array.push(remoteTransmit3(xbee3, xbeeArray[0], str));
  }
  return array;
}

const execute = async (array) => {
  const initTime = performance.now()
  debug('init time: ', initTime);

  try {
    await Promise.all(array);
  } catch (err) {
    errors(err);
  }

  const endTime = performance.now()
  debug('end time: ', endTime);

  debug(`Process of remoteTransmit took  ${endTime - initTime}  milliseconds.`);
  debug(`Process of remoteTransmit took  ${millisToMinutesAndSeconds(endTime - initTime)}  minutes.`);
  // process.exit();
}

arrayFunctions = fillArrayFunctions(arrayFunctions);

execute(arrayFunctions);



// /**
//  * ASYNC create object if fail serialport
//  * ========================================================================================================
//  */

// const xbeeRx = require('xbee-rx');
// const { performance } = require('perf_hooks');

// var debug = require('debug')('bcg:o');
// var errors = require('debug')('bcg:error');
// var debugGW = require('debug')('bcg:gw');
// var debugNode1 = require('debug')('bcg:nod1');
// var debugNode2 = require('debug')('bcg:nod2');

// // xbee options
// const xbeeOptions = {
//   serialport: '/dev/ttyUSB0',
//   serialPortOptions: {
//     baudRate: 9600,
//     // lock: false,
//     autoOpen: false,
//     usePromises: true,
//   },
//   module: 'ZigBee',
//   api_mode: 2,
//   defaultTimeoutMs: 30000,
//   // debug: true,
// };
// // xbee options
// const xbeeOptions2 = {
//   serialport: '/dev/ttyUSB1',
//   serialPortOptions: {
//     baudRate: 9600,
//     // lock: false,
//     autoOpen: false,
//     usePromises: true,
//   },
//   module: 'ZigBee',
//   api_mode: 2,
//   defaultTimeoutMs: 30000,
//   // debug: true,
// };
// // xbee options
// const xbeeOptions3 = {
//   serialport: '/dev/ttyUSB2',
//   serialPortOptions: {
//     baudRate: 9600,
//     // lock: false,
//     autoOpen: false,
//     usePromises: true,
//   },
//   module: 'ZigBee',
//   api_mode: 2,
//   defaultTimeoutMs: 30000,
//   // debug: true,
// };

// const xbeeRemote64_1 = '0013a20041de61d4';
// const xbeeRemote64_2 = '0013a20041de6174';
// // const xbeeRemote64_2 = '0013a20041de3597';
// const xbeeRemote64_gw = '0013a20041de3597';
// const xbeeArray = [xbeeRemote64_gw, xbeeRemote64_1, xbeeRemote64_2];
// // const xbeeArray = [xbeeRemote64_1, xbeeRemote64_2];

// const packetsToSend = 20;
// // const packetsToSend = 50;
// // const packetsToSend = 100;
// // const packetsToSend = 150;
// // const packetsToSend = 200;
// // const packetsToSend = 250;
// // const packetsToSend = 300;
// // const packetsToSend = 500;

// let countTransmit1 =0;
// let countTransmit2 =0;
// let countTransmit3 =0;

// let countReceive1 =0;
// let countReceive2 =0;
// let countReceive3 =0;

// // await new Promise((resolve) => setTimeout(resolve, 3000));

// let arrayFunctions= [];

// // 4
// // const str = 'casa';

// // 110
// const str = 'estemensajedebetenerunpayloadof110caracteressoigointtowritesomelettersthatcompletethemaxlengthoftheframeiliked';

// // 240
// // const str = 'anotherestemensajedebetenerunpayloadof110caracteressoigointtowritesomelettersthatcompletethemaxlengthoftheframeilikedqwersdfasdasdfasdfdsfasdfweregfsdgapoiewjifoksfpoeijoweifoewirjkkpwoierfioermfpodskmpoerfpo3i4jgip34jwer34kwjepoirtu3p4wert';

// // 107
// // const str = 'bc/engs?ts=1649420436&st=END&dh=3&vD=null,13.67,null&cD=null,6.03,null&vE=null,13.68,null&cE=null,0.07,null';

// let xbee1;
// let xbee2;
// let xbee3;




// const connectXbeeGW = () => {
//   try {
//     xbee1 = new xbeeRx(xbeeOptions);
//   xbee1.monitorTransmissions()
//   .subscribe(async (transmissionPacket) => {
//     const packetData = transmissionPacket.data.toString();
//     const { remote64 } = transmissionPacket;
//     countReceive1 = countReceive1+1;
//     debugGW('[in] [GW] [%o] package %o: %o', countReceive1, remote64, packetData);
//   },
//   (error) => console.log('[GW]=====================> %o', error),
//   ()=>console.log('ok'))
//   } catch (error) {
//     console.log('lllllllllllllllllllllllerror');
//   }
// }
// const connectXbee2 = () => {
//   xbee2 = new xbeeRx(xbeeOptions2);
//   xbee2.monitorTransmissions()
//     .subscribe(async (transmissionPacket) => {
//       const packetData = transmissionPacket.data.toString();
//       const { remote64 } = transmissionPacket;
//       countReceive2 = countReceive2+1;
//       debugNode1('[in] [N1] [%o] package %o: %o', countReceive2, remote64, packetData);
//     },
//     (error) => console.log('[N1] %o', error),
//     ()=>console.log('==================================>ok'))
// }
// const connectXbee3 = () => {
//   xbee3 = new xbeeRx(xbeeOptions3);
//   xbee3.monitorTransmissions()
//     .subscribe(async (transmissionPacket) => {
//       const packetData = transmissionPacket.data.toString();
//       const { remote64 } = transmissionPacket;
//       countReceive3 = countReceive3+1;
//       debugNode2('[in] [N2] [%o] package %o: %o', countReceive3, remote64, packetData);
//     },
//     (error) => console.log('[N2] %o=================================>', error),
//     ()=>console.log('ok'))
// }





// const remoteTransmitGW = (xbeeObject, remote64, data ='') => (
//   new Promise((resolve, reject) => {
//       countTransmit1 = countTransmit1+1;
//       debugGW('[out] [GW] [%o] package %o: %o', countTransmit1, remote64, data);
//       xbeeObject.remoteTransmit({
//         destination64: remote64,
//         data,
//       }).subscribe(
//         (response) =>  resolve(response),
//         (error) => {
//           if (error.message === 'Timed out after 30000 ms') {
//             // xbeeObject.close();
//             // connectXbeeGW();
//             setTimeout(()=>{
//               console.log('RECONNECTING TO XBEE');
//               connectXbeeGW();
//             }, 2000);
//             // xbee1.serialport.close();
//           }
//           reject(console.log('[GW] %o',error))},
//         () =>  resolve('ok'),
//       );
//   })
// );
// const remoteTransmit2 = (xbeeObject, remote64, data ='') => (
//   new Promise((resolve, reject) => {
//     countTransmit2 = countTransmit2+1;
//       debugNode1('[out] [N1] [%o] package %o: %o', countTransmit2, remote64, data);
//       xbeeObject.remoteTransmit({
//         destination64: remote64,
//         data,
//       }).subscribe(
//         (response) =>  resolve(response),
//         (error) => {
//           if (error.message === 'Timed out after 30000 ms') {
//             // xbeeObject.close();
//             setTimeout(()=>{
//               console.log('RECONNECTING TO XBEE');
//               connectXbee2();
//             }, 2000);
//             // connectXbee2();
//             // xbee2.close();
//             // xbee2.serialport.close();
//           }
//           reject(console.log('[N1] %o',error))},
//         () =>  resolve('ok'),
//       );
//   })
// );

// const remoteTransmit3 = (xbeeObject, remote64, data ='') => (
//   new Promise((resolve, reject) => {
//     countTransmit3 = countTransmit3+1;
//       debugNode2('[out] [N2] [%o] package %o: %o', countTransmit3, remote64, data);
//       xbeeObject.remoteTransmit({
//         destination64: remote64,
//         data,
//       }).subscribe(
//         (response) =>  resolve(response),
//         (error) => {
//           if (error.message === 'Timed out after 30000 ms') {
//             // xbeeObject.close();
//             // connectXbee3();
//             setTimeout(()=>{
//               console.log('RECONNECTING TO XBEE');
//               connectXbee3();
//             }, 2000);
//             // xbee3.close();
//             // xbee3.serialport.close();
//           }
//           reject(console.log('[N2] %o',error))},
//         () =>  resolve('ok'),
//       );
//   })
// );

// const millisToMinutesAndSeconds = (millis) => {
//   var minutes = Math.floor(millis / 60000);
//   var seconds = ((millis % 60000) / 1000).toFixed(0);
//   return '00:'+ minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
// }

// const fillArrayFunctions = (array) => {
// for (let index = 0; index < packetsToSend; index++) {
//   array.push(remoteTransmitGW(xbee1, xbeeArray[1], str));
//   array.push(remoteTransmitGW(xbee1, xbeeArray[2], str));
//   array.push(remoteTransmit2(xbee2, xbeeArray[0], str));
//   array.push(remoteTransmit3(xbee3, xbeeArray[0], str));
// }
// return array;
// }

// const execute = async (array) => {
// const initTime = performance.now()
// debug('init time: ', initTime);

// try {
//   await Promise.all(array);
// } catch (err) {
//   errors(err);
// }

// const endTime = performance.now()
// debug('end time: ', endTime);

// debug(`Process of remoteTransmit took  ${endTime - initTime}  milliseconds.`);
// debug(`Process of remoteTransmit took  ${millisToMinutesAndSeconds(endTime - initTime)}  minutes.`);
// // process.exit();
// }





// const start = async () => {
//   await connectXbeeGW();
//   await connectXbee2();
//   await connectXbee3();
//   arrayFunctions = fillArrayFunctions(arrayFunctions);

//   await execute(arrayFunctions);
// }

// start();