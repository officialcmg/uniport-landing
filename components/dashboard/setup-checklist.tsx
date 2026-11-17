"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type SetupStep = {
  key: string;
  title: string;
  /** Set when the dashboard itself knows whether the step is done. Leave out for steps only the developer can tick. */
  done?: boolean;
  children: ReactNode;
};

const EVENT = "uniport:setup";
const storageKey = (appId: string) => `uniport:setup:${appId}`;

function read(appId: string): string {
  try {
    return window.localStorage.getItem(storageKey(appId)) ?? "";
  } catch {
    return "";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * The "Get started" guide as a checklist. Steps the dashboard can see for
 * itself are ticked from the server; the rest are ticked by the developer and
 * remembered in this browser. A ticked step folds away, and the first step
 * still open is marked as the one to do next.
 */
export function SetupChecklist({ appId, steps }: { appId: string; steps: SetupStep[] }) {
  const stored = useSyncExternalStore(
    subscribe,
    () => read(appId),
    () => "",
  );
  const ticked = new Set(stored.split(",").filter(Boolean));

  function toggle(key: string) {
    const next = new Set(ticked);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    try {
      window.localStorage.setItem(storageKey(appId), [...next].join(","));
    } catch {
      // Private browsing: the tick just does not stick.
    }
    window.dispatchEvent(new Event(EVENT));
  }

  const state = steps.map((step) => ({
    ...step,
    manual: step.done === undefined,
    isDone: step.done ?? ticked.has(step.key),
  }));
  const doneCount = state.filter((step) => step.isDone).length;
  const nextKey = state.find((step) => !step.isDone)?.key;

  return (
    <section aria-labelledby="setup-title" className="rounded-xl border border-line-100 bg-surface-200">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 px-5 pt-5 pb-4 sm:px-6">
        <div className="min-w-0">
          <h2 id="setup-title" className="text-base font-medium text-ink-100">
            Get started
          </h2>
          <p className="mt-1 text-sm leading-6 text-ink-200">This guide goes away once a payment arrives.</p>
        </div>
        <p className="u-num text-sm leading-6 text-ink-300" aria-live="polite">
          {doneCount} of {steps.length} done
        </p>
      </div>
      <ol className="border-t border-line-100">
        {state.map((step, index) => {
          const current = step.key === nextKey;
          return (
            <li
              key={step.key}
              aria-current={current ? "step" : undefined}
              className="grid grid-cols-[24px_minmax(0,1fr)] gap-x-3 border-t border-line-100 px-5 py-4 first:border-0 sm:gap-x-4 sm:px-6"
            >
              <span
                aria-hidden
                className={cn(
                  "u-num flex size-6 items-center justify-center rounded-full text-xs font-medium",
                  step.isDone
                    ? "bg-success-soft text-success"
                    : current
                      ? "bg-ink-100 text-on-ink"
                      : "border border-line-200 text-ink-300",
                )}
              >
                {step.isDone ? <Check className="size-3.5" /> : index + 1}
              </span>
              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                  <h3
                    className={cn(
                      "text-sm leading-6 font-medium",
                      step.isDone ? "text-ink-200" : current ? "text-ink-100" : "text-ink-200",
                    )}
                  >
                    {step.title}
                    {step.isDone ? <span className="sr-only"> (done)</span> : null}
                  </h3>
                  {step.manual ? (
                    <button
                      type="button"
                      onClick={() => toggle(step.key)}
                      className="cursor-pointer rounded-sm text-[13px] leading-6 text-ink-300 underline-offset-4 hover:text-ink-100 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-text"
                    >
                      {step.isDone ? "Undo" : "Mark as done"}
                      <span className="sr-only">: {step.title}</span>
                    </button>
                  ) : null}
                </div>
                {step.manual && step.isDone ? null : step.children}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
