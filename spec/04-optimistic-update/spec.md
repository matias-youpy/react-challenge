# 04 — Broken optimistic slot update

## Summary

After confirming a booking, the UI does not reliably mark the slot as taken, and a
failed booking leaves the slot in an inconsistent state. (Found during code
review; not listed in the README.)

## Current behavior

```ts
// Optimistically mark the slot as taken so the UI updates instantly
selected.taken = true;
setSlots(slots);
```

Two problems:

1. **In-place mutation + same reference.** It mutates the existing slot object and
   calls `setSlots` with the *same* array reference. React compares by reference,
   sees no change, and skips the re-render — the "instant" update often doesn't
   appear until something else triggers a render.
2. **No rollback on failure.** If `createBooking` throws (e.g. `409` from the
   double-booking fix), the slot was already flipped to `taken` and is never
   reverted, so a slot the user could still book appears unavailable.

Additionally, an unused `refresh()` helper exists but is never called, so the list
is never reconciled with the server after a booking.

## Expected behavior

- On submit, the selected slot appears taken immediately (optimistic).
- On success, the slot stays taken and the list reflects server truth.
- On failure, the optimistic change is rolled back so the slot is bookable again,
  and the error is shown.

## Acceptance criteria

- [ ] Booking a slot updates the list immediately via a new array reference (React
      re-renders).
- [ ] On a failed booking, the slot returns to its previous (bookable) state.
- [ ] After a successful booking, the list is reconciled with the server
      (e.g. via `refresh()`), removing the unused-function smell.
- [ ] No direct mutation of state objects/arrays.

## Out of scope

- Introducing a state-management library.
- Broader redesign of the component.
