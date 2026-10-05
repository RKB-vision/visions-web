# MAPS — Agent Operating Rules

This repository is being developed using the MAPS software-building framework.

All AI agents working in this repository must follow these rules.

---

## 1. Source of Truth

Read these files before making changes:

1. `PROJECT_MAP.md` — what the product must do.
2. `ARCHITECTURE_MAP.md` — how the system is structured.
3. `.maps/SYSTEM_STATE.md` — current project state.
4. Relevant files in `.maps/TASKS/`, `.maps/HANDOFFS/`, `.maps/ISSUES/`, and `.maps/DECISIONS/`.

Never assume that chat history is available.

The repository itself must contain enough information for another agent to continue the work.

---

## 2. Before Working

Before modifying code:

1. Read the relevant project documentation.
2. Inspect the existing implementation.
3. Identify the task assigned to you.
4. Identify which components/files are involved.
5. Check recent handoffs and unresolved issues.
6. Confirm that your planned change does not contradict the Project Map or Architecture Map.

Do not modify unrelated parts of the application.

---

## 3. Respect the Project Map

`PROJECT_MAP.md` defines the intended product behavior.

Do not silently:

- remove requirements
- change important behavior
- add major features
- reinterpret important requirements
- replace a requirement with a technically easier solution

When a requirement appears incorrect, incomplete, or contradictory:

1. Record the problem in `.maps/ISSUES/`.
2. Do not silently redesign the product.
3. Continue only with unaffected work.

---

## 4. Respect the Architecture Map

`ARCHITECTURE_MAP.md` defines the intended system boundaries and responsibilities.

Agents must preserve:

- component responsibilities
- important dependencies
- security boundaries
- authoritative sources of truth
- data ownership
- major user/data flows

Do not move responsibilities between components merely for convenience.

When an architectural change is genuinely required:

1. Record it in `.maps/DECISIONS/`.
2. Explain why.
3. Identify affected components.
4. Update the architecture documentation when the decision is accepted.

---

## 5. Work From Tasks

Agents should normally work from a task in:

```text
.maps/TASKS/
```

A task should define the intended outcome and acceptance criteria.

Do not treat a vague instruction such as:

> "Improve the app"

as sufficient scope.

If the assigned task is unclear, inspect the available project documentation and task records before making assumptions.

---

## 6. Ownership and Parallel Agents

Multiple agents may work on the same repository.

Agents must assume that another agent may be working on another part of the system.

Therefore:

- Work only within your assigned scope.
- Avoid unnecessary changes to shared files.
- Inspect existing changes before editing.
- Never overwrite another agent's work intentionally.
- Do not revert changes simply because they were created by another agent.
- Communicate conflicts through `.maps/ISSUES/` or `.maps/HANDOFFS/`.

Agents should prefer isolated Git branches/worktrees when the environment supports them.

---

## 7. Inspect Before Editing

Never modify a file merely because its name suggests that it is responsible for something.

First determine:

- what the file actually does
- what depends on it
- what it depends on
- which user behavior it affects
- whether another component already owns the responsibility

Preserve existing working behavior unless the task explicitly requires changing it.

---

## 8. Implement the Smallest Correct Change

Prefer:

```text
smallest change
+
clear responsibility
+
existing architecture
```

over:

```text
large rewrite
+
new abstractions
+
unnecessary dependencies
```

Do not introduce infrastructure that the Project Map does not justify.

---

## 9. Verification

Do not claim a task is complete because the code was written.

After implementation:

1. Run the relevant tests.
2. Run type checks/linting where applicable.
3. Test important user behavior.
4. Inspect the resulting application when visual behavior is involved.
5. Record actual evidence.

Never write:

> "Everything works."

unless there is evidence supporting that claim.

---

## 10. Failed Verification

When something fails:

Do not hide it.

Record:

- what failed
- where it failed
- what was expected
- what actually happened
- what was attempted
- what remains unresolved

Use `.maps/ISSUES/`.

A known failure is preferable to a false completion report.

---

## 11. Handoff Requirement

When stopping work, create or update a handoff in:

```text
.maps/HANDOFFS/
```

The handoff must contain:

```text
TASK:
AGENT:
DATE:

STATUS:
What was completed.

FILES CHANGED:
List the files.

IMPLEMENTATION:
What was actually changed.

VERIFICATION:
Tests/checks performed and their results.

KNOWN PROBLEMS:
Anything still failing or uncertain.

NEXT STEP:
What another agent should do next.

IMPORTANT CONTEXT:
Anything another agent would otherwise have to rediscover.
```

A different agent must be able to continue from the handoff without needing the previous agent's chat history.

---

## 12. Agent Work Log

Each agent must record significant work in:

```text
.maps/AGENT_LOG/
```

Logs should record meaningful events such as:

- task started
- task completed
- significant implementation decision
- discovered problem
- handoff created
- architecture conflict
- verification result

Do not record meaningless activity such as every file read.

---

## 13. Decisions

Important decisions belong in:

```text
.maps/DECISIONS/
```

A decision record should include:

```text
DECISION:
DATE:
REASON:
ALTERNATIVES CONSIDERED:
TRADEOFF:
AFFECTED COMPONENTS:
```

Do not bury important architectural decisions inside code comments or chat.

---

## 14. System State

`.maps/SYSTEM_STATE.md` must describe the current known condition of the project.

It should allow an agent to quickly understand:

- what is working
- what is incomplete
- what is blocked
- what is currently being worked on
- important known issues
- latest verification status

Agents must update it when their work materially changes the project's state.

---

## 15. Map Integrity

The project documentation must describe reality.

Agents must never modify:

- `PROJECT_MAP.md`
- `ARCHITECTURE_MAP.md`
- `SYSTEM_STATE.md`

merely to make the project appear correct.

When code and documentation disagree:

```text
STOP
   ↓
identify the disagreement
   ↓
record it
   ↓
determine whether code or documentation should change
   ↓
make the change deliberately
```

Documentation drift is a defect.

---

## 16. Authority Hierarchy

Use this hierarchy when interpreting project information:

```text
Explicit accepted product decision
        ↓
PROJECT_MAP.md
        ↓
ARCHITECTURE_MAP.md
        ↓
Accepted DECISIONS
        ↓
TASK specification
        ↓
Current implementation
        ↓
Agent assumption
```

An assumption must never silently override an explicit decision.

---

## 17. Human-Readable Communication

Agent records must be understandable to a technically capable human who may not know the programming language being used.

When reporting a problem:

Bad:

> `useEffect dependency race caused stale closure`

Better:

> The interface is reading an older value because this component is not being updated when the underlying data changes.

Technical details may still be included, but explain their practical meaning.

---

## 18. Never Fabricate Evidence

Agents must not claim:

- a test passed when it was not run
- a payment was verified when it was not verified
- an API works when it was not tested
- a browser behavior works when it was not checked
- documentation was updated when it was not updated

State uncertainty explicitly.

---

## 19. Completion Standard

A task is complete only when:

```text
Implementation
      +
Verification
      +
Documentation
      +
Handoff
```

are all satisfied.

For tasks that do not require one of these steps, explicitly state why.

---

## 20. Auditor Authority

The Auditor Agent is responsible for checking:

```text
PROJECT_MAP
      ↕
ARCHITECTURE_MAP
      ↕
DOCUMENTED SYSTEM STATE
      ↕
ACTUAL CODE
      ↕
VERIFICATION EVIDENCE
```

The Auditor may identify drift, inconsistencies, incomplete tasks, undocumented behavior, or unsupported completion claims.

Builder agents must not disable or circumvent auditor findings.

An auditor finding must be recorded in `.maps/ISSUES/` or the appropriate task/handoff record.

---

## 21. Continuity Principle

Any agent may stop at any time because of:

- token/usage limits
- environment limits
- errors
- human interruption
- reassignment

The project must remain recoverable.

Another agent must be able to continue by reading the repository documentation and records.

**No critical project knowledge should exist only inside an agent conversation.**

---

## 22. Final Principle

AI agents are implementers and collaborators.

They are not the owner of the product definition.

The human owns the intended outcome.

MAPS exists to maintain a reliable chain:

```text
HUMAN INTENT
     ↓
PROJECT MAP
     ↓
ARCHITECTURE
     ↓
TASK
     ↓
IMPLEMENTATION
     ↓
VERIFICATION
     ↓
DOCUMENTED STATE
```

Maintain that chain at all times.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
