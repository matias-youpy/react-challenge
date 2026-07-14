import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { fetchSlots, createBooking, formatSlot } from "./api";
import type { Slot } from "./types";

function App() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSlots().then(setSlots);
  }, []);

  async function refresh() {
    const next = await fetchSlots();
    setSlots(next);
  }

  function setSlotTaken(slotId: string, taken: boolean) {
    setSlots((prev) => prev.map((s) => (s.id === slotId ? { ...s, taken } : s)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || submitting) return;

    const slotId = selected.id;
    const slotStartsAt = selected.startsAt;
    setSubmitting(true);

    // Optimistically mark the slot as taken (new array + new object so React
    // actually re-renders).
    setSlotTaken(slotId, true);

    try {
      const b = await createBooking({
        slotId,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
      });
      setMessage({ kind: "ok", text: `Booked! Confirmation: ${b.id} at ${formatSlot(slotStartsAt)}` });
      setSelected(null);
      setName(""); setEmail(""); setPhone("");
      // Reconcile with server truth.
      await refresh();
    } catch (err) {
      // Roll back the optimistic change so the slot is bookable again.
      setSlotTaken(slotId, false);
      setMessage({ kind: "err", text: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Book a session</h1>
      <p>{slots.length} slots loaded</p>

      <div>
        {slots.map((s) => (
          <div key={s.id} className={"slot" + (s.taken ? " taken" : "")}>
            <span>{formatSlot(s.startsAt)} ({s.durationMinutes} min)</span>
            <button
              disabled={s.taken}
              onClick={() => setSelected(s)}
            >
              {s.taken ? "Booked" : "Choose"}
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <form onSubmit={onSubmit}>
          <h2>You picked {formatSlot(selected.startsAt)}</h2>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button type="submit" disabled={submitting}>
            {submitting ? "Booking…" : "Confirm booking"}
          </button>
        </form>
      )}

      {message && (
        <p className={message.kind}>{message.text}</p>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
