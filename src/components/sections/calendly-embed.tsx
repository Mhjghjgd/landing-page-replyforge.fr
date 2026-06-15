"use client";

import { useEffect } from "react";

const CALENDLY_URL =
  "https://calendly.com/d/dz38-h5g-wby/one-off-meeting?hide_gdpr_banner=1";

export function CalendlyEmbed() {
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]',
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="calendly-inline-widget overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-ink-800)]"
      data-url={CALENDLY_URL}
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
