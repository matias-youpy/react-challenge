# 01 — Double-booking race condition

## Summary

The same time slot can be booked more than once when two requests arrive close
together, producing two bookings (and two confirmation emails) for a single slot.

## Current behavior

`POST /api/bookings` checks whether a slot is already taken **synchronously**, but
inserts the booking **asynchronously** after a simulated 200 ms write delay:

```ts
const alreadyBooked = bookings.some((b) => b.slotId === slotId);
if (alreadyBooked) return res.status(409).json({ error: "slot already booked" });

setTimeout(() => {
  bookings.push(booking);
  res.status(201).json(booking);
}, 200);
```

Two concurrent requests for the same slot both pass the `alreadyBooked` check
before either one pushes to `bookings`. Both then insert and both receive `201`.
This is a check-then-act (TOCTOU) race.

## Expected behavior

- A given `slotId` can have **at most one** booking.
- When two requests race for the same slot, exactly one succeeds with `201` and
  the other fails with `409 Conflict` (`{ "error": "slot already booked" }`).
- No duplicate confirmation is ever produced for a single slot.

## Acceptance criteria

- [ ] Firing N concurrent `POST /api/bookings` for the same free slot results in
      exactly one `201` and `N-1` `409` responses.
- [ ] `bookings` never contains two entries with the same `slotId`.
- [ ] Existing happy-path tests still pass.
- [ ] A regression test covers the concurrent-request scenario.

## Out of scope

- Persisting bookings to a real database.
- Authentication / rate limiting.
- Changing the public shape of the request/response bodies.
