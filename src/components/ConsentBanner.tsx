"use client";
import { useEffect, useState } from "react";

export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem("kg_consent")) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);
  if (!show) return null;
  return (
    <div id="consent" role="dialog" aria-label="Consent notice">
      <div className="in">
        <span style={{ flex: 1, minWidth: 240 }}>
          We use cookies and visitor analytics to understand interest, improve Kardia Guard, and connect
          you with relevant heart-health resources. By continuing you consent to this and to our data
          practices. We never diagnose or sell you a test.
        </span>
        <button
          onClick={() => {
            try {
              localStorage.setItem("kg_consent", "1");
            } catch {}
            setShow(false);
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
