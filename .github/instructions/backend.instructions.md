---
name: Backend (.NET 10)
description: .NET 10 Web API conventions and safety rules for this repo.
applyTo: "**/*.cs,**/*.csproj,**/*.sln,**/appsettings*.json"
---

# .NET 10 backend instructions

## Framework + approach
- Use .NET 10 for all backend work.
- Follow existing endpoint style in the repo (Controllers vs Minimal APIs); do not introduce a second style without approval.
- Prefer updating/extending existing endpoints, services, and DTOs over creating new parallel concepts.

## API design
- Do not expose EF entities directly from API responses.
- Use explicit request/response DTOs and keep them versionable.
- Return consistent error shapes (prefer ProblemDetails-style responses if the repo already uses them).
- Validate inputs at the boundary; produce clear, actionable error messages.

## Async + reliability
- Use `async/await` end-to-end for I/O.
- Thread cancellation through public entry points (`CancellationToken`) and pass it down to EF/HTTP calls.
- Use structured logging (`ILogger`) with useful context (IDs, counts, timings). Do not log secrets or sensitive data.

## Data access
- Prefer EF Core patterns already used in the repo.
- Avoid N+1 queries; prefer projection and eager loading where appropriate.
- Use `AsNoTracking()` for read-only query paths unless tracking is required.
- Any schema changes must include a migration plan and rollback considerations.

## Security
- Never bypass authorization checks for convenience.
- Follow existing authz policy patterns; keep permission logic centralized.

## Tests
- When changing backend behavior, add/update:
  - unit tests for business logic
  - integration tests for API boundaries (where applicable)
- Follow the repository’s existing test frameworks and patterns (see `testing.instructions.md`).
