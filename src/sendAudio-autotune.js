// node src/sendAudio-autotune.js --file ./sendaudios/ba1098/2025-04-03T1420.ogg --dest 0013a20041de6174 --port /dev/ttyUSB1 --baud 9600 --module ZigBee --chunks 80,100,120,140,160 --pace 5 --maxFrame 240
const fs = require('fs');
const path = require('path');
const xbeeRx = require('xbee-rx');
const { performance } = require('perf_hooks');

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] || def : def;
}
function list(name, def) {
  const v = arg(name, def);
  return String(v)
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n));
}

const FILE_PATH = arg('file', '');
const DEST = arg('dest', '');
const PORT = arg('port', '/dev/ttyUSB1');
const BAUD = parseInt(arg('baud', '9600'), 10);
const MODULE = arg('module', 'ZigBee'); // ZigBee | DigiMesh | 802.15.4
const CHUNKS = list('chunks', '80,100,120,140'); // lista de tamaños crudos
const PACE_MS = parseInt(arg('pace', '5'), 10); // delay entre envíos (ms)
const MAX_FRAME = parseInt(arg('maxFrame', '240'), 10);
const API_MODE = 2;

if (!FILE_PATH || !DEST) {
  console.error(
    'Uso: --file <ruta> --dest <mac64> [--port --baud --module --chunks 80,100,... --pace --maxFrame]'
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
  const srcBuf = fs.readFileSync(FILE_PATH);
  const baseName = path.basename(FILE_PATH);
  const ext = path.extname(baseName);
  const nameNoExt = baseName.slice(0, baseName.length - ext.length);

  const results = [];
  console.log(
    `Autotune sobre ${baseName} (${srcBuf.length} B) @ ${BAUD} bps\n`
  );

  for (const rawChunk of CHUNKS) {
    const id = Date.now().toString(36) + '-' + rawChunk;
    // Variamos el nombre remoto para que el receptor guarde archivos separados
    const remoteName = `${nameNoExt}.c${rawChunk}${ext}`;
    const totalLen = srcBuf.length;
    const totalChunks = Math.ceil(totalLen / rawChunk);

    // Probar longitud de un frame típico
    const headerProbe = `${remoteName}|0|${totalLen}|${Math.min(rawChunk, totalLen)}|`;
    const bodyProbeLen = Buffer.alloc(Math.min(rawChunk, totalLen)).toString(
      'base64'
    ).length;
    const probeLen = headerProbe.length + bodyProbeLen;
    if (probeLen > MAX_FRAME) {
      console.log(
        `❌ chunk=${rawChunk}: frame estimado ${probeLen} chars > maxFrame=${MAX_FRAME} → omitido`
      );
      results.push({
        chunk: rawChunk,
        ms: null,
        payloadKbps: null,
        wireKbps: null,
        note: 'overflow',
      });
      continue;
    }

    console.log(
      `▶️  chunk=${rawChunk} (${totalChunks} fragmentos aprox, frame≈${probeLen} chars)`
    );

    // PING para ver RX en el receptor
    await remoteTx('PING|' + Date.now());

    let wireChars = 0;
    const t0 = performance.now();

    for (let i = 0; i < totalChunks; i++) {
      const offset = i * rawChunk;
      const chunk = srcBuf.slice(offset, offset + rawChunk);
      const header = `${remoteName}|${offset}|${totalLen}|${chunk.length}|`;
      const body = chunk.toString('base64');
      const dataStr = header + body;

      if (dataStr.length > MAX_FRAME) {
        console.log(
          `⚠️  chunk=${rawChunk} frame real=${dataStr.length} > maxFrame=${MAX_FRAME} → abortado`
        );
        results.push({
          chunk: rawChunk,
          ms: null,
          payloadKbps: null,
          wireKbps: null,
          note: 'overflow-runtime',
        });
        break;
      }

      wireChars += dataStr.length;
      await remoteTx(dataStr);
      if (PACE_MS > 0) await sleep(PACE_MS);
    }

    await remoteTx(`END|${remoteName}|${totalLen}|${totalChunks}`);
    const t1 = performance.now();
    const ms = t1 - t0;
    const sec = ms / 1000;
    const payloadKbps = (totalLen * 8) / 1000 / sec;
    const wireKbps = (wireChars * 8) / 1000 / sec;

    if (!Number.isFinite(payloadKbps)) {
      // ya registrado como overflow-runtime
    } else {
      console.log(
        `✅ chunk=${rawChunk}: ${ms.toFixed(0)} ms → payload ${payloadKbps.toFixed(2)} kbps, aire ${wireKbps.toFixed(2)} kbps\n`
      );
      results.push({
        chunk: rawChunk,
        ms: Math.round(ms),
        payloadKbps: +payloadKbps.toFixed(2),
        wireKbps: +wireKbps.toFixed(2),
        note: '',
      });
    }
  }

  // Tabla resumen
  console.log('\n===== RESULTADOS AUTOTUNE =====');
  // ordenar por ms ascendente
  results.sort((a, b) => (a.ms ?? 1e15) - (b.ms ?? 1e15));
  const pad = (s, n) => String(s).padEnd(n);
  console.log(
    pad('chunk', 6),
    pad('ms', 8),
    pad('payload kbps', 14),
    pad('aire kbps', 11),
    'nota'
  );
  for (const r of results) {
    console.log(
      pad(r.chunk, 6),
      pad(r.ms ?? '-', 8),
      pad(r.payloadKbps ?? '-', 14),
      pad(r.wireKbps ?? '-', 11),
      r.note || ''
    );
  }
  console.log('================================\n');
})().catch((err) => {
  console.error('Autotune error:', err);
  process.exit(1);
});
