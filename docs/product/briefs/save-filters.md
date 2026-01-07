## Summary
Enable users to save the current Customers list filter configuration under a custom name so it can be quickly reused later. The feature enforces validation (name rules, PII detection), a hard limit of 25 saved filters per user, and is fully scoped to the authenticated user. This spec covers **saving only** (not applying or managing saved filters).

## Goals
- Allow users to save one or more active filters with a valid name
- Persist saved filters per user, across sessions
- Enforce name validation (required, ≤50 chars, no PII)
- Enforce a maximum of 25 saved filters per user
- Provide clear, accessible feedback on success and failure

## Non-goals
- Sharing filters across users or teams
- Applying, renaming, or deleting saved filters
- Saving sort order or column layout
- Admin/global filters