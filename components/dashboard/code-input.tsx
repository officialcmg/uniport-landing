"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const LENGTH = 6;

/**
 * A six-box input for a one-time code. One real input sits over the boxes, so
 * pasting, the keyboard's "code from Messages/Mail" suggestion and screen
 * readers all work as they do for a plain field.
 */
export function CodeInput({
  id,
  value,
  onChange,
  onComplete,
  disabled,
  invalid,
  errorId,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  /** The id of the element that holds the error message, when there is one. */
  errorId?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, LENGTH - 1);

  return (
    <div className="relative">
      <div className="grid grid-cols-6 gap-2" aria-hidden="true">
        {Array.from({ length: LENGTH }, (_, index) => (
          <div
            key={index}
            className={cn(
              "flex h-13 items-center justify-center rounded-lg border bg-surface-100 font-mono text-xl text-ink-100 transition-colors",
              invalid ? "border-destructive" : "border-line-200",
              focused && index === active && !invalid && "border-ink-100 ring-2 ring-ink-100/15",
              disabled && "opacity-60",
            )}
          >
            {value[index] ?? (focused && index === active ? <span className="h-5 w-px animate-pulse bg-ink-100" /> : null)}
          </div>
        ))}
      </div>
      <input
        id={id}
        name="code"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        aria-label="6-digit sign-in code"
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        required
        autoFocus
        disabled={disabled}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          const next = event.target.value.replace(/\D/g, "").slice(0, LENGTH);
          onChange(next);
          if (next.length === LENGTH && next !== value) onComplete?.(next);
        }}
        className="absolute inset-0 h-full w-full cursor-text rounded-lg bg-transparent text-transparent caret-transparent opacity-0 outline-none"
      />
    </div>
  );
}
