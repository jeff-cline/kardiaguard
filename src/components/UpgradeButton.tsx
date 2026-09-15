"use client";
import { useState } from "react";

export default function UpgradeButton() {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  async function go() {
    setState("busy");
    await fetch("/api/upgrade", { method: "POST" });
    setState("done");
  }
  if (state === "done") return <p className="note" style={{ margin: 0 }}>🎉 Thanks — we&rsquo;ll get you set up on the live program and reach out with next steps.</p>;
  return <button className="btn pulse" onClick={go} disabled={state === "busy"}>{state === "busy" ? "…" : "Start the live program — $99/mo"}</button>;
}
