---
name: Frontend (Angular 21)
description: Angular 21 standards for UI implementation in this repo.
applyTo: "**/src/app/**/*,**/*.component.ts,**/*.component.html,**/*.component.scss,**/*.service.ts,**/*.directive.ts,**/*.pipe.ts,**/*.guard.ts,**/*.interceptor.ts,**/*.routes.ts"
---

# Angular 21 frontend instructions

## Framework + style
- Use Angular 21 for all new work.
- Prefer standalone components by default; follow existing project patterns if a feature area still uses NgModules.
- Prefer Signals for local UI state and derived state.
- Use modern template control flow (`@if`, `@for`, `@switch`) where applicable.
- Use typed Reactive Forms for user input and validation.
- Avoid manual subscription management; use `async` pipe where possible, otherwise use `takeUntilDestroyed()`.

## Architecture
- Keep components thin: UI + orchestration only.
- Put business logic in services; keep services single-purpose.
- Prefer extending existing components/services over creating new ones.
- Keep changes incremental; avoid large rewrites.

## UI libraries / DOM
- Do not introduce new UI frameworks or component libraries unless explicitly approved.
- Do not use jQuery. Do not perform direct DOM manipulation unless there is no Angular alternative and it is approved.

## Accessibility + UX
- All interactive controls must be keyboard accessible.
- Inputs must have labels (or `aria-label`) and meaningful error messages.
- Maintain focus management for modals/drawers and after actions (save/submit).

## Testing hooks
- Add stable selectors for E2E where needed: prefer `data-testid="..."` on key elements.
- When changing UI behavior, add/update Jest tests and (when relevant) Playwright coverage (see `testing.instructions.md`).

## Output expectations
- When you implement a UI change, also update:
  - component/service tests (Jest) as needed
  - story/spec docs if implementation deviates from approved behavior (do not silently drift)
