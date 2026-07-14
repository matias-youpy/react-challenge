// Happy-path smoke tests for the booking server.
// These tests currently pass. That doesn't mean the service is correct.
//
// Run after `npm run dev:server` is up:
//   npx tsx server/index.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

test("GET /api/slots returns a list", async () => {
  const r = await fetch(`${BASE}/api/slots`);
  assert.equal(r.status, 200);
  const body = await r.json() as { slots: unknown[] };
  assert.ok(Array.isArray(body.slots));
});

test("POST /api/bookings on a free slot returns 201", async () => {
  // Find a slot id from the list
  const slotsResp = await fetch(`${BASE}/api/slots`);
  const { slots } = await slotsResp.json() as { slots: { id: string; taken: boolean }[] };
  const free = slots.find((s) => !s.taken);
  assert.ok(free, "expected at least one free slot to test against");

  const r = await fetch(`${BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId: free.id,
      customerName: "Test User",
      customerEmail: "happy@example.com",
      customerPhone: "+1 555 0100",
    }),
  });
  assert.equal(r.status, 201);
  const booking = await r.json();
  assert.ok(booking.id);
  assert.equal(booking.slotId, free.id);
});

test("concurrent POST /api/bookings for the same slot yields one 201, rest 409", async () => {
  // Find a free slot to race against.
  const slotsResp = await fetch(`${BASE}/api/slots`);
  const { slots } = await slotsResp.json() as { slots: { id: string; taken: boolean }[] };
  const free = slots.find((s) => !s.taken);
  assert.ok(free, "expected at least one free slot to test against");

  const attempts = 5;
  const responses = await Promise.all(
    Array.from({ length: attempts }, (_, i) =>
      fetch(`${BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: free.id,
          customerName: `Racer ${i}`,
          customerEmail: `racer${i}@example.com`,
          customerPhone: "+1 555 0100",
        }),
      })
    )
  );

  const statuses = responses.map((r) => r.status);
  const created = statuses.filter((s) => s === 201).length;
  const conflicts = statuses.filter((s) => s === 409).length;

  assert.equal(created, 1, `expected exactly one 201, got statuses: ${statuses}`);
  assert.equal(conflicts, attempts - 1, `expected ${attempts - 1} conflicts, got statuses: ${statuses}`);

  // The slot must now be reported as taken.
  const after = await fetch(`${BASE}/api/slots`);
  const { slots: afterSlots } = await after.json() as { slots: { id: string; taken: boolean }[] };
  const target = afterSlots.find((s) => s.id === free.id);
  if (target) assert.equal(target.taken, true, "slot should be taken after booking");
});
