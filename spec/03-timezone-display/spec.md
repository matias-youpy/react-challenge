# 03 — Wrong time across timezones

## Summary

The booking confirmation and slot list show the wrong time for users whose
timezone differs from the office (UTC). Times are off by the user's UTC offset.

## Current behavior

`formatSlot` strips the timezone marker from the ISO string before parsing:

```ts
export function formatSlot(startsAtIso: string): string {
  const d = new Date(startsAtIso.slice(0, 19)); // drops the trailing "Z"
  return d.toLocaleString();
}
```

`startsAtIso` is a UTC instant like `"2026-07-14T08:00:00.000Z"`. Slicing to 19
characters yields `"2026-07-14T08:00:00"` with **no** timezone designator. Per the
JS spec, a date-time string without an offset is interpreted in the **local**
timezone, so the UTC value is mis-read as local time. `toLocaleString()` then
renders that already-wrong value, shifting the displayed time by the user's
offset.

## Expected behavior

- A slot's UTC start time is rendered as the equivalent wall-clock time in the
  **viewer's** local timezone.
- Example: `08:00Z` shows as `05:00` for a UTC−3 user and `09:00` for a UTC+1 user.

## Acceptance criteria

- [ ] The full ISO string (including `Z`) is parsed, so the instant is correct.
- [ ] Displayed time equals the UTC instant converted to the viewer's local zone.
- [ ] Both the slot list and the confirmation message use the corrected formatter.
- [ ] No other display strings drop the timezone.

## Out of scope

- Letting users choose a display timezone other than their local one.
- Server-side formatting or localization/i18n of labels.
