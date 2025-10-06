// node src/sendAudio-bce.js --file ./sendaudios/ba1098/2025-04-03T1420.ogg --dest 0013a20041de6174 --port /dev/ttyUSB1 --baud 9600 --module ZigBee --chunk 120 --pace 2 --maxFrame 240 --id A1
const fs = require('fs');
const path = require('path');
const xbeeRx = require('xbee-rx');
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
const RAW_CHUNK = parseInt(arg('chunk', '120'), 10); // bytes crudos antes de base64
const PACE_MS = parseInt(arg('pace', '2'), 10); // delay entre fragmentos
const MAX_FRAME = parseInt(arg('maxFrame', '240'), 10); // límite de longitud (caracteres) del string a TX
const ID = arg('id', Date.now().toString(36).slice(-3).toUpperCase());
const API_MODE = 2;

if (!FILE_PATH || !DEST) {
  console.error(
    'Uso: --file <ruta> --dest <mac64> [--port --baud --module --chunk --pace --maxFrame --id]'
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

const remoteTx = (data = '') =>
  new Promise((resolve, reject) => {
    xbee.remoteTransmit({ destination64: DEST, data }).subscribe(
      () => {},
      (err) => reject(err),
      () => resolve('ok')
    );
  });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const buf = fs.readFileSync(FILE_PATH);
  const fileName = path.basename(FILE_PATH);
  const totalLen = buf.length;

  // Mensaje BEGIN (reduce cabecera por chunk)
  const beginStr = `B|${ID}|${fileName}|${totalLen}`;
  if (beginStr.length > MAX_FRAME) {
    console.error(
      `BEGIN excede maxFrame (${beginStr.length} > ${MAX_FRAME}). Usa --id más corto o renombra archivo.`
    );
    process.exit(1);
  }

  // Estimar longitud típica de CHUNK para validar
  const probeHeader = `C|${ID}|0|${Math.min(RAW_CHUNK, totalLen)}|`;
  const probeBodyLen = Buffer.alloc(Math.min(RAW_CHUNK, totalLen)).toString(
    'base64'
  ).length;
  const probeLen = probeHeader.length + probeBodyLen;
  if (probeLen > MAX_FRAME) {
    console.error(
      `CHUNK estimado excede maxFrame (${probeLen} > ${MAX_FRAME}). Baja --chunk o sube --maxFrame.`
    );
    process.exit(1);
  }

  await remoteTx('PING|' + Date.now()); // visibilidad rápida en RX
  await remoteTx(beginStr);

  let wireChars = beginStr.length;
  const t0 = performance.now();

  const totalChunks = Math.ceil(totalLen / RAW_CHUNK);
  console.log(
    `ID=${ID}  Enviando ${fileName} (${totalLen} B) en ${totalChunks} chunks...`
  );

  for (let i = 0; i < totalChunks; i++) {
    const offset = i * RAW_CHUNK;
    const chunk = buf.slice(offset, offset + RAW_CHUNK);
    const bodyB64 = chunk.toString('base64'); // string requerido por xbee-rx
    const dataStr = `C|${ID}|${offset}|${chunk.length}|` + bodyB64;

    if (dataStr.length > MAX_FRAME) {
      console.warn(
        `⚠️ frame ${i}=${dataStr.length} > maxFrame=${MAX_FRAME}. Abortando.`
      );
      process.exit(1);
    }

    await remoteTx(dataStr);
    wireChars += dataStr.length;
    if (PACE_MS > 0) await sleep(PACE_MS);
  }

  const endStr = `E|${ID}`;
  await remoteTx(endStr);
  wireChars += endStr.length;

  const t1 = performance.now();
  const ms = t1 - t0,
    s = ms / 1000;
  const payloadKbps = (totalLen * 8) / 1000 / s;
  const wireKbps = (wireChars * 8) / 1000 / s;

  console.log('✅ Envío completo.');
  console.log(`Tiempo: ${ms.toFixed(0)} ms (${s.toFixed(2)} s)`);
  console.log(`Payload: ${payloadKbps.toFixed(2)} kbps`);
  console.log(`Sobre-aire: ${wireKbps.toFixed(2)} kbps (incluye BEGIN/END)`);
})().catch((err) => {
  console.error('Error en envío:', err);
  process.exit(1);
});
