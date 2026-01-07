# Copilot Instructions — Agentic Spec‑First Delivery (HITL Gated)

These instructions apply to all Copilot chat, custom agents, background agents, and PR-based coding agents operating in this repository.

## Core principle
We deliver work via **reviewable repo artifacts** and **Human-in-the-Loop gates**.
Copilot must never “run ahead” past a gate without explicit human approval.

---

## Hard rules (must follow)

### 1) Stop at gates (no auto-continue)
You MUST stop after producing the artifact(s) for the current phase and wait for explicit approval.

**Approval format (required to proceed):**
- The human must explicitly say: `APPROVED: Gate <N>` (e.g., `APPROVED: Gate 2`)

If approval is not present in the user’s message:
- Do NOT proceed to the next phase
- Do NOT start implementation work that belongs to later gates
- Instead, provide the deliverable and ask for review implicitly via the Handoff Package

### 2) Always end with a Handoff Package
Every response MUST end with the following section header and bullets (even if minimal):

## Handoff Package
- Artifacts created/updated:
- Decisions made:
- Open questions:
- Risks / gotchas:
- Gate status: (Ready for Gate N review OR Waiting for APPROVED: Gate N)
- Suggested next handoff:

### 3) Source of truth is the repo
Prefer reading/writing/adjusting these repo artifacts:
- Product Brief: `docs/product/briefs/<feature>.md`
- Epic: `docs/product/epics/<epic>.md`
- Stories: `docs/product/stories/<epic>/<story>.md`
- Dev Spec: `docs/specs/<epic>/<story>.spec.md` (or `*-dev-spec.md`)
- QA Plan: `docs/qa/test-plans/<epic>.testplan.md` (or `docs/specs/<epic>/qa-test-plan.md`)
- Review Notes: `docs/specs/<epic>/review-notes.md`
- Release Plan: `docs/specs/<epic>/release-plan.md`

Do not treat chat output as the final artifact—write/update the file(s).

### 4) Tests are first-class deliverables
When implementing functionality:
- Prefer **tests-first** where feasible (especially for validation/business rules)
- Tests must align to acceptance criteria and the QA plan
- Avoid meaningless “assert true” tests—assert outcomes and error conditions

### 5) Do not invent requirements
If something is unclear or missing:
- Record it under **Open questions**
- Do not guess silently
- Do not expand scope without approval

### 6) Guardrails (project standards)
Unless explicitly overridden by the human:

**Frontend**
- Angular 21
- Standalone components
- Prefer modern control flow (`@if`, `@for`)
- Signals or clean RxJS (no leaky subscriptions)
- Reactive Forms where applicable
- NO jQuery
- NO Angular Material
- Use Bootstrap classes + existing Sass tokens (do not introduce a new UI kit)
- Modernize legacy Angular in **small chunks** (avoid large rewrites)

**Backend**
- .NET 10 Web API
- Prefer UPDATE/EXTEND over CREATE (reuse existing endpoints/services/DTOs if plausible)
- Match existing architecture conventions before introducing new patterns

**Database**
- Prefer additive, backward-compatible migrations when possible
- Consider indexes and query shape for performance-critical paths
- Call out rollback strategy for schema/data changes

### 7) Background agent / PR agent safety
When operating as a background agent or PR-based coding agent:
- Work in an isolated branch/worktree/PR
- Keep changes scoped to the approved spec and contract
- Provide a clear list of touched files and how to verify
- Do not apply changes to main directly
- Stop for human review at the end (via Handoff Package)

### 8) Handoffs (when writing agent outputs)
When you suggest or define agent handoffs:
- Default to “review-first” behavior
- If authoring `.agent.md` handoffs, prefer `send: false` by default so humans must click/confirm

---

## Gates (what “done” looks like)

### Gate 1 — Epic approved
Deliverable:
- `docs/product/epics/<epic>.md`

Must include:
- goals + non-goals
- success metrics
- constraints + risks
- open questions
- story map / slices

### Gate 2 — Stories approved
Deliverables:
- `docs/product/stories/<epic>/...` (3–6 stories)

Must include (per story):
- user story statement
- testable acceptance criteria
- error/edge cases
- basic telemetry/a11y notes when relevant

### Gate 3 — QA plan approved
Deliverable:
- `docs/qa/test-plans/<epic>.testplan.md` (or equivalent)

Must include:
- AC → test coverage mapping (unit/integration/component/e2e/manual/perf as applicable)
- automation recommendations
- data setup notes
- exit criteria / DoD for QA

### Gate 4 — Dev spec / contract approved
Deliverable:
- `docs/specs/<epic>/<story>.spec.md` (or per slice)

Must include:
- AC mapping to implementation
- API/DB/UI contracts needed for parallel work
- work packages per agent (frontend/backend/db/tests)
- verification steps

### Gate 5 — Implementation reviewed
Deliverables:
- Code + tests + updated docs
- Review notes: `docs/specs/<epic>/review-notes.md`

Must include:
- test results / commands
- coverage confidence and any gaps
- risk notes

### Gate 6 — Release plan approved
Deliverable:
- `docs/specs/<epic>/release-plan.md`

Must include:
- rollout/flag strategy (or justification for no flag)
- migration plan + rollback
- monitoring/telemetry
- post-deploy verification checklist

---

## Response style requirements
- Prefer concise, structured output
- Use checklists for reviewability
- Do not paste huge code dumps into chat unless asked—make code changes in files and summarize

---
