# test: save filters

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

---

## User experience

### UI changes
- Add a **“Save filter”** action on the Customers list
- Open a modal dialog prompting for a filter name
- Primary action: **Save**
- Secondary action: **Cancel**

### Empty / error states
- Empty name → Save disabled or inline validation error
- Name > 50 chars → inline validation error
- Name contains PII → inline validation error with guidance
- User already has 25 saved filters → non-destructive error explaining the limit and how to resolve (delete existing filters)

### Accessibility notes
- Modal is keyboard navigable (focus trap, ESC to close)
- Validation and error messages announced via ARIA live regions
- Button states and errors are not conveyed by color alone

---

## Technical approach

### Architecture / placement decisions
- **Frontend**: Angular 17 standalone component for the Save Filter dialog, Bootstrap custom styling
- **Backend**: .NET 8 Web API, layered architecture (Controller → Service → Data)
- Prefer updating existing services and patterns over introducing new abstractions

### Data model changes
- Reuse or extend existing `SavedFilter` entity:
  - `Id`
  - `UserId`
  - `Name`
  - `FilterDefinition` (serialized JSON)
  - `CreatedAt`
- No cross-user visibility

### API endpoints (sketch)
**POST** `/api/saved-filters`

Request:
```json
{
  "name": "My Accounts - West",
  "filterDefinition": "{...serialized filter state...}"
}
```

Response (201):
```json
{
  "id": "uuid",
  "name": "My Accounts - West"
}
```

Error responses:
- `400` validation error (name invalid / PII)
- `409` limit exceeded (25 filters)

### Validation & error handling
- Server-side validation is authoritative
- Name rules:
  - Required
  - ≤ 50 characters
  - Must not match PII patterns (email, phone, full-name heuristics)
- Limit check performed before persistence
- Frontend maps API errors to inline messages

### Permissions / security
- Saved filters are scoped to `User.Identity`
- No ability to read/write another user’s filters
- Filter definitions stored as opaque JSON (no execution)

### Observability
- Emit `saved_filter_created` event on success
  - Properties: `user_role`, `applied_filter_count`, `total_saved_filters`
- Log validation and limit rejections at debug/info level

---

## Implementation steps (Copilot-ready)

### Step 1: Design API contract
**Touch points**
- `Controllers/SavedFiltersController.cs`
- DTO files (e.g., `SaveFilterRequest.cs`)

**Subtasks**
- [ ] Review existing user-scoped POST endpoints
- [ ] Define request/response DTOs
- [ ] Wire controller action without persistence
- [ ] Compile and run existing tests

**Copilot script**
- Plan: Review existing API patterns for user-scoped saves  
- Confirm: Validate proposed DTO shape with team  
- Implement: Add request/response DTOs and controller signature  
- Verify: Compile and ensure no breaking changes  

---

### Step 2: Implement validation and limit enforcement
**Touch points**
- `Services/SavedFilterService.cs`
- `Validators/FilterNameValidator.cs`

**Subtasks**
- [ ] Add/extend filter name validator
- [ ] Implement PII detection rules
- [ ] Enforce max-25-filters rule per user
- [ ] Add unit tests for negative cases

**Copilot script**
- Plan: Identify validation and limit enforcement layer  
- Confirm: Reuse existing validation utilities if available  
- Implement: Add validator and limit check in service layer  
- Verify: Run unit tests covering invalid names and limit reached  

---

### Step 3: Persist saved filter
**Touch points**
- `Models/SavedFilter.cs`
- `Data/ApplicationDbContext.cs`
- `Services/SavedFilterService.cs`

**Subtasks**
- [ ] Map request DTO to entity
- [ ] Persist entity with correct `UserId`
- [ ] Ensure serialization is unchanged
- [ ] Add integration test using in-memory DB

**Copilot script**
- Plan: Inspect existing persistence patterns  
- Confirm: No new tables unless required  
- Implement: Save logic in service/repository  
- Verify: Integration test confirms user scoping  

---

### Step 4: Add Save Filter UI
**Touch points**
- `save-filter-dialog.component.ts`
- `save-filter-dialog.component.html`

**Subtasks**
- [ ] Scaffold standalone component
- [ ] Add name input with validation states
- [ ] Disable Save when invalid
- [ ] Ensure keyboard and screen reader support

**Copilot script**
- Plan: Identify existing modal patterns  
- Confirm: Use Bootstrap custom styles  
- Implement: SaveFilterDialogComponent  
- Verify: Manual accessibility check  

---

### Step 5: Wire API and handle errors
**Touch points**
- `saved-filters.service.ts`
- `customers-filters.store.ts`

**Subtasks**
- [ ] Add `saveFilter()` API call
- [ ] Map HTTP errors to UI messages
- [ ] Update local state on success
- [ ] Add E2E coverage for success/failure

**Copilot script**
- Plan: Review saved-filters service patterns  
- Confirm: Reuse existing HTTP infrastructure  
- Implement: API call + error mapping  
- Verify: E2E tests for happy and unhappy paths  

---

## Test plan

### Coverage mapping to ACs
- Save valid filter → E2E + API
- Name validation → Unit + API + component
- Max filters reached → API + E2E

### Unit tests
- Filter name validator
- Limit enforcement logic

### API / integration tests
- Successful save
- Validation failures
- Limit exceeded

### Component tests
- Save button enable/disable
- Inline error rendering

### E2E tests
- Save filter happy path
- PII name blocked
- 25-filter limit blocked

### Manual / exploratory charters
- Keyboard-only flow
- Screen reader announcements
- Rapid repeated saves

### Regression notes
- Changes to filter serialization
- Changes to auth/user identity handling

---

## Rollout

### Feature flag / migration
- Optional feature flag on Save Filter UI
- No data migration required

### Backward compatibility
- No impact to existing filter behavior
- No schema breaking changes expected

### Rollback plan
- Disable feature flag
- Backend endpoint can remain unused without side effects

