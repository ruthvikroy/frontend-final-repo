/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Progressive texture asset loader with instant procedural fallbacks and unified Mars 3D texture
*/
import * as THREE from 'three';
import { useSimulationStore } from './simulationStore.js';
import {
  paintMarsBaseCanvas,
  paintMarsBumpCanvas,
  compositeMarsPhotoOntoCanvas,
} from '../celestial/textures.js';

const REMOTE_URLS = {
  earthDay: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
  earthNight: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
  earthClouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
  earthSpecular: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
  moonSurface: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg',
};

const MARS_REF_URLS = {
  marsGlobal: '/assets/aistudio/1-mars-nasa-gov-jpg_e2a27276.webp',
  marsHillside: '/assets/mars_reference/mars_ref_2_hillside.jpg',
  marsCrossbedding: '/assets/mars_reference/mars_ref_3_crossbedding.jpg',
  marsRipples: '/assets/mars_reference/mars_ref_5_sand_ripple.jpg',
};

function createEarthDayCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#0f2d59');
    oceanGrad.addColorStop(0.5, '#0a2246');
    oceanGrad.addColorStop(1, '#0f2d59');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    ctx.fillStyle = '#2e6b3e';
    ctx.beginPath();
    ctx.ellipse(540, 360, 190, 128, -0.2, 0, Math.PI * 2);
    ctx.ellipse(660, 640, 144, 224, 0.2, 0, Math.PI * 2);
    ctx.ellipse(1300, 320, 320, 152, 0.1, 0, Math.PI * 2);
    ctx.ellipse(1220, 580, 168, 208, 0, 0, Math.PI * 2);
    ctx.ellipse(1700, 720, 104, 88, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#eef6ff';
    ctx.fillRect(0, 0, 2048, 64);
    ctx.fillRect(0, 960, 2048, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createEarthNightCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#030816';
    ctx.fillRect(0, 0, 1024, 512);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createEarthCloudsCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 512, 256);
  }
  return new THREE.CanvasTexture(canvas);
}

function createEarthSpecularCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#181818';
    ctx.beginPath();
    ctx.ellipse(260, 180, 96, 64, -0.2, 0, Math.PI * 2);
    ctx.ellipse(328, 320, 72, 112, 0.2, 0, Math.PI * 2);
    ctx.ellipse(648, 160, 160, 76, 0.1, 0, Math.PI * 2);
    ctx.ellipse(608, 288, 84, 104, 0, 0, Math.PI * 2);
    ctx.ellipse(848, 360, 52, 44, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function createMoonSurfaceCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0, '#bfc6d4');
    bgGrad.addColorStop(0.5, '#aeb6c5');
    bgGrad.addColorStop(1, '#b8c0ce');
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
      mGrad.addColorStop(0, 'rgba(78, 84, 96, 0.68)');
      mGrad.addColorStop(0.7, 'rgba(105, 112, 126, 0.38)');
      mGrad.addColorStop(1, 'rgba(174, 182, 197, 0)');
      ctx.fillStyle = mGrad;
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, m.rx, m.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 360; i++) {
      const cx = (i * 73) % 1024;
      const cy = (i * 41) % 512;
      const r = 3 + (i % 20);
      ctx.fillStyle = i % 3 === 0 ? 'rgba(92, 98, 110, 0.52)' : 'rgba(210, 216, 226, 0.45)';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(236, 240, 248, 0.62)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(cx - 1, cy - 1, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
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

export class AssetLoader {
  static instance = null;

  constructor() {
    this.loader = new THREE.TextureLoader();
    this.loader.setCrossOrigin('anonymous');

    this.marsAlbedoCanvas = document.createElement('canvas');
    this.marsAlbedoCanvas.width = 1024;
    this.marsAlbedoCanvas.height = 512;
    paintMarsBaseCanvas(this.marsAlbedoCanvas);

    const marsSurfaceTex = new THREE.CanvasTexture(this.marsAlbedoCanvas);
    marsSurfaceTex.colorSpace = THREE.SRGBColorSpace;
    marsSurfaceTex.wrapS = THREE.RepeatWrapping;
    marsSurfaceTex.wrapT = THREE.ClampToEdgeWrapping;

    this.marsBumpCanvas = document.createElement('canvas');
    this.marsBumpCanvas.width = 1024;
    this.marsBumpCanvas.height = 512;
    paintMarsBumpCanvas(this.marsBumpCanvas, 'global-mola', {});

    const marsBumpTex = new THREE.CanvasTexture(this.marsBumpCanvas);
    marsBumpTex.wrapS = THREE.RepeatWrapping;
    marsBumpTex.wrapT = THREE.ClampToEdgeWrapping;

    this.textures = {
      earthDay: createEarthDayCanvas(),
      earthNight: createEarthNightCanvas(),
      earthClouds: createEarthCloudsCanvas(),
      earthSpecular: createEarthSpecularCanvas(),
      moonSurface: createMoonSurfaceCanvas(),
      marsSurface: marsSurfaceTex,
      marsBump: marsBumpTex,
    };

    useSimulationStore.getState().setLoadingProgress(100);
    useSimulationStore.getState().setIsLoaded(true);

    this.loadRemote();
  }

  static getInstance() {
    if (!AssetLoader.instance) {
      AssetLoader.instance = new AssetLoader();
    }
    return AssetLoader.instance;
  }

  getTextures() {
    return this.textures;
  }

  loadRemote() {
    const keys = ['earthDay', 'earthNight', 'earthSpecular', 'moonSurface'];
    keys.forEach((key) => {
      this.loader.load(
        REMOTE_URLS[key],
        (loadedTex) => {
          const targetTex = this.textures[key];
          const canvas = targetTex?.image;
          if (canvas && canvas.getContext && loadedTex.image) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.save();
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              if (key === 'moonSurface') {
                ctx.filter = 'brightness(1.12) contrast(1.22)';
              } else if (key === 'earthDay') {
                ctx.filter = 'brightness(1.38) contrast(1.12) saturate(1.24)';
              }
              ctx.drawImage(loadedTex.image, 0, 0, canvas.width, canvas.height);
              ctx.restore();
              targetTex.needsUpdate = true;
            }
            loadedTex.dispose();
          }
        },
        undefined,
        () => {}
      );
    });

    Promise.all([
      loadHtmlImage(MARS_REF_URLS.marsGlobal),
      loadHtmlImage(MARS_REF_URLS.marsHillside),
      loadHtmlImage(MARS_REF_URLS.marsCrossbedding),
      loadHtmlImage(MARS_REF_URLS.marsRipples),
    ]).then(([marsGlobal, marsHillside, marsCrossbedding, marsRipples]) => {
      const refImages = {
        marsGlobal,
        marsHillside,
        marsCrossbedding,
        marsRipples,
      };
      compositeMarsPhotoOntoCanvas(this.marsAlbedoCanvas, refImages);
      this.textures.marsSurface.needsUpdate = true;

      paintMarsBumpCanvas(this.marsBumpCanvas, 'global-mola', refImages);
      this.textures.marsBump.needsUpdate = true;
    });
  }

  dispose() {
    Object.values(this.textures).forEach((tex) => tex.dispose());
    AssetLoader.instance = null;
  }
}
/* --- End of AssetLoader.js --- */
