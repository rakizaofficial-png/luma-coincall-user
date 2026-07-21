<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- Primary product is the Next.js 16 web app at the repo root ("Luma", package `myapp`). Scripts live in `package.json`: `npm run dev` (Turbopack dev server on `http://localhost:3000`), `npm run build`, `npm start`, `npm run lint`. Package manager is npm (`package-lock.json`); Node 20+ (VM has 22).
- No secrets are required to run/develop. All external config in `src/config/apiConfig.ts` (CoinCall API base URL, Agora, Firebase, IAP, AI-host CDN) has fallbacks; identity is an anonymous device UUID in `localStorage`. The default `NEXT_PUBLIC_API_BASE_URL` points at a deployed API, but the app renders and core client flows work without it. Set overrides in `.env.local` (gitignored) if needed.
- `npm run lint` currently reports pre-existing errors/warnings in committed code (e.g. `react-hooks/set-state-in-effect`, `prefer-const`); it exits non-zero. This is a code issue, not a setup issue — don't treat a non-zero lint exit as a broken environment.
- Good no-secret smoke test: open `/profile` and claim the Daily Rewards / Lucky Spin — these credit coins fully client-side via the local store, so the balance changes without any backend. Real coin purchases ("Buy with store") redirect to an external Google Play / IAP checkout that cannot complete in the VM.
- `/wallet` just redirects to `/profile`; the profile page is the wallet UI.
- `expo-app/` is a separate Expo React Native WebView shell (its own `package.json`/`package-lock.json`, excluded from the root `tsconfig`). It wraps the web app and needs a mobile simulator/Expo tooling to run; it is not part of the default web dev loop.
