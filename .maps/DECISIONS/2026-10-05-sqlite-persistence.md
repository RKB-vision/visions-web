DECISION: Use SQLite behind an explicit persistence adapter boundary for V1 durable state.
DATE: 2026-10-05
REASON: Projects, approved metadata, funding configuration, and verified payment records require durable structured storage, while the portfolio remains a small single-application system. SQLite avoids operating a separate database service during local development and keeps the first deployment simple.
ALTERNATIVES CONSIDERED: A hosted relational database and a document store. A hosted database adds operational cost and configuration before scale requires it; a document store is less suitable for relational project/tag/payment state.
TRADEOFF: Production must provide a persistent writable volume and a later migration may be needed if concurrent traffic or operational requirements exceed SQLite. Application code must access storage through repository contracts rather than direct database calls.
AFFECTED COMPONENTS: Persistence, Project Content, Project Management/Admin, Funding, Payment Integration.
