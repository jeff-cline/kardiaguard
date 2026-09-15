"use client";
import { useState } from "react";

export default function ReminderToggle({ initialOn }: { initialOn: boolean }) {
  const [on, setOn] = useState(initialOn);
  const [busy, setBusy] = useState(false);
  async function toggle() {
    const next = !on; setBusy(true); setOn(next);
    await fetch("/api/reminders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ on: next }) });
    setBusy(false);
  }
  return (
    <button onClick={toggle} disabled={busy} aria-pressed={on}
      style={{ cursor: "pointer", border: "none", borderRadius: 999, padding: "10px 18px", fontWeight: 800, fontSize: 14,
        background: on ? "linear-gradient(180deg,#5cebb0,#059669)" : "#eee", color: on ? "#06110c" : "#555" }}>
      {on ? "🔔 Reminders ON" : "Reminders OFF"}
    </button>
  );
}
