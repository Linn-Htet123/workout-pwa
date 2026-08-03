// ---------------------------------------------------------------------------
// Generates black-and-white dumbbell PNG icons with ZERO dependencies.
// Pure Node: we draw pixels into a buffer and encode a real PNG using zlib.
//
// Run with:  npm run icons
// Outputs into public/icons/.
// ---------------------------------------------------------------------------

const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

// ---- Tiny PNG encoder (RGBA, 8-bit) --------------------------------------

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
    }
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Raw scanlines with a leading filter byte (0 = none) per row.
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- Drawing --------------------------------------------------------------

const BLACK = [0, 0, 0, 255];
const WHITE = [255, 255, 255, 255];

function makeCanvas(size, bg) {
  const buf = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    buf[i * 4] = bg[0];
    buf[i * 4 + 1] = bg[1];
    buf[i * 4 + 2] = bg[2];
    buf[i * 4 + 3] = bg[3];
  }
  return buf;
}

// Fill a rectangle given in normalized coords (0..1) inside a content box.
function fillRectNorm(buf, size, box, nx0, ny0, nx1, ny1, color) {
  const bx = box.x0 + nx0 * box.w;
  const by = box.y0 + ny0 * box.h;
  const bx1 = box.x0 + nx1 * box.w;
  const by1 = box.y0 + ny1 * box.h;
  const x0 = Math.round(bx);
  const y0 = Math.round(by);
  const x1 = Math.round(bx1);
  const y1 = Math.round(by1);
  for (let y = y0; y < y1; y++) {
    if (y < 0 || y >= size) continue;
    for (let x = x0; x < x1; x++) {
      if (x < 0 || x >= size) continue;
      const i = (y * size + x) * 4;
      buf[i] = color[0];
      buf[i + 1] = color[1];
      buf[i + 2] = color[2];
      buf[i + 3] = color[3];
    }
  }
}

// Draws a horizontal dumbbell. `inset` reserves a safe margin (for maskable).
function drawDumbbell(size, inset) {
  const buf = makeCanvas(size, BLACK);
  const m = size * inset;
  const box = { x0: m, y0: m, w: size - 2 * m, h: size - 2 * m };
  const bar = WHITE;

  // handle bar
  fillRectNorm(buf, size, box, 0.3, 0.44, 0.7, 0.56, bar);
  // left plates (inner + outer)
  fillRectNorm(buf, size, box, 0.22, 0.34, 0.3, 0.66, bar);
  fillRectNorm(buf, size, box, 0.14, 0.28, 0.22, 0.72, bar);
  // right plates (inner + outer)
  fillRectNorm(buf, size, box, 0.7, 0.34, 0.78, 0.66, bar);
  fillRectNorm(buf, size, box, 0.78, 0.28, 0.86, 0.72, bar);
  return buf;
}

// ---- Output ---------------------------------------------------------------

const outDir = path.join(__dirname, "..", "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

function write(name, size, inset) {
  const rgba = drawDumbbell(size, inset);
  const png = encodePng(size, size, rgba);
  fs.writeFileSync(path.join(outDir, name), png);
  console.log("wrote", name, `(${size}x${size})`);
}

// "any" icons — dumbbell fills most of the square
write("icon-192.png", 192, 0.0);
write("icon-512.png", 512, 0.0);
// maskable icons — keep art inside the safe zone so it is not clipped
write("icon-192-maskable.png", 192, 0.14);
write("icon-512-maskable.png", 512, 0.14);
// apple touch icon — iOS rounds the corners itself
write("apple-touch-icon.png", 180, 0.06);

console.log("Done. Icons in public/icons/");
