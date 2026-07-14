# 03 — Tasks

- [ ] In `client/api.ts`, change `formatSlot` to parse the full ISO string
      (`new Date(startsAtIso)`), removing the `.slice(0, 19)`.
- [ ] Optionally pass `{ dateStyle: "medium", timeStyle: "short" }` to
      `toLocaleString` for stable formatting.
- [ ] Confirm both call sites in `client/App.tsx` (slot list + confirmation)
      display correctly via the shared helper.
- [ ] Grep the client for any other `Date` construction that slices/strips the
      timezone; fix if found.
- [ ] Manually verify in a non-UTC timezone that a known `08:00Z` slot renders at
      the correct local time.
- [ ] Update status in `spec/README.md`.
