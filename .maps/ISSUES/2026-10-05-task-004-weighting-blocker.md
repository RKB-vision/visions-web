# TASK-004 blocker: deterministic personalized weighting

DATE: 2026-10-05
TASK: TASK-004 — Implement deterministic project discovery and combined filtering
STATUS: BLOCKED

PROBLEM:
The task requires personalized ordering using one visitor type, multiple
interests, and approved project tags, but the product maps intentionally leave
the multi-match weighting rule unresolved. Choosing a weighting would change
which projects visitors see first and would silently make a product decision.

IMPACT:
TASK-004 cannot be completed without owner direction. TASK-005 and TASK-006
depend on discovery behavior, and TASK-008 depends on discovery plus project
presentation.

WHAT WAS VERIFIED:
Persistence and public project retrieval already expose approved tags and
exclude drafts, so the technical foundation is ready. No discovery weighting
logic was added.

NEXT ACTION:
The product owner should define how visitor type and multiple interests affect
project ordering, including tie handling. Then record the accepted rule in
`.maps/DECISIONS/` before implementation resumes.
