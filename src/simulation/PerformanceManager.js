/*
Description: Adaptive graphics tier detection and geometry subdivision manager (Plain JavaScript)
Beginner Note: Checks if the user is on a mobile device, software WebGL, or low-core CPU and lowers sphere polygon
counts so the 3D scene stays smooth at 60 FPS.
*/
export class PerformanceManager {
  static detectRecommendedQuality() {
    if (typeof window === 'undefined') return 'high';

    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (gl) {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        if (/SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu)) {
          return 'low';
        }
      }
    } catch {
      // ignore
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return 'low';
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 8;

    if (isMobile || cores <= 4 || memory <= 4) {
      return 'medium';
    }

    return 'high';
  }

  static getConfig(quality) {
    switch (quality) {
      case 'low':
        return {
          dpr: [1, 1],
          earthSegments: 28,
          moonSegments: 20,
          starCount: 500,
          enableClouds: false,
          enableAtmosphereGlow: false,
        };
      case 'medium':
        return {
          dpr: [1, 1.5],
          earthSegments: 40,
          moonSegments: 32,
          starCount: 1000,
          enableClouds: true,
          enableAtmosphereGlow: true,
        };
      case 'high':
      default:
        return {
          dpr: [1, 1.5],
          earthSegments: 48,
          moonSegments: 36,
          starCount: 1400,
          enableClouds: true,
          enableAtmosphereGlow: true,
        };
    }
  }
}
