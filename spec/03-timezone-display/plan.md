# 03 — Plan

## Root cause

`startsAtIso.slice(0, 19)` removes the `Z` (UTC designator). `new Date()` then
interprets the offset-less string as local time, so the instant is wrong before
formatting even happens.

## Approach

Parse the original ISO string as-is and let `toLocaleString` handle the
conversion to the viewer's local zone.

```ts
export function formatSlot(startsAtIso: string): string {
  const d = new Date(startsAtIso); // keeps the "Z" → correct UTC instant
  return d.toLocaleString();
}
```

Optionally make the intent explicit and output stable by passing options, e.g.:

```ts
return new Date(startsAtIso).toLocaleString(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});
```

Decision: keep it minimal (drop the `.slice`) to satisfy the spec; the options
object is a nice-to-have for consistent formatting and can be included since it
carries no behavioral risk.

## Why this is correct

- `new Date("2026-07-14T08:00:00.000Z")` is an absolute instant.
- `toLocaleString()` renders that instant in the runtime's local timezone.
- Every viewer sees the same instant expressed in their own wall-clock time.

## Affected files

- `client/api.ts` — fix `formatSlot`.

No changes needed in `client/App.tsx`: both the slot list (`formatSlot(s.startsAt)`)
and the confirmation message (`formatSlot(selected.startsAt)`) already route
through this single helper, so fixing it corrects both call sites.

## Edge cases

- Confirmation message currently builds the time from `selected.startsAt` via
  `formatSlot`, so it is covered by the same fix.
- Verify no other place constructs a `Date` from a sliced/again-formatted string.

## Testing strategy

- Manual: with the browser/OS set to a non-UTC zone, confirm a slot known to be
  `08:00Z` renders as the correct local time (e.g. `05:00` at UTC−3).
- Sanity check in a console:
  `new Date("2026-07-14T08:00:00.000Z").toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" })`
  should show `5:00`.
