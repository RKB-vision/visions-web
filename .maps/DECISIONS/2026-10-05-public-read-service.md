DECISION: Expose public portfolio data through a read-only application service that composes published project reads and a public site-content projection.
DATE: 2026-10-05
REASON: Public presentation should not depend directly on persistence or receive administrative fields. A dedicated service keeps the public boundary explicit and allows page components to consume one stable read contract.
ALTERNATIVES CONSIDERED: Calling repositories directly from route components; returning the full site-content persistence record; adding a separate HTTP API. Direct repository access weakens component boundaries, the full record exposes storage metadata unnecessarily, and a separate API adds deployment complexity to the modular monolith.
TRADEOFF: The service introduces a small projection layer that must be kept aligned with public presentation needs. External links remain nullable so consumers can omit unavailable actions rather than render misleading controls.
AFFECTED COMPONENTS: Public Portfolio Interface, application layer, Project Content, Site Content, Persistence.
