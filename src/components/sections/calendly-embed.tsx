"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

export function CalendlyEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const parent = ref.current;
    const tryInit = () => {
      if (window.Calendly && parent && !parent.dataset.calInit) {
        parent.dataset.calInit = "1";
        window.Calendly.initInlineWidget({
          url,
          parentElement: parent,
        });
        return true;
      }
      return false;
    };

    if (tryInit()) return;

    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]',
    );
    if (existing) {
      existing.addEventListener("load", tryInit);
      return () => existing.removeEventListener("load", tryInit);
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = tryInit;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [url]);

  return (
    <div
      ref={ref}
      className="calendly-inline-widget overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-ink-800)]"
      data-auto-load="false"
      style={{ minWidth: "320px", height: "720px" }}
    />
  );
}
