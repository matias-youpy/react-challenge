# 02 — Past slots shown as available

## Summary

The available-slots list includes times that have already passed earlier today,
so users can pick slots in the past.

## Current behavior

`GET /api/slots` tries to hide past slots by comparing the slot's ISO datetime
against today's **date-only** string:

```ts
const today = new Date().toISOString().slice(0, 10); // "2026-07-14"
const available = slots.filter((s) => s.startsAt > today); // s.startsAt = "2026-07-14T08:00:00.000Z"
```

A full ISO datetime is always lexicographically greater than the date-only prefix
(the extra `T…` characters make it "larger"), so **every** slot for today passes
the filter — including ones whose start time is already in the past.

## Expected behavior

- The available list excludes any slot whose start time is at or before "now".
- Slots starting in the future are included.

## Acceptance criteria

- [ ] `GET /api/slots` never returns a slot with `startsAt <= now`.
- [ ] Future slots for today and later are still returned.
- [ ] The comparison is time-based (instant vs. instant), not string-prefix based.
- [ ] A test asserts that past slots are filtered out.

## Open decision

- Boundary handling: treat a slot as unavailable if `startsAt <= now` (strictly
  past or exactly now). Default to `<= now` → excluded. Confirm during planning.

## Out of scope

- Timezone-aware business hours or per-office calendars.
- Changing how slots are generated.
