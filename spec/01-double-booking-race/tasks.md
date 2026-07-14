# 01 — Tasks

- [x] Add a module-level `reserved = new Set<string>()` in `server/index.ts`.
- [x] In `POST /api/bookings`, after locating the slot, replace the async-safe gap:
  - [x] Check `reserved.has(slotId)` **and** existing `bookings` for the slot; if
        either is true → `409`.
  - [x] Otherwise `reserved.add(slotId)` synchronously (before `setTimeout`).
- [x] Inside the `setTimeout`, push the booking as before.
- [x] On any failure path of the write, `reserved.delete(slotId)` to release it.
- [x] Add a concurrency regression test in `server/index.test.ts`:
  - [x] Find a free slot.
  - [x] Fire 5 concurrent `POST`s for it with `Promise.all`.
  - [x] Assert exactly one `201` and four `409`.
  - [x] Assert the slot is reported `taken` afterward.
- [x] Run `npm test` (with server running) and confirm all tests pass.
- [x] Update status in `spec/README.md`.
