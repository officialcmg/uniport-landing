"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** A value in a mono chip with a copy button. `label` names the value for screen readers. */
export function CopyValue({ value, label, className }: { value: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center rounded-md border border-line-100 bg-surface-200 font-mono text-[13px] text-ink-100",
        className,
      )}
    >
      <code aria-label={label} className="min-w-0 flex-1 truncate py-1.5 pl-3">
        {value}
      </code>
      <button
        type="button"
        aria-label={copied ? `${label} copied` : `Copy ${label}`}
        className="ml-1 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-300 hover:text-ink-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-text"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? <Check aria-hidden className="size-3.5 text-success" /> : <Copy aria-hidden className="size-3.5" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </div>
  );
}
