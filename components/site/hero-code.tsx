"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/site/icon";
import { CodeCopyButton } from "@/components/site/copy";

type Prop = "rec" | "dest" | "label";

const SNIPPET = `import { UniportButton } from "uniport-sdk";

export function DepositAction() {
  return (
    <UniportButton
      recipient="0x..."
      destinationToken="optimismUSDC"
      label="Deposit"
    />
  );
}`;

const CAPTIONS: Record<Prop, string> = {
  rec: "recipient — your address on the destination chain. Funds settle here.",
  dest: "destinationToken — what your app receives, and on which chain: USDC on Optimism.",
  label: "label — the words on the button your users press.",
};

/**
 * The hero: the whole integration. Each prop line explains itself in the footer
 * on hover/focus; it plays through once on load, then rests on destinationToken.
 */
export function HeroCode() {
  const [active, setActive] = useState<Prop>("dest");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const seq: Prop[] = ["rec", "dest", "label", "dest"];
    let i = 0;
    timer.current = setInterval(() => {
      if (i >= seq.length) {
        if (timer.current) clearInterval(timer.current);
        return;
      }
      setActive(seq[i]);
      i++;
    }, 900);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const pick = (p: Prop) => () => {
    if (timer.current) clearInterval(timer.current);
    setActive(p);
  };
  const line = (p: Prop) => `u-ln u-ln-btn${active === p ? " u-ln-hl" : ""}`;
  const handlers = (p: Prop) => ({ onMouseEnter: pick(p), onFocus: pick(p), onClick: pick(p) });

  return (
    <div className="h-obj" aria-label="The whole integration">
      <div className="u-code h-obj-code">
        <div className="u-code-head">
          <span className="u-code-file">
            <Icon name="file" size="sm" />
            DepositAction.tsx
          </span>
          <CodeCopyButton text={SNIPPET} />
        </div>
        <pre>
          <span className="u-ln"><i>1</i><span className="u-k">import</span> {"{ UniportButton }"} <span className="u-k">from</span> <span className="u-s">&quot;uniport-sdk&quot;</span>;</span>
          <span className="u-ln"><i>2</i></span>
          <span className="u-ln"><i>3</i><span className="u-k">export function</span> DepositAction() {"{"}</span>
          <span className="u-ln"><i>4</i>{"  "}<span className="u-k">return</span> (</span>
          <span className="u-ln"><i>5</i>{"    "}<span className="u-t">&lt;UniportButton</span></span>
          <button type="button" className={line("rec")} {...handlers("rec")}><i>6</i>{"      "}<span className="u-a">recipient</span>=<span className="u-s">&quot;0x...&quot;</span></button>
          <button type="button" className={line("dest")} {...handlers("dest")}><i>7</i>{"      "}<span className="u-a">destinationToken</span>=<span className="u-s">&quot;optimismUSDC&quot;</span></button>
          <button type="button" className={line("label")} {...handlers("label")}><i>8</i>{"      "}<span className="u-a">label</span>=<span className="u-s">&quot;Deposit&quot;</span></button>
          <span className="u-ln"><i>9</i>{"    "}<span className="u-t">/&gt;</span></span>
          <span className="u-ln"><i>10</i>{"  "});</span>
          <span className="u-ln"><i>11</i>{"}"}</span>
        </pre>
        <div
          aria-live="polite"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderTop: "1px solid var(--line-100)", fontSize: 12, lineHeight: "16px", color: "var(--ink-300)" }}
        >
          <Icon name="chevronRight" size="sm" />
          <span>{CAPTIONS[active]}</span>
        </div>
      </div>
    </div>
  );
}
