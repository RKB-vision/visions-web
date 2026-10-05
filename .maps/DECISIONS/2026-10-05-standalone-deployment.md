DECISION: Target one Node.js deployment using Next.js standalone output and a persistent volume for SQLite.
DATE: 2026-10-05
REASON: This matches the modular-monolith architecture and keeps local and production execution close: install dependencies, build once, and run one Node process. A persistent volume preserves durable application state.
ALTERNATIVES CONSIDERED: A serverless deployment with external database; separate frontend/API services; static hosting. Those options add infrastructure or cannot directly support the planned protected admin and verified payment workflows without additional services.
TRADEOFF: The deployment is stateful and requires volume/backups. Horizontal scaling is not assumed by this foundation.
AFFECTED COMPONENTS: Application bootstrap, persistence, deployment, local development.
