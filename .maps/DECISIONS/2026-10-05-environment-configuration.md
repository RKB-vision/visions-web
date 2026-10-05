DECISION: Use environment variables for runtime configuration with a committed non-secret `.env.example`.
DATE: 2026-10-05
REASON: The deployment path, database location, and future provider credentials differ by environment. A template documents required names without placing credentials in source control.
ALTERNATIVES CONSIDERED: Hard-coded configuration; committed environment files; a configuration service. Hard-coded or committed values risk leaking secrets, while a service is unnecessary for this small single application.
TRADEOFF: Each environment must provide its own values, and startup validation should be added as provider-specific settings are introduced.
AFFECTED COMPONENTS: Application bootstrap, persistence, external integrations, deployment.
