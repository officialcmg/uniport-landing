"use client";

import { useState } from "react";
import { Icon } from "@/components/site/icon";

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };
  return { copied, copy };
}

/** The "Copy" button in a code block header. */
export function CodeCopyButton({ text }: { text: string }) {
  const { copied, copy } = useCopy(text);
  return (
    <button type="button" className="u-code-copy" onClick={copy}>
      <Icon name={copied ? "check" : "copy"} size="sm" />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/** `$ npm i uniport-sdk` with a copy icon (shadcn Button anatomy, outline). */
export function InstallCommand({
  command = "npm i uniport-sdk",
  compact = false,
}: {
  command?: string;
  compact?: boolean;
}) {
  const { copied, copy } = useCopy(command);
  return (
    <div className="u-cmd" style={{ alignSelf: "flex-start", ...(compact ? { height: 36 } : null) }}>
      <span>
        <span className="u-cmd-p">$ </span>
        {command}
      </span>
      <button type="button" aria-label="Copy install command" onClick={copy}>
        <Icon name={copied ? "check" : "copy"} size="sm" />
      </button>
    </div>
  );
}

/** A plain text link-style action that copies a value. */
export function CopyLink({ text, children }: { text: string; children: React.ReactNode }) {
  const { copied, copy } = useCopy(text);
  return (
    <button type="button" className="d-toc-action" onClick={copy}>
      <Icon name={copied ? "check" : "copy"} size="sm" />
      {copied ? "Copied" : children}
    </button>
  );
}
