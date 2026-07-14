import type { Slot, Booking } from "./types";

export async function fetchSlots(): Promise<Slot[]> {
  const r = await fetch("/api/slots");
  const data = await r.json();
  return data.slots;
}

export async function createBooking(input: {
  slotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}): Promise<Booking> {
  const r = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error ?? "booking failed");
  }
  return r.json();
}

export function formatSlot(startsAtIso: string): string {
  // Parse the full ISO string (including the trailing "Z") so it is treated as a
  // UTC instant. toLocaleString then renders it in the viewer's local timezone.
  // Slicing off the "Z" previously made JS read the UTC time as local time.
  return new Date(startsAtIso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
