# Petal: handmade flower shop frontend (M1 prototype)

Vue 3 + TypeScript (strict) + Vite + Vue Router + Pinia, running against a mock API (json-server). Later milestones replace the mock API with NestJS + Prisma + PostgreSQL.

## How to run
Node 22.18+ or 24 LTS (an old npm gives `edgesOut` errors: update Node/npm).

```bash
cd web
npm install
npm run api   # terminal 1: json-server on http://localhost:3000
npm run dev   # terminal 2: the app on http://localhost:5173
npm test      # unit tests (they fake fetch; the API need not run)
npm run check # type-check + ESLint
```
Reset the mock data with `git checkout db.json`.

Demo accounts (mock only): `customer@flower.test` / `customer123`, `admin@flower.test` / `admin123`.

## Routes
| Path | Page | Guard |
|---|---|---|
| `/` | Home | – |
| `/products` | Catalog with search + category | – |
| `/products/:id(\d+)` | Product detail (route param, custom options, note) | – |
| `/login` | Sign in / register (validated form) | – |
| `/cart` | Cart + checkout form | login |
| `/my-orders` | Customer order history | login |
| `/admin/orders` | Admin order status | ADMIN |
| `/:pathMatch(.*)*` | 404 | – |

## See the four states of a page (Products page)
- **Loading:** DevTools → Network → throttle to Slow 3G → reload.
- **Error:** stop `npm run api`, reload, restart it, click *Try again*.
- **Empty:** type a search with no match (for example `zzz`), or set `"products": []` in `db.json`.
- **Success:** normal run.

## Design
Palette: Blush Petal `#F7C8D3`, pale pink background `#FDF4F7`, navy `#2B3A78` for primary buttons. Fonts: DM Sans (body), Playfair Display italic (display headings). Tokens are CSS variables at the top of `src/assets/main.css`.

## Docs
`../docs/wireframes/` (SVG wireframes), `../docs/components.md` (component tree + state ownership), `../docs/m1-explain.md` (store vs component).

## Not in M1 (later weeks)
Real auth (Argon2 + JWT), server-side ownership checks and role guards, admin catalog CRUD, the cron stretch feature.
