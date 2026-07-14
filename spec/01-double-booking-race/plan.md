# 01 — Plan

## Root cause

The uniqueness check and the insert are separated by an `await`/`setTimeout` gap.
Because the check reads state that is only mutated later (inside the timeout), two
in-flight requests observe the slot as free and both proceed to insert.

## Approach

Close the check-then-act window so that reserving a slot is **atomic** with
respect to the single-threaded event loop: decide the winner and record the
reservation *synchronously*, before yielding to the timer.

### Chosen design: synchronous reservation set

1. Maintain a `Set<string>` of reserved slot ids (`reserved`).
2. On each request, after validating input and locating the slot, attempt to
   claim the slot synchronously:
   - If `reserved.has(slotId)` or a booking already exists for it → `409`.
   - Otherwise `reserved.add(slotId)` immediately (before the timeout).
3. Perform the simulated write inside `setTimeout`, then push to `bookings`.
4. If the async write were to fail (defensive), release the reservation
   (`reserved.delete(slotId)`) so the slot becomes bookable again.

Because steps 1–2 run synchronously with no `await` between the read and the
write, no other request can interleave — the event loop cannot switch mid-check.
This removes the race without locks.

> Alternative considered: awaiting a promise-based mutex. Rejected as overkill for
> an in-memory single-process store; the synchronous claim is simpler and
> sufficient given Node's single-threaded model.

## Affected files

- `server/index.ts` — add `reserved` set; move the uniqueness gate to a
  synchronous claim; release on failure.
- `server/index.test.ts` — add a concurrency regression test.

## Edge cases

- Same slot requested twice in the same tick → first claims, second gets `409`.
- Booking that already exists (from a prior completed request) → `409` via either
  the `reserved` set or the existing `bookings` scan; keep both checks.
- Invalid/missing slot → still `404`/`400` before any reservation is made.

## Testing strategy

- Unit/integration: fire ~5 concurrent `POST`s for one free slot via
  `Promise.all`; assert exactly one `201` and the rest `409`, and that
  `GET /api/slots` shows the slot as `taken`.
- Re-run existing happy-path tests to confirm no regression.

## Related hardening (optional, low priority)

Booking ids are generated as `"b" + (bookings.length + 1)`, which is fragile if
entries are ever removed. Consider a monotonic counter or UUID. Tracked here as a
note; not required to satisfy this spec's acceptance criteria.
