<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Team Space Punks - Earth & Moon Comparative Telemetry & Celestial Engine

Minimalist high-contrast comparative telemetry and full-screen 3D celestial simulation.

## Security Architecture & Best Practices

1. **Server-Side Gemini API Key Isolation (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`)**:
   - The `GEMINI_API_KEY` is loaded exclusively on the Express backend (`server.ts`) and is never prefixed with `VITE_` or exposed to Vite's client bundle definitions.
   - Client requests communicate via proxy route `/api/gemini/analyze`, protected by server-side input validation and sliding-window rate limiting.

2. **Network Isolation (Safe Local Development)**:
   - The development server and Vite bind to `127.0.0.1` (localhost) by default, protecting local machines on shared LAN/Wi-Fi networks.
   - For container environments (Google Cloud Run / AI Studio preview), `HOST=0.0.0.0` is used automatically.

3. **Google Cloud / Firebase API Key Restrictions**:
   - The Firebase Web API key in `firebase-applet-config.json` should be restricted in the [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials):
     - **Application restrictions**: Set to *Websites* with your authorized domain(s) (e.g., `*.run.app`, `localhost:3000`).
     - **API restrictions**: Restrict the key strictly to *Identity Toolkit API*, *Token Service API*, and *Cloud Firestore API*. Ensure *Generative Language API* is **NOT** included in this public key.

4. **Firebase App Check & reCAPTCHA v3**:
   - Firebase App Check is integrated via `src/services/appCheck.js`.
   - Set `VITE_RECAPTCHA_SITE_KEY` in `.env.local` to enforce reCAPTCHA verification on all Firebase and Firestore requests, protecting against automated scraping, replay attacks, and quota exhaustion.

5. **Hardened Firestore Security Rules (`firestore.rules`)**:
   - Deployed with default-deny (`match /{document=**} { allow read, write: if false; }`), strict type validation, and owner-only document partitioning for authenticated sessions.

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local` (see `.env.example`):
   ```bash
   cp .env.example .env.local
   # Add your GEMINI_API_KEY inside .env.local
   ```

3. Run the full-stack app:
   ```bash
   npm run dev
   ```
   The Express server will start on `http://127.0.0.1:3000` with the Vite dev middleware.
