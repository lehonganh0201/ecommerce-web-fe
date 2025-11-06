## Quick orientation for AI coding agents

This repo is a React + Vite front-end for an e-commerce admin/site. Below are concise, immediately-actionable facts and examples that help you be productive editing and extending this codebase.

### Project at-a-glance
- Build: Vite (scripts: `npm run dev`, `npm run build`, `npm run preview`). Lint: `npm run lint` (ESLint config at project root).
- Entry: `src/main.jsx` — app bootstraps React Router and renders `src/App.jsx`.
- Routing: `src/App.jsx` uses `useRoutes` for route definitions (examples: `/`, `/auth`, `/verifyOTP`, `/admin/categories`).
- File alias: imports use `@/` as project root (see `jsconfig.json`). Use that alias when referencing modules.

### Where to look for major subsystems
- API layer: `src/apis/*` (e.g. `src/apis/auth.js`) — small service modules that call the request wrapper.
- HTTP utilities: `src/utils/axios/axiosInstance.js` and `src/utils/axios/axios-http.js`.
  - Two axios instances exported: `axiosPublic` (no token) and `axiosPrivate` (adds Authorization header).
  - `axiosPrivate` has an interceptor implementing token refresh/queueing. The refresh flow calls `src/apis/auth.js` → `refreshToken()`.
  - Env var: base URL from `VITE_API_URL` in `.env`.
- Pages & layout: `src/pages/*` (admin pages under `src/pages/admin`) and `src/components/*` (reusable components, auth forms under `src/components/auth`).
- Styles: Tailwind + SCSS are used. Look for `tailwind.config.js` and `.scss` files next to some components (e.g. `LoginForm.scss`).

### Conventions & patterns to follow
- API functions return axios responses or throw; many modules call `request(axiosPublic|axiosPrivate, config)` (see `src/utils/axios/axios-http.js`). Keep that pattern when adding new endpoints.
- Tokens & persistence: login stores `accessToken`, `refreshToken`, `fullName`, `role` (see `src/apis/auth.js`). Code often reads/writes these keys in `localStorage`.
- Error handling: `axiosPrivate` transforms errors into an object { status, message, errors } when rejecting. Some components still check `axios.isAxiosError(error)` and `error.response` — be careful: both shapes may appear. Preserve existing user-facing Vietnamese messages when updating flows.
- Admin pages: admin UI composes `LayoutAdmin` (e.g. `src/pages/admin/LayoutAdmin.jsx`) with `SidebarAdmin` and individual admin pages (categories, products, orders). For new admin pages, follow the folder pattern `src/pages/admin/<Name>Page.jsx`.

### Important implementation details to preserve
- The axios token refresh queue (variables: `isRefreshing`, `failedQueue`, `processQueue`) is critical to avoid duplicate refresh calls — keep logic intact if refactoring.
- `axiosPrivate` uses `withCredentials: true` and sets `Authorization` header from `localStorage.accessToken` in request interceptor.
- `refreshToken()` (in `src/apis/auth.js`) is used by the interceptor and expects the server's refresh endpoint behavior; do not change its signature without updating interceptor usage.

### Examples (copy/paste friendly)
- Call pattern for APIs:
  - import: `import { request } from '@/utils/axios/axios-http';`
  - usage: `await request(axiosPublic, { url: '/auth/login', method: 'POST', data })`
- Access tokens: `localStorage.getItem('accessToken')` and set via `localStorage.setItem('accessToken', accessToken)` after login (see `src/apis/auth.js`).

### Dev workflows & common commands
- Start dev server (HMR): `npm run dev` (Vite).
- Build production bundle: `npm run build` then `npm run preview` to preview the build.
- Lint: `npm run lint`.
- Environment: set `VITE_API_URL` in `.env` (already present in repo). When running in CI or locally, ensure the API URL is reachable for integration/debug runs.

### Small gotchas the agent should watch for
- Mixed error shapes (axios error vs. normalized {status,message,errors}). Prefer defensive checks and keep existing UI error messaging behavior.
- Route matching: admin routes are not nested under a single `/admin/*` pattern in `App.jsx` now — specific admin routes are declared (add routes consistently with existing pattern).
- Language: many messages and comments are in Vietnamese — preserve the language/context when editing copy or user messages.

### Where to add tests/docs or next improvements
- There are no test scripts in `package.json`. If adding tests, prefer lightweight unit tests that do not require the real API (mock `axiosPrivate`/`axiosPublic`).

If anything in this file looks unclear or you'd like more examples (e.g., the axios refresh flow, a concrete component refactor, or a sample new admin page), tell me which area and I'll expand with code examples or a proposed patch.
