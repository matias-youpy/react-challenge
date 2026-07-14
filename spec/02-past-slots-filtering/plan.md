# 02 — Plan

## Root cause

The filter compares a full ISO datetime string against a `YYYY-MM-DD` prefix.
String comparison of `"2026-07-14T08:00:00.000Z" > "2026-07-14"` is always `true`,
so nothing is filtered. The intent was a chronological comparison, not a string
one.

## Approach

Compare instants, not strings.

```ts
const now = Date.now();
const available = slots
  .filter((s) => new Date(s.startsAt).getTime() > now)
  .map((s) => ({ ...s, taken: taken.has(s.id) }));
```

- `new Date(s.startsAt).getTime()` parses the UTC ISO string to an epoch ms value.
- `Date.now()` is the current instant in epoch ms.
- Both are absolute instants, so the comparison is timezone-safe.

Boundary: use strict `>` so a slot exactly at "now" is treated as no longer
bookable (matches the "in the past" complaint and avoids booking a slot that is
starting this instant).

## Affected files

- `server/index.ts` — replace the date-prefix filter in `GET /api/slots`.
- `server/index.test.ts` — add a test asserting no past slots are returned.

## Edge cases

- All of today's slots already passed → list contains only later days' slots (in
  the current generator, that means an empty list late in the day; acceptable).
- Slot exactly at `now` → excluded (strict `>`).
- Malformed `startsAt` → `getTime()` returns `NaN`; `NaN > now` is `false`, so such
  a slot is excluded (safe default). Generator only produces valid ISO strings.

## Testing strategy

- Fetch `/api/slots` and assert every returned slot has
  `new Date(s.startsAt).getTime() > Date.now()`.
- Because the generator seeds slots starting at 00:00 UTC today, at most times of
  day some slots will already be in the past; the test asserts none of those
  appear.
