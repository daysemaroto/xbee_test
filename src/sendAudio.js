// node src/sendAudio-cli.js --file /ruta/audio.ogg --dest 0013a20041de6174 --port /dev/ttyUSB1 --baud 115200 --module ZigBee --chunk 120 --pace 2 --maxFrame 220
const fs = require('fs');
const xbeeRx = require('xbee-rx');
const path = require('path');
const { performance } = require('perf_hooks');

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] || def : def;
}
const FILE_PATH = arg('file', '');
const DEST = arg('dest', '');
const PORT = arg('port', '/dev/ttyUSB1');
const BAUD = parseInt(arg('baud', '9600'), 10);
const MODULE = arg('module', 'ZigBee'); // ZigBee | DigiMesh | 802.15.4
const RAW_CHUNK = parseInt(arg('chunk', '60'), 10); // bytes crudos (antes de base64)
const PACE_MS = parseInt(arg('pace', '10'), 10); // delay entre chunks
const MAX_FRAME = parseInt(arg('maxFrame', '200'), 10); // límite suave para el tamaño del string
const API_MODE = 2;

if (!FILE_PATH || !DEST) {
  console.error(
    'Uso: --file <ruta> --dest <mac64> [--port --baud --module --chunk --pace --maxFrame]'
  );
  process.exit(1);
}

const xbee = xbeeRx({
  serialport: PORT,
  serialPortOptions: { baudRate: BAUD },
  module: MODULE,
  api_mode: API_MODE,
  defaultTimeoutMs: 30000,
});

let countTx = 0;
const remoteTx = (data = '') =>
  new Promise((res, rej) => {
    countTx++;
    if (countTx <= 3 || countTx % 100 === 0)
      console.log('[out][%d] (%d chars)', countTx, data.length);
    xbee.remoteTransmit({ destination64: DEST, data }).subscribe(
      () => {},
      rej,
      () => res('ok')
    );
  });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const buf = fs.readFileSync(FILE_PATH);
  const fileName = path.basename(FILE_PATH);
  const totalLen = buf.length;
  const totalChunks = Math.ceil(totalLen / RAW_CHUNK);

  // Ping de prueba
  await remoteTx('PING|' + Date.now());

  console.log(
    `Enviando ${fileName} (${totalLen} bytes) en ${totalChunks} chunks...`
  );
  const t0 = performance.now();

  let wireChars = 0; // suma de caracteres (aprox bytes en aire)
  for (let i = 0; i < totalChunks; i++) {
    const offset = i * RAW_CHUNK;
    const chunk = buf.slice(offset, offset + RAW_CHUNK);

    const header = `${fileName}|${offset}|${totalLen}|${chunk.length}|`;
    const body = chunk.toString('base64');
    const dataStr = header + body;

    if (dataStr.length > MAX_FRAME) {
      console.warn(
        `⚠️ Chunk ${i} stringLen=${dataStr.length} > maxFrame=${MAX_FRAME}. Sube --maxFrame o baja --chunk.`
      );
    }
    wireChars += dataStr.length;

    await remoteTx(dataStr);
    if (PACE_MS > 0) await sleep(PACE_MS);
  }

  await remoteTx(`END|${fileName}|${totalLen}|${totalChunks}`);
  const t1 = performance.now();

  const ms = t1 - t0;
  const sec = ms / 1000;
  const payload_bps = (totalLen * 8) / sec;
  const wire_bps = (wireChars * 8) / sec; // aprox (1 char ≈ 1 byte)
  console.log('✅ Envío completo.');
  console.log(`Tiempo: ${ms.toFixed(0)} ms  (${sec.toFixed(2)} s)`);
  console.log(
    `Payload: ${totalLen} B  →  ${(payload_bps / 1000).toFixed(1)} kbps`
  );
  console.log(
    `Sobre-aire (base64+header): ${wireChars} chars  →  ${(wire_bps / 1000).toFixed(1)} kbps`
  );
})().catch((err) => {
  console.error('Error en envío:', err);
  process.exit(1);
});
