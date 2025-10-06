// node src/receiveAudio-bce.js --port /dev/ttyUSB0 --baud 9600 --module ZigBee --out ./logs/recordings/baxx --play
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
const MODULE = arg('module', 'ZigBee'); // ZigBee | DigiMesh | 802.15.4
const OUTDIR = arg('out', './logs/recordings/baxx');
const AUTOPLAY = flag('play');
const API_MODE = 2;

if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

const xbee = xbeeRx({
  serialport: PORT,
  serialPortOptions: { baudRate: BAUD },
  module: MODULE,
  api_mode: API_MODE,
  defaultTimeoutMs: 30000,
});

// Estado por ID
// id -> { fileName, totalLen, path, receivedBytes, offsets:Set, firstTs, from64 }
const files = new Map();

function play(filePath) {
  if (!AUTOPLAY) return;
  const p = spawn(
    'ffplay',
    ['-autoexit', '-nodisp', '-loglevel', 'error', filePath],
    { stdio: 'inherit' }
  );
  p.on('error', () => console.log('ffplay no disponible'));
}

function onBEGIN(id, fileName, totalLen) {
  const filePath = path.join(OUTDIR, fileName);
  const fd0 = fs.openSync(filePath, 'w+');
  fs.ftruncateSync(fd0, totalLen);
  fs.closeSync(fd0);
  files.set(id, {
    fileName,
    totalLen,
    path: filePath,
    receivedBytes: 0,
    offsets: new Set(),
    firstTs: Date.now(),
    from64: '',
  });
  console.log(
    `BEGIN id=${id} file=${fileName} total=${totalLen} → ${filePath}`
  );
}

function onCHUNK(id, offset, len, b64, from64) {
  const st = files.get(id);
  if (!st) return console.warn(`CHUNK recibido para id desconocido: ${id}`);
  const chunk = Buffer.from(b64, 'base64');
  if (chunk.length !== len) {
    console.warn(
      `Len inconsistente id=${id}@${offset}: esperado=${len} real=${chunk.length}`
    );
  }
  if (st.offsets.has(offset)) return; // duplicado

  const fd = fs.openSync(st.path, 'r+');
  fs.writeSync(fd, chunk, 0, chunk.length, offset);
  fs.closeSync(fd);

  st.offsets.add(offset);
  st.receivedBytes += chunk.length;
  st.from64 = from64;
  console.log(
    `RX id=${id} ${st.fileName}@${offset} (+${chunk.length}) => ${st.receivedBytes}/${st.totalLen}`
  );
}

function onEND(id) {
  const st = files.get(id);
  if (!st) return console.warn(`END para id desconocido: ${id}`);
  const ms = Date.now() - st.firstTs;
  const s = ms / 1000;
  const kbps = (st.totalLen * 8) / 1000 / s;
  const done = st.receivedBytes >= st.totalLen;
  console.log(
    `${done ? '✅ Completo' : '⚠️ Incompleto'}: id=${id} ${st.fileName} (${st.receivedBytes}/${st.totalLen}) en ${ms} ms → ${kbps.toFixed(2)} kbps`
  );
  if (done) play(st.path);
  files.delete(id);
}

function handleFrame(str, from64) {
  if (str.startsWith('PING|')) {
    console.log('RX PING:', str);
    return;
  }

  // Formatos:
  // B|<id>|<fileName>|<totalLen>
  // C|<id>|<offset>|<len>|<b64>
  // E|<id>
  const type = str[0];

  if (type === 'B' && str[1] === '|') {
    // Usar split y NO .at() (Node 14)
    const parts = str.split('|'); // ["B", id, fileName (puede tener '|'), totalLen]
    if (parts.length >= 4) {
      const id = parts[1];
      const totalLen = parseInt(parts[parts.length - 1], 10); // <- sin .at()
      const fileName = parts.slice(2, parts.length - 1).join('|'); // preserva '|' en nombre si existiera
      onBEGIN(id, fileName, totalLen);
    }
    return;
  }

  if (type === 'C' && str[1] === '|') {
    const p1 = str.indexOf('|', 2);
    const p2 = str.indexOf('|', p1 + 1);
    const p3 = str.indexOf('|', p2 + 1);
    if (p1 < 0 || p2 < 0 || p3 < 0) {
      console.log('CHUNK malformado');
      return;
    }

    const id = str.slice(2, p1);
    const offset = parseInt(str.slice(p1 + 1, p2), 10);
    const len = parseInt(str.slice(p2 + 1, p3), 10);
    const b64 = str.slice(p3 + 1);
    onCHUNK(id, offset, len, b64, from64);
    return;
  }

  if (type === 'E' && str[1] === '|') {
    const id = str.slice(2);
    onEND(id);
    return;
  }

  console.log('RX texto:', str);
}

xbee.allPackets.subscribe((p) => {
  if (p && p.remote64 && p.data != null) {
    const str =
      typeof p.data === 'string' ? p.data : Buffer.from(p.data).toString();
    handleFrame(str, p.remote64);
  }
});

console.log(`Escuchando en ${PORT} (${MODULE}, ${BAUD} bps) ...`);
