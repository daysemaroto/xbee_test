// node src/receiveAudio-cli.js --port /dev/ttyUSB0 --baud 115200 --module ZigBee --out ./logs/recordings/baxx --ackEvery 0 --play
const xbeeRx = require('xbee-rx');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] || def : def;
}
function flag(name) {
  return process.argv.includes(`--${name}`);
}
const PORT = arg('port', '/dev/ttyUSB0');
const BAUD = parseInt(arg('baud', '9600'), 10);
const MODULE = arg('module', 'ZigBee');
const OUTDIR = arg('out', './logs/recordings/baxx');
const ACK_EVERY = parseInt(arg('ackEvery', '0'), 10);
const AUTO_PLAY = flag('play');
const API_MODE = 2;
if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

const xbee = xbeeRx({
  serialport: PORT,
  serialPortOptions: { baudRate: BAUD },
  module: MODULE,
  api_mode: API_MODE,
  defaultTimeoutMs: 30000,
});

const files = new Map(); // fileName -> { totalLen, receivedBytes, offsets:Set, firstTs:number, from64:string }

function ackBack(to64, fileName, offset, received, total) {
  if (!to64 || ACK_EVERY <= 0) return;
  const n = Math.floor(offset / 1);
  if (n % ACK_EVERY !== 0) return;
  const msg = `ACK|${fileName}|${offset}|${received}/${total}`;
  xbee.remoteTransmit({ destination64: to64, data: msg }).subscribe(
    () => {},
    () => {},
    () => {}
  );
}

function maybePlay(filePath) {
  if (!AUTO_PLAY) return;
  const p = spawn(
    'ffplay',
    ['-autoexit', '-nodisp', '-loglevel', 'error', filePath],
    { stdio: 'inherit' }
  );
  p.on('error', () => console.log('ffplay no disponible'));
}

function handleDataString(str, from64) {
  if (str.startsWith('PING|')) {
    console.log('RX PING:', str);
    return;
  }
  if (str.startsWith('END|')) {
    console.log('RX END:', str);
    return;
  }

  const s1 = str.indexOf('|'),
    s2 = str.indexOf('|', s1 + 1),
    s3 = str.indexOf('|', s2 + 1),
    s4 = str.indexOf('|', s3 + 1);
  if (s1 < 0 || s2 < 0 || s3 < 0 || s4 < 0) {
    console.log('RX texto:', str);
    return;
  }

  const fileName = str.slice(0, s1);
  const offset = parseInt(str.slice(s1 + 1, s2), 10);
  const totalLen = parseInt(str.slice(s2 + 1, s3), 10);
  const chunkLen = parseInt(str.slice(s3 + 1, s4), 10);
  const b64 = str.slice(s4 + 1);
  const chunk = Buffer.from(b64, 'base64');

  const filePath = path.join(OUTDIR, fileName);
  let st = files.get(fileName);
  if (!st) {
    st = {
      totalLen,
      receivedBytes: 0,
      offsets: new Set(),
      firstTs: Date.now(),
      from64,
    };
    files.set(fileName, st);
    const fd0 = fs.openSync(filePath, 'w+');
    fs.ftruncateSync(fd0, totalLen);
    fs.closeSync(fd0);
  }

  if (st.offsets.has(offset)) return;
  const fd = fs.openSync(filePath, 'r+');
  fs.writeSync(fd, chunk, 0, chunk.length, offset);
  fs.closeSync(fd);

  st.offsets.add(offset);
  st.receivedBytes += chunk.length;
  st.from64 = from64;
  console.log(
    `RX ${fileName}@${offset} (+${chunk.length}) => ${st.receivedBytes}/${st.totalLen}`
  );
  ackBack(from64, fileName, offset, st.receivedBytes, st.totalLen);

  if (st.receivedBytes >= st.totalLen) {
    const ms = Date.now() - st.firstTs;
    const sec = ms / 1000;
    const bps = (st.totalLen * 8) / sec;
    console.log(
      `✅ Completo: ${fileName} (${st.totalLen} B) en ${ms} ms  →  ${(bps / 1000).toFixed(1)} kbps`
    );
    files.delete(fileName);
    maybePlay(filePath);
  }
}

xbee.allPackets.subscribe((p) => {
  if (p && p.remote64 && p.data != null) {
    const str =
      typeof p.data === 'string' ? p.data : Buffer.from(p.data).toString();
    handleDataString(str, p.remote64);
  }
});
console.log(`Escuchando en ${PORT} (${MODULE}, ${BAUD}bps) ...`);
