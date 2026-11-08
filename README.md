# Petal: handmade flower shop

Internet Programming course project (Sao Dali Inaco, p20240003). Customers browse and customise handmade bouquets and choose pickup or delivery; the shop admin manages orders.

```
.
├── web/                  Vue 3 + TypeScript app (Vite, Router, Pinia, json-server mock API)
├── api/                  NestJS + Prisma backend (from weeks 6-7)
├── docs/                 wireframes, components, ERD, explanations (API contract and screenshots to come)
├── docker-compose.yml    PostgreSQL for the API
├── .github/workflows/    CI (type-check, lint, tests, build for web/)
├── PROPOSAL.md
└── MILESTONES.md
```

## Run the frontend (M1)
```bash
cd web
npm install
npm run api   # terminal 1: mock API on http://localhost:3000
npm run dev   # terminal 2: app on http://localhost:5173
```
More detail (routes, how to see the four states, design tokens): [web/README.md](web/README.md).
