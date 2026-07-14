# 04 — Plan

## Root cause

- React state updates require a **new reference** to trigger a re-render. The code
  mutates `selected.taken` and passes the unchanged `slots` array, so React bails.
- There is no error path that reverts the optimistic change.

## Approach

Use immutable updates and a try/catch/rollback flow, then reconcile with the
server on success.

```ts
async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!selected) return;

  const slotId = selected.id;
  // Optimistic: new array, new slot object
  setSlots((prev) =>
    prev.map((s) => (s.id === slotId ? { ...s, taken: true } : s))
  );

  try {
    const b = await createBooking({
      slotId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
    });
    setMessage({ kind: "ok", text: `Booked! Confirmation: ${b.id} at ${formatSlot(selected.startsAt)}` });
    setSelected(null);
    setName(""); setEmail(""); setPhone("");
    await refresh(); // reconcile with server truth
  } catch (err) {
    // Rollback the optimistic change
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, taken: false } : s))
    );
    setMessage({ kind: "err", text: (err as Error).message });
  }
}
```

### Notes

- Use the functional updater form of `setSlots` to avoid stale-closure bugs.
- Capture `selected.startsAt`/`selected.id` before clearing `selected`.
- `refresh()` already calls `fetchSlots()` and `setSlots`; calling it on success
  removes the unused-function smell and reconciles `taken` flags from the server
  (which becomes authoritative once issue 01 is fixed).

## Interaction with other fixes

- Depends conceptually on **01** (server returns `409` on races) so the rollback
  path is actually exercised. Works regardless, but the rollback is most useful
  once the server reliably rejects double-bookings.
- After **02**, `refresh()` will also drop past slots naturally.

## Affected files

- `client/App.tsx` — rewrite `onSubmit` for immutable optimistic update + rollback
  + post-success `refresh()`.

## Edge cases

- Rapid double-submit of the form → second call hits a taken slot; server returns
  `409`; rollback + error message. (Button could also be disabled while pending —
  optional enhancement.)
- Network error mid-request → treated as failure → rollback.

## Testing strategy

- Manual: book a slot → it flips to "Booked" instantly and stays after refresh.
- Manual failure: force a `409` (book the same slot from two tabs) → the losing
  tab shows the error and the slot returns to bookable.
