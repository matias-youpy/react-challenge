// Unit tests for the client display helpers.
// Run without a server: `npm run test:client`
import assert from "node:assert/strict";
import { test } from "node:test";
import { formatSlot } from "./api";

const ISO = "2026-07-14T08:00:00.000Z";
const OPTS = { dateStyle: "medium", timeStyle: "short" } as const;

// Run `fn` with a specific timezone, restoring the previous TZ afterward.
// Node re-reads process.env.TZ for Date/Intl on each call, so this makes the
// assertions independent of the machine's timezone.
function withTZ<T>(tz: string, fn: () => T): T {
  const prev = process.env.TZ;
  process.env.TZ = tz;
  try {
    return fn();
  } finally {
    if (prev === undefined) delete process.env.TZ;
    else process.env.TZ = prev;
  }
}

test("formatSlot treats the input as a UTC instant (respects the trailing Z)", () => {
  withTZ("America/Argentina/Buenos_Aires", () => {
    const correct = new Date(ISO).toLocaleString(undefined, OPTS);
    // The old bug sliced off the "Z", making JS read the UTC time as local time.
    const buggySliced = new Date(ISO.slice(0, 19)).toLocaleString(undefined, OPTS);

    assert.equal(formatSlot(ISO), correct);
    assert.notEqual(formatSlot(ISO), buggySliced);
  });
});

test("formatSlot renders the same instant differently per viewer timezone", () => {
  const inUtc = withTZ("UTC", () => formatSlot(ISO));
  const inBA = withTZ("America/Argentina/Buenos_Aires", () => formatSlot(ISO));
  const inBerlin = withTZ("Europe/Berlin", () => formatSlot(ISO));

  // Same absolute instant, different wall-clock time in each zone.
  assert.notEqual(inUtc, inBA);
  assert.notEqual(inUtc, inBerlin);
  assert.notEqual(inBA, inBerlin);
});

test("formatSlot shifts a UTC-3 viewer back by exactly 3 hours", () => {
  // 08:00Z should read as 05:00 local for a UTC-3 viewer. Compare against an
  // instant explicitly built 3 hours earlier and rendered in UTC.
  const local = withTZ("America/Argentina/Buenos_Aires", () => formatSlot(ISO));
  const expected = withTZ("UTC", () =>
    new Date("2026-07-14T05:00:00.000Z").toLocaleString(undefined, OPTS)
  );
  assert.equal(local, expected);
});

test("formatSlot returns a non-empty string for a valid instant", () => {
  const out = withTZ("UTC", () => formatSlot(ISO));
  assert.equal(typeof out, "string");
  assert.ok(out.length > 0);
});
