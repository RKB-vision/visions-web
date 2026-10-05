DECISION: Resolve the previously blocked V1 implementation choices.
DATE: 2026-10-05
REASON: The owner explicitly selected the following implementation behavior so dependent tasks can proceed without builder assumptions.
ALTERNATIVES CONSIDERED: The alternatives remain recorded in the affected task files.
TRADEOFF: These choices define V1 behavior and can be revisited through a later accepted decision.
AFFECTED COMPONENTS: Authentication, Project Discovery, GitHub Integration, Funding/Payment Integration, Experimental Mode.

CHOICES:
- Authentication: owner-only email/password with secure server-side session.
- Payments: provider-agnostic verified payment adapter with a local/test provider until credentials are supplied.
- GitHub metrics: show configured stars/forks whenever available with manual/server-side refresh.
- Experimental Mode: immersive animated landing page using the same portfolio/project data.
- Personalization: rank by matching approved-tag count, then featured rank, then project name.
