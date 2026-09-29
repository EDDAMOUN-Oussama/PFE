# HealthyTrack frontend

React 18, TypeScript, Vite 7 and React Router 7. Use Node.js 22.12+ (22.x).

```sh
npm ci
npm run dev
```

Open http://localhost:8080. Copy `.env.example` to `.env.local` only when overriding the detected WAMP proxy. The browser calls `/api`; Vite and Vercel forward these requests to the backend.

Vercel: root `frontend`, framework Vite, build `npm run build`, output `dist`. Set `VITE_API_URL` to the Render HTTPS origin before deploying. `vercel.ts` supplies the API proxy and SPA fallback.

Full setup, backend configuration, tests and deployment: [project README](../README.md) and [deployment guide](../DEPLOYMENT.md).
