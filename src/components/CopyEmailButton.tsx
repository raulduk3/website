"use client";

import { useEffect, useState } from "react";

type CopyStatus = "idle" | "copying" | "copied" | "unavailable";

export default function CopyEmailButton({ email }: { email: string }) {
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    setHydrated(true);
  }, []);

  const copyEmail = async () => {
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("unavailable");
    }
  };

  if (!hydrated) return null;

  return (
    <div className="copy-email">
      <button type="button" onClick={copyEmail} disabled={status === "copying"}>
        <span className="link-label">Copy email address</span>
      </button>
      <p role="status">
        {status === "copied" && "Email address copied."}
        {status === "unavailable" && "Copy is unavailable. Use the email link or select the address above."}
      </p>
    </div>
  );
}
