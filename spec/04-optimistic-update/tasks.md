# 04 — Tasks

- [ ] In `client/App.tsx` `onSubmit`, capture `selected.id` and
      `selected.startsAt` into locals before any state changes.
- [ ] Replace the in-place mutation with an immutable optimistic update using the
      functional `setSlots((prev) => prev.map(...))` form to set `taken: true`.
- [ ] Wrap `createBooking` in try/catch.
- [ ] On success: set the ok message, clear the form/selection, and call
      `await refresh()` to reconcile with the server.
- [ ] On failure: roll back the optimistic change (set `taken: false` for that
      slot) and show the error message.
- [ ] (Optional) Disable the submit button while a request is in flight.
- [ ] Manually verify success and failure (two-tab `409`) flows.
- [ ] Confirm no remaining direct mutations of `slots`/slot objects.
- [ ] Update status in `spec/README.md`.
