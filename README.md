# Visions portfolio

This repository contains a single Next.js modular monolith for the portfolio.

## Local development

Requirements: Node.js 20 or newer and npm.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

## Checks and production build

```sh
npm run typecheck
npm run lint
npm run build
npm run start
```

The production build uses Next.js standalone output and can be served by one
Node.js process. The SQLite database path is supplied through
`DATABASE_PATH`; use a persistent volume for production deployments.

## Application boundaries

- `src/app/(public)` contains public presentation routes.
- `src/app/admin` contains the protected administration presentation boundary.
- `src/application` contains business-logic contracts and services.
- `src/persistence` contains durable storage adapters and their contracts.

The admin route is a boundary placeholder until the authentication decision is
resolved. It must not be treated as authorization by itself.
