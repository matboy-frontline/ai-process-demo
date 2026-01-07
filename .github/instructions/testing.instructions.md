---
name: Testing (Jest + Playwright)
description: Test strategy and conventions for Jest unit tests and Playwright E2E tests.
applyTo: "**/*.spec.ts,**/*.test.ts,**/playwright.config.*,**/playwright/**,**/e2e/**,**/tests/**,**/*Tests.cs,**/*Test.cs"
---

# Testing instructions (Jest + Playwright)

## Core principles
- Tests must map to acceptance criteria and protect real behavior (not implementation details).
- Prefer deterministic, isolated tests. Avoid order dependence.
- Use Arrange / Act / Assert structure and clear naming.

## Jest (unit + component)
- Use Jest for frontend unit/component tests.
- Prefer user-centric assertions:
  - query by role/label/text where possible
  - avoid brittle selectors unless needed for stable targeting
- Avoid snapshot-only tests unless snapshots provide clear value.
- Mock at boundaries (API calls, time, random) but keep business logic real.

## Playwright (E2E)
- Use Playwright for end-to-end flows covering critical user journeys.
- Prefer stable selectors: use `data-testid` for key interactive elements and assertions.
- Avoid `waitForTimeout`. Use proper waiting:
  - `expect(locator).toBeVisible()`
  - network assertions / route mocking when appropriate
- Keep E2E tests focused on behavior and contracts:
  - happy path + high-value negative paths
  - avoid testing every edge case at E2E level (push those to unit/integration)

## Test data strategy
- Prefer explicit, readable test fixtures/factories.
- If E2E needs data setup, prefer API-based setup or seeded fixtures over UI-driven setup steps.

## Coverage expectations
- Any new validation rule must have:
  - unit coverage (fast)
  - at least one integration/E2E validation (where meaningful)
- Any bug fix should include a regression test.

## Output expectations
- When adding tests, include how to run them (command or script name) in PR notes or spec verification steps.
