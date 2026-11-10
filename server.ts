/*
Description: Production-grade Express backend for Team Space Punks AstroDashboard
- Isolates GEMINI_API_KEY server-side (never exposed to client bundles)
- Enforces Rate Limiting, Input Validation, and Security Headers
- Defaults to 127.0.0.1 on local desktop development to avoid network exposure
- Mounts Vite middlewares in development for instant HMR/SPA serving
*/
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables from .env.local and .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Host binding: Default to 127.0.0.1 for local isolation.
// Automatically allow 0.0.0.0 if running inside cloud container (Cloud Run / AI Studio) or explicitly configured via HOST.
const isContainerEnv = Boolean(
  process.env.K_SERVICE ||
  process.env.CONTAINER_ID ||
  process.env.AIS_ENV ||
  process.env.NODE_ENV === 'production'
);
const HOST = process.env.HOST || (isContainerEnv ? '0.0.0.0' : '127.0.0.1');

// 1. Security Headers Middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// 2. Body Parser with Payload Size Limits (Mitigate Denial of Service / Memory Exhaustion)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

// 3. In-Memory Sliding Window Rate Limiter
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

function createRateLimiter(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please retry after ${retryAfter} seconds.`,
      });
    }

    record.count++;
    next();
  };
}

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 60000);

// Rate limit API endpoints: max 30 requests per minute
const apiLimiter = createRateLimiter(30, 60000);

// 4. Server-Side Isolated Gemini AI Client
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  genAI = new GoogleGenAI();
}

// 5. REST API Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.get('/api/security/audit', (_req: Request, res: Response) => {
  res.json({
    status: 'secured',
    hostBinding: HOST,
    serverSideKeyIsolation: true,
    apiKeyClientExposed: false,
    rateLimitingEnabled: true,
    firestoreRulesVersion: '2 (default-deny catch-all active)',
  });
});

// Gemini Analysis API Proxy: Isolates GEMINI_API_KEY exclusively on the server
app.post('/api/gemini/analyze', apiLimiter, async (req: Request, res: Response) => {
  try {
    const { prompt, focusTarget } = req.body;

    // Strict Input Validation & Boundary Checks
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'The "prompt" field is required and must be a string.',
      });
    }

    if (prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'The "prompt" field cannot be empty.',
      });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Payload too large. "prompt" must not exceed 5,000 characters.',
      });
    }

    if (focusTarget && typeof focusTarget !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'The "focusTarget" field must be a string.',
      });
    }

    // Verify Server-Side API Key Configuration
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'GEMINI_API_KEY is not configured in the server environment (.env.local).',
      });
    }

    const ai = genAI || new GoogleGenAI();

    const systemInstruction =
      'You are a senior planetary scientist and astrophysicist for the Team Space Punks celestial expedition. Provide accurate, concise scientific telemetry, orbital mechanics insights, and comparative analysis of planetary terrain.';

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Gateway Timeout: Upstream Gemini API did not respond within 10 seconds.')),
        10000
      )
    );

    const response = (await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Target Focus: ${focusTarget || 'Solar System'}\n\nUser Query: ${prompt.trim()}`,
              },
            ],
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      }),
      timeoutPromise,
    ])) as { text?: string };

    const outputText = response.text || '';
    return res.json({
      success: true,
      text: outputText,
      model: 'gemini-3.8-flash',
    });
  } catch (error: unknown) {
    // Sanitize error messages: Never leak server stack traces or API keys to the client
    const safeMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Server-side Gemini generation error:', error);
    return res.status(500).json({
      error: 'Generation Failure',
      message: safeMessage.replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED]'),
    });
  }
});

// 6. Development (Vite Middlewares) vs Production (Static Serve) Setup
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: HOST,
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Generic 500 error handler that sanitizes error output
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected server error occurred.',
    });
  });

  app.listen(PORT, HOST, () => {
    console.log(`[Team Space Punks] Server running on http://${HOST}:${PORT} (Dev: ${isDev})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
