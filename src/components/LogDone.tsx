"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogDone({ testSlug, lastDone }: { testSlug: string; lastDone: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(lastDone || "");
  const [busy, setBusy] = useState(false);
  async function save() {
    if (!date) return;
    setBusy(true);
    await fetch("/api/screening-log", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ testSlug, doneOn: date }) });
    setBusy(false); setOpen(false); router.refresh();
  }
  if (!open) return (
    <button className="btn ghost" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setOpen(true)}>
      {lastDone ? "Update date" : "Log last done"}
    </button>
  );
  return (
    <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: "8px 10px", border: "1.5px solid var(--line)", borderRadius: 10, fontFamily: "inherit" }} />
      <button className="btn primary" style={{ padding: "8px 14px", fontSize: 13 }} onClick={save} disabled={busy}>{busy ? "…" : "Save"}</button>
    </span>
  );
}
