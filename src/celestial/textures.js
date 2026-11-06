/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Celestial texture generator and loader with a single unified Mars texture
*/
import * as THREE from 'three';

const TEXTURE_URLS = {
  earthDay: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
  earthSpecular: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
  earthNormal: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
  earthClouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
  earthLights: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
  moonAlbedo: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg',
  marsGlobal: '/assets/aistudio/1-mars-nasa-gov-jpg_e2a27276.webp',
  marsHillside: '/assets/mars_reference/mars_ref_2_hillside.jpg',
  marsCrossbedding: '/assets/mars_reference/mars_ref_3_crossbedding.jpg',
  marsRipples: '/assets/mars_reference/mars_ref_5_sand_ripple.jpg',
};

function createFallbackEarthDayCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 256);
  oceanGrad.addColorStop(0, '#102742');
  oceanGrad.addColorStop(0.5, '#0b1d36');
  oceanGrad.addColorStop(1, '#102742');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = '#2f5938';
  ctx.beginPath();
  ctx.ellipse(130, 90, 45, 30, -0.2, 0, Math.PI * 2);
  ctx.ellipse(160, 160, 35, 55, 0.2, 0, Math.PI * 2);
  ctx.ellipse(320, 80, 75, 35, 0.1, 0, Math.PI * 2);
  ctx.ellipse(300, 140, 40, 50, 0, 0, Math.PI * 2);
  ctx.ellipse(420, 180, 25, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#eef5ff';
  ctx.fillRect(0, 0, 512, 20);
  ctx.fillRect(0, 236, 512, 20);

  return canvas;
}

function createFallbackCloudsCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, 512, 256);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';

  for (let i = 0; i < 40; i++) {
    const cx = (Math.sin(i * 1.7) * 0.5 + 0.5) * 512;
    const cy = 40 + (Math.cos(i * 2.3) * 0.5 + 0.5) * 176;
    const rw = 30 + (i % 5) * 15;
    const rh = 10 + (i % 3) * 6;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rw, rh, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

function createFallbackLightsCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = '#ffd175';
  for (let i = 0; i < 240; i++) {
    const rx = 100 + ((i * 73) % 320);
    const ry = 60 + ((i * 41) % 120);
    const r = 0.8 + (i % 3) * 0.4;
    ctx.beginPath();
    ctx.arc(rx, ry, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

function createFallbackMoonCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#e5e9f2');
  bgGrad.addColorStop(0.5, '#d6dce8');
  bgGrad.addColorStop(1, '#e1e6f0');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  const maria = [
    { x: 330, y: 185, rx: 115, ry: 82 },
    { x: 475, y: 215, rx: 95, ry: 74 },
    { x: 615, y: 245, rx: 85, ry: 66 },
    { x: 255, y: 280, rx: 88, ry: 68 },
    { x: 540, y: 155, rx: 68, ry: 52 },
  ];
  for (const m of maria) {
    const mGrad = ctx.createRadialGradient(m.x, m.y, 10, m.x, m.y, m.rx);
    mGrad.addColorStop(0, 'rgba(136, 145, 162, 0.52)');
    mGrad.addColorStop(0.7, 'rgba(160, 168, 184, 0.28)');
    mGrad.addColorStop(1, 'rgba(214, 220, 232, 0)');
    ctx.fillStyle = mGrad;
    ctx.beginPath();
    ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 360; i++) {
    const cx = (i * 73) % 1024;
    const cy = (i * 41) % 512;
    const r = 3 + (i % 20);
    ctx.fillStyle = i % 3 === 0 ? 'rgba(170, 178, 192, 0.42)' : 'rgba(245, 248, 255, 0.55)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx - 1, cy - 1, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  return canvas;
}

export function paintMarsBaseCanvas(canvas) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#a83c0c');
  grad.addColorStop(0.5, '#cb5018');
  grad.addColorStop(1, '#872c07');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const darkPlains = [
    { u: 0.68, v: 0.45, rx: 0.11, ry: 0.13 },
    { u: 0.42, v: 0.25, rx: 0.14, ry: 0.11 },
    { u: 0.43, v: 0.58, rx: 0.16, ry: 0.10 },
    { u: 0.80, v: 0.28, rx: 0.14, ry: 0.11 },
  ];
  for (const p of darkPlains) {
    const px = p.u * width;
    const py = p.v * height;
    const pr = Math.max(p.rx * width, p.ry * height);
    const pg = ctx.createRadialGradient(px, py, pr * 0.1, px, py, pr);
    pg.addColorStop(0, 'rgba(54, 19, 7, 0.48)');
    pg.addColorStop(0.65, 'rgba(68, 24, 9, 0.24)');
    pg.addColorStop(1, 'rgba(68, 24, 9, 0)');
    ctx.fillStyle = pg;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  const shields = [
    { u: 0.128, v: 0.396, r: 0.046 },
    { u: 0.210, v: 0.438, r: 0.029 },
    { u: 0.186, v: 0.498, r: 0.027 },
    { u: 0.164, v: 0.552, r: 0.031 },
  ];
  for (const s of shields) {
    const sx = s.u * width;
    const sy = s.v * height;
    const sr = s.r * width;
    const rg = ctx.createRadialGradient(sx, sy, 1, sx, sy, sr);
    rg.addColorStop(0, '#f5a06e');
    rg.addColorStop(0.65, '#b54414');
    rg.addColorStop(1, 'rgba(181, 68, 20, 0)');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  const northCap = ctx.createLinearGradient(0, 0, 0, height * 0.055);
  northCap.addColorStop(0, 'rgba(248, 244, 240, 0.92)');
  northCap.addColorStop(0.65, 'rgba(248, 244, 240, 0.65)');
  northCap.addColorStop(1, 'rgba(248, 244, 240, 0)');
  ctx.fillStyle = northCap;
  ctx.fillRect(0, 0, width, Math.floor(height * 0.055));

  const southCap = ctx.createLinearGradient(0, height * 0.945, 0, height);
  southCap.addColorStop(0, 'rgba(248, 244, 240, 0)');
  southCap.addColorStop(0.35, 'rgba(248, 244, 240, 0.65)');
  southCap.addColorStop(1, 'rgba(248, 244, 240, 0.92)');
  ctx.fillStyle = southCap;
  ctx.fillRect(0, Math.floor(height * 0.945), width, Math.ceil(height * 0.055));

  return canvas;
}

function createFeatheredPatchCanvas(img, patchW, patchH, cropTop = 0.25) {
  const c = document.createElement('canvas');
  c.width = patchW;
  c.height = patchH;
  const g = c.getContext('2d');
  if (!g || !img) return c;

  const sx = Math.floor(img.width * 0.08);
  const sy = Math.floor(img.height * cropTop);
  const sw = Math.floor(img.width * 0.84);
  const sh = Math.floor(img.height * (0.94 - cropTop));
  g.drawImage(img, sx, sy, sw, sh, 0, 0, patchW, patchH);

  g.globalCompositeOperation = 'destination-in';
  const rMax = Math.min(patchW, patchH) * 0.5;
  const mask = g.createRadialGradient(
    patchW * 0.5,
    patchH * 0.5,
    rMax * 0.18,
    patchW * 0.5,
    patchH * 0.5,
    rMax
  );
  mask.addColorStop(0, 'rgba(255,255,255,0.95)');
  mask.addColorStop(0.62, 'rgba(255,255,255,0.68)');
  mask.addColorStop(0.88, 'rgba(255,255,255,0.22)');
  mask.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = mask;
  g.fillRect(0, 0, patchW, patchH);
  return c;
}

function drawWrappedPatch(ctx, width, patchCanvas, uCenter, yPos) {
  const pw = patchCanvas.width;
  const x = Math.floor(width * uCenter - pw * 0.5);
  ctx.drawImage(patchCanvas, x, yPos);
  if (x < 0) {
    ctx.drawImage(patchCanvas, x + width, yPos);
  } else if (x + pw > width) {
    ctx.drawImage(patchCanvas, x - width, yPos);
  }
}

export function paintMarsBumpCanvas(canvas, _mode = 'global-mola', refImages = {}) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, width, height);

  if (refImages.marsGlobal) {
    const gw = Math.floor(width * 0.58);
    const gh = Math.floor(height * 0.88);
    const globePatch = createFeatheredPatchCanvas(refImages.marsGlobal, gw, gh, 0.1);
    const yPos = Math.floor(height * 0.5 - gh * 0.5);
    ctx.save();
    ctx.globalAlpha = 0.68;
    drawWrappedPatch(ctx, width, globePatch, 0.0, yPos);
    drawWrappedPatch(ctx, width, globePatch, 0.36, yPos);
    drawWrappedPatch(ctx, width, globePatch, 0.70, yPos);
    ctx.restore();
  }

  const tiles = [refImages.marsHillside, refImages.marsCrossbedding, refImages.marsRipples];
  const validTiles = tiles.filter(Boolean);
  if (validTiles.length > 0) {
    const pw = Math.floor(width * 0.44);
    const ph = Math.floor(height * 0.70);
    const patches = validTiles.map((img) => createFeatheredPatchCanvas(img, pw, ph, 0.28));
    const centers = [0.0, 0.25, 0.50, 0.75];
    const yPos = Math.floor(height * 0.5 - ph * 0.5);
    ctx.save();
    ctx.globalAlpha = 0.38;
    ctx.globalCompositeOperation = 'overlay';
    centers.forEach((uCenter, idx) => {
      const p = patches[idx % patches.length];
      drawWrappedPatch(ctx, width, p, uCenter, yPos);
    });
    ctx.restore();
  }

  const shields = [
    { u: 0.128, v: 0.396, r: 0.046 },
    { u: 0.210, v: 0.438, r: 0.029 },
    { u: 0.186, v: 0.498, r: 0.027 },
    { u: 0.164, v: 0.552, r: 0.031 },
  ];
  for (const s of shields) {
    const sx = s.u * width;
    const sy = s.v * height;
    const sr = s.r * width;
    const rg = ctx.createRadialGradient(sx, sy, sr * 0.12, sx, sy, sr);
    rg.addColorStop(0, '#ffffff');
    rg.addColorStop(0.65, '#b8b8b8');
    rg.addColorStop(1, 'rgba(128, 128, 128, 0)');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#454545';
    ctx.beginPath();
    ctx.arc(sx, sy, sr * 0.16, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 65; i++) {
    const cx = ((i * 97 + 31) % 980) * (width / 1000);
    const cy = (45 + ((i * 67) % 420)) * (height / 512);
    const cr = (3 + (i % 9) * 1.8) * (width / 1024);
    ctx.strokeStyle = 'rgba(235, 235, 235, 0.42)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(42, 42, 42, 0.36)';
    ctx.fill();
  }

  return canvas;
}

export function compositeMarsPhotoOntoCanvas(canvas, refImages) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  paintMarsBaseCanvas(canvas);

  const marsGlobeImg = refImages?.marsGlobal;
  if (marsGlobeImg) {
    const globeW = Math.floor(width * 0.58);
    const globeH = Math.floor(height * 0.88);
    const globeCanvas = createFeatheredPatchCanvas(marsGlobeImg, globeW, globeH, 0.09);
    const yPos = Math.floor(height * 0.5 - globeH * 0.5);

    ctx.save();
    ctx.globalAlpha = 0.88;
    drawWrappedPatch(ctx, width, globeCanvas, 0.0, yPos);
    drawWrappedPatch(ctx, width, globeCanvas, 0.36, yPos);
    drawWrappedPatch(ctx, width, globeCanvas, 0.70, yPos);
    ctx.restore();
  }

  const modeTiles = [refImages?.marsCrossbedding, refImages?.marsRipples, refImages?.marsHillside];
  const validModeTiles = modeTiles.filter(Boolean);
  if (validModeTiles.length > 0) {
    const pw = Math.floor(width * 0.46);
    const ph = Math.floor(height * 0.72);
    const patches = validModeTiles.map((img) => createFeatheredPatchCanvas(img, pw, ph, 0.28));
    const centers = [0.0, 0.25, 0.50, 0.75];
    const yPos = Math.floor(height * 0.5 - ph * 0.5);
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.globalCompositeOperation = 'soft-light';
    centers.forEach((uCenter, idx) => {
      const p = patches[idx % patches.length];
      drawWrappedPatch(ctx, width, p, uCenter, yPos);
    });
    ctx.restore();
  }

  const northCap = ctx.createLinearGradient(0, 0, 0, height * 0.05);
  northCap.addColorStop(0, 'rgba(248, 244, 240, 0.9)');
  northCap.addColorStop(1, 'rgba(248, 244, 240, 0)');
  ctx.fillStyle = northCap;
  ctx.fillRect(0, 0, width, Math.floor(height * 0.05));

  const southCap = ctx.createLinearGradient(0, height * 0.95, 0, height);
  southCap.addColorStop(0, 'rgba(248, 244, 240, 0)');
  southCap.addColorStop(1, 'rgba(248, 244, 240, 0.9)');
  ctx.fillStyle = southCap;
  ctx.fillRect(0, Math.floor(height * 0.95), width, Math.ceil(height * 0.05));
}

function loadHtmlImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function loadCelestialTextures() {
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');

  const earthDayFallback = new THREE.CanvasTexture(createFallbackEarthDayCanvas());
  earthDayFallback.colorSpace = THREE.SRGBColorSpace;

  const earthCloudsFallback = new THREE.CanvasTexture(createFallbackCloudsCanvas());
  earthCloudsFallback.colorSpace = THREE.SRGBColorSpace;

  const earthLightsFallback = new THREE.CanvasTexture(createFallbackLightsCanvas());
  earthLightsFallback.colorSpace = THREE.SRGBColorSpace;

  const moonAlbedoFallback = new THREE.CanvasTexture(createFallbackMoonCanvas());
  moonAlbedoFallback.colorSpace = THREE.SRGBColorSpace;

  const marsCanvas = document.createElement('canvas');
  marsCanvas.width = 1024;
  marsCanvas.height = 512;
  paintMarsBaseCanvas(marsCanvas);

  const marsAlbedoTex = new THREE.CanvasTexture(marsCanvas);
  marsAlbedoTex.colorSpace = THREE.SRGBColorSpace;
  marsAlbedoTex.wrapS = THREE.RepeatWrapping;
  marsAlbedoTex.wrapT = THREE.ClampToEdgeWrapping;

  const marsBumpCanvas = document.createElement('canvas');
  marsBumpCanvas.width = 1024;
  marsBumpCanvas.height = 512;
  paintMarsBumpCanvas(marsBumpCanvas, 'global-mola', {});

  const marsBumpTex = new THREE.CanvasTexture(marsBumpCanvas);
  marsBumpTex.wrapS = THREE.RepeatWrapping;
  marsBumpTex.wrapT = THREE.ClampToEdgeWrapping;

  const marsModeTextures = { 'global-mola': marsAlbedoTex };
  const marsBumpTextures = { 'global-mola': marsBumpTex };

  const textures = {
    earthDay: earthDayFallback,
    earthClouds: earthCloudsFallback,
    earthLights: earthLightsFallback,
    earthSpecular: null,
    earthNormal: null,
    moonAlbedo: moonAlbedoFallback,
    marsAlbedo: marsAlbedoTex,
    marsBump: marsBumpTex,
    marsModeTextures,
    marsBumpTextures,
  };

  const loadSafe = (key, url, isColor = true) => {
    loader.load(
      url,
      (loadedTex) => {
        if (key === 'moonAlbedo' && moonAlbedoFallback.image && loadedTex.image) {
          const canvas = moonAlbedoFallback.image;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.filter = 'brightness(1.58) contrast(1.18)';
            ctx.drawImage(loadedTex.image, 0, 0, canvas.width, canvas.height);
            ctx.restore();
            moonAlbedoFallback.needsUpdate = true;
          }
          loadedTex.dispose();
          return;
        }
        if (isColor) {
          loadedTex.colorSpace = THREE.SRGBColorSpace;
        }
        loadedTex.wrapS = THREE.RepeatWrapping;
        loadedTex.wrapT = THREE.ClampToEdgeWrapping;
        textures[key] = loadedTex;
      },
      undefined,
      () => {}
    );
  };

  loadSafe('earthDay', TEXTURE_URLS.earthDay, true);
  loadSafe('earthSpecular', TEXTURE_URLS.earthSpecular, false);
  loadSafe('earthNormal', TEXTURE_URLS.earthNormal, false);
  loadSafe('earthClouds', TEXTURE_URLS.earthClouds, true);
  loadSafe('earthLights', TEXTURE_URLS.earthLights, true);
  loadSafe('moonAlbedo', TEXTURE_URLS.moonAlbedo, true);

  Promise.all([
    loadHtmlImage(TEXTURE_URLS.marsGlobal),
    loadHtmlImage(TEXTURE_URLS.marsHillside),
    loadHtmlImage(TEXTURE_URLS.marsCrossbedding),
    loadHtmlImage(TEXTURE_URLS.marsRipples),
  ]).then(([marsGlobal, marsHillside, marsCrossbedding, marsRipples]) => {
    const refImages = {
      marsGlobal,
      marsHillside,
      marsCrossbedding,
      marsRipples,
    };
    compositeMarsPhotoOntoCanvas(marsCanvas, refImages);
    marsAlbedoTex.needsUpdate = true;

    paintMarsBumpCanvas(marsBumpCanvas, 'global-mola', refImages);
    marsBumpTex.needsUpdate = true;
  });

  return textures;
}
/* --- End of textures.js --- */
