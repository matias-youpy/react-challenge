# 04 — Tasks

- [x] In `client/App.tsx` `onSubmit`, capture `selected.id` and
      `selected.startsAt` into locals before any state changes.
- [x] Replace the in-place mutation with an immutable optimistic update using the
      functional `setSlots((prev) => prev.map(...))` form to set `taken: true`.
      (Extracted into a `setSlotTaken` helper.)
- [x] Wrap `createBooking` in try/catch.
- [x] On success: set the ok message, clear the form/selection, and call
      `await refresh()` to reconcile with the server.
- [x] On failure: roll back the optimistic change (set `taken: false` for that
      slot) and show the error message.
- [x] (Optional) Disable the submit button while a request is in flight
      (`submitting` state; button shows "Booking…" and guards re-entry).
- [x] Manually verify success and failure (two-tab `409`) flows.
- [x] Confirm no remaining direct mutations of `slots`/slot objects.
- [x] Typecheck passes (`npx tsc --noEmit`).
- [x] Update status in `spec/README.md`.
