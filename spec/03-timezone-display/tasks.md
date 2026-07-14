# 03 — Tasks

- [x] In `client/api.ts`, change `formatSlot` to parse the full ISO string
      (`new Date(startsAtIso)`), removing the `.slice(0, 19)`.
- [x] Optionally pass `{ dateStyle: "medium", timeStyle: "short" }` to
      `toLocaleString` for stable formatting.
- [x] Confirm both call sites in `client/App.tsx` (slot list + confirmation)
      display correctly via the shared helper.
- [x] Grep the client for any other `Date` construction that slices/strips the
      timezone; fix if found. (None found — all display goes through `formatSlot`.)
- [x] Manually verify in a non-UTC timezone that a known `08:00Z` slot renders at
      the correct local time. (Verified: 08:00Z → 5:00 AM UTC−3, 10:00 AM Berlin.)
- [x] Add automated tests for `formatSlot` in `client/api.test.ts` (timezone
      handling, respects the `Z`, UTC−3 shift). Added `test:client`/`test:server`
      scripts; `npm test` runs both suites.
- [x] Update status in `spec/README.md`.
