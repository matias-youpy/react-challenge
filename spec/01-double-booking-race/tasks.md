# 01 — Tasks

- [ ] Add a module-level `reserved = new Set<string>()` in `server/index.ts`.
- [ ] In `POST /api/bookings`, after locating the slot, replace the async-safe gap:
  - [ ] Check `reserved.has(slotId)` **and** existing `bookings` for the slot; if
        either is true → `409`.
  - [ ] Otherwise `reserved.add(slotId)` synchronously (before `setTimeout`).
- [ ] Inside the `setTimeout`, push the booking as before.
- [ ] On any failure path of the write, `reserved.delete(slotId)` to release it.
- [ ] Add a concurrency regression test in `server/index.test.ts`:
  - [ ] Find a free slot.
  - [ ] Fire 5 concurrent `POST`s for it with `Promise.all`.
  - [ ] Assert exactly one `201` and four `409`.
  - [ ] Assert the slot is reported `taken` afterward.
- [ ] Run `npm test` (with server running) and confirm all tests pass.
- [ ] Update status in `spec/README.md`.
