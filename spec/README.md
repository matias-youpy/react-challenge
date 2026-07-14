# Booking widget — spec-driven fixes

This folder tracks the fixes for the known issues in the booking widget using a
spec-driven development (SDD) approach. Each issue lives in its own subfolder and
contains three documents:

- `spec.md` — **what** and **why**: the problem, current vs. expected behavior, and
  acceptance criteria. No implementation detail.
- `plan.md` — **how**: technical approach, affected files, design decisions, edge
  cases, and testing strategy.
- `tasks.md` — the concrete, ordered checklist to implement and verify the fix.

## Issues

| # | Issue | Area | Source | Status |
|---|-------|------|--------|--------|
| 01 | [Double-booking race condition](./01-double-booking-race/spec.md) | Server | README #1 | Done |
| 02 | [Past slots shown as available](./02-past-slots-filtering/spec.md) | Server | README #2 | Done |
| 03 | [Wrong time across timezones](./03-timezone-display/spec.md) | Client | README #3 | Done |
| 04 | [Broken optimistic slot update](./04-optimistic-update/spec.md) | Client | Found in review | Not started |

## Workflow

1. Read `spec.md` to align on the desired behavior.
2. Review `plan.md` for the technical approach before writing code.
3. Work through `tasks.md`, checking items off as they are completed.
4. Update the status column above as each issue progresses
   (Not started → In progress → Done).

## Conventions

- Keep each fix self-contained and independently verifiable.
- Prefer the smallest change that fully satisfies the acceptance criteria.
- Add or update tests alongside the fix where practical (`server/index.test.ts`).
