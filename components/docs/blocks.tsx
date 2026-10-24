import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/site/icon";
import { CodeBlock } from "@/components/site/code-block";
import { DOC_PAGES, docHref } from "@/lib/docs-nav";

export const DEPOSIT_SNIPPET = `import { UniportButton } from "uniport-sdk";

export function DepositAction() {
  return (
    <UniportButton
      recipient="0x..."
      destinationToken="optimismUSDC"
      label="Deposit"
    />
  );
}`;

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[`’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in node) return textOf((node as { props: { children?: ReactNode } }).props.children);
  return "";
}

/** A numbered step heading: ① Install the SDK */
export function Step({ n, id, children }: { n: number; id?: string; children: ReactNode }) {
  return (
    <h2 id={id ?? slugify(textOf(children))}>
      <span className="d-stepn">{n}</span>
      {children}
    </h2>
  );
}

/** A section heading with a fixed anchor id. */
export function H2({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id}>{children}</h2>;
}

/** The canonical integration — the one way to use Uniport, everywhere. */
export function DepositSnippet({ icon = true }: { icon?: boolean }) {
  return <CodeBlock code={DEPOSIT_SNIPPET} file="DepositAction.tsx" fileIcon={icon} />;
}

export function Code({ code, file, lang = "tsx", lineNumbers }: { code: string; file?: string; lang?: string; lineNumbers?: boolean }) {
  return <CodeBlock code={code} file={file} lang={lang} lineNumbers={lineNumbers ?? lang !== "bash"} />;
}

export function Callout({ title, tone = "info", children }: { title?: string; tone?: "info" | "warn"; children: ReactNode }) {
  return (
    <div className={`u-alert${tone === "warn" ? " u-alert-warn" : ""}`} style={{ marginTop: tone === "warn" ? 24 : 16 }}>
      <Icon name={tone === "warn" ? "warning" : "info"} />
      <p style={{ margin: 0, color: tone === "warn" ? "var(--ink-100)" : undefined }}>
        {title ? <b>{title}</b> : null}
        {title ? " " : null}
        {children}
      </p>
    </div>
  );
}

/** Checkmark list ("Before you start"). */
export function Checklist({ items }: { items: ReactNode[] }) {
  return (
    <ul className="d-list">
      {items.map((it, i) => (
        <li key={i}>
          <Icon name="check" size="sm" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function Badges({ items }: { items: string[] }) {
  return (
    <div className="u-row" style={{ marginTop: 16, gap: 8 }}>
      {items.map((b) => (
        <Badge key={b}>{b}</Badge>
      ))}
    </div>
  );
}

export function Steps({ items, current, cols = 2 }: { items: { title: string; body: ReactNode }[]; current?: number; cols?: number }) {
  return (
    <ol className="u-steps" style={{ marginTop: 24, gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: "20px 24px" }}>
      {items.map((s, i) => (
        <li key={s.title} className={`u-step${current === i + 1 ? " u-step-on" : ""}`}>
          <span className="u-step-n">{String(i + 1).padStart(2, "0")}</span>
          <p className="u-h4">{s.title}</p>
          <p className="u-small">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function NextSteps({ items }: { items: { title: string; body: ReactNode; href: string }[] }) {
  return (
    <div className="d-next">
      {items.map((it) => (
        <Link key={it.title} className="u-card u-card-hover" href={it.href}>
          <span className="u-h4">{it.title}</span>
          <span className="u-small">{it.body}</span>
        </Link>
      ))}
    </div>
  );
}

/** A simple two/three column table; rows are arrays of cells. */
export function DocTable({ head, rows, fixed }: { head: string[]; rows: ReactNode[][]; fixed?: (number | undefined)[] }) {
  return (
    <div className="u-table-wrap" style={{ marginTop: 16 }}>
      <table className="u-table" style={fixed ? { tableLayout: "fixed" } : undefined}>
        {fixed ? (
          <colgroup>
            {fixed.map((w, i) => (
              <col key={i} style={w ? { width: w } : undefined} />
            ))}
          </colgroup>
        ) : null}
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const M = ({ children }: { children: ReactNode }) => <span className="u-mono" style={{ fontSize: 13 }}>{children}</span>;
export const C = ({ children }: { children: ReactNode }) => <span className="u-inline-code">{children}</span>;

type PropRow = { name: string; required?: boolean; type: string; def: string; desc: ReactNode };

export const BUTTON_PROPS: PropRow[] = [
  { name: "recipient", required: true, type: "string", def: "—", desc: "Your address on the destination chain. Funds settle here." },
  { name: "destinationToken", required: true, type: "string", def: "—", desc: <>What your app receives, as <C>{"{chain}{SYMBOL}"}</C>. See <a className="d-link" href="#tokens">destination tokens</a>.</> },
  { name: "label", type: "string", def: "\"Pay with Crypto\"", desc: "The button text." },
  { name: "amount", type: "string", def: "—", desc: "The exact amount to receive, in destination token units. The payer sends the quoted input, rounded up by at most 0.25%. Omit it to let the payer choose." },
  { name: "refundAddress", type: "string", def: "—", desc: "Prefills the payer’s refund address on their source chain. Not used when amount is set." },
  { name: "theme", type: "\"light\" | \"dark\"", def: "\"light\"", desc: "Theme for the button and modal." },
  { name: "variant", type: "\"default\" | \"compact\" | \"outline\"", def: "\"default\"", desc: "Button style." },
  { name: "disabled", type: "boolean", def: "false", desc: "Disables the button." },
  { name: "className", type: "string", def: "—", desc: "Class name for your own styles." },
  { name: "onSuccess", type: "(result) => void", def: "—", desc: <>Called when the payment completes, with <C>{"{ txHash, amount }"}</C>.</> },
  { name: "onError", type: "(error) => void", def: "—", desc: "Called when the payment fails." },
  { name: "onOpenChange", type: "(open) => void", def: "—", desc: "Called when the modal opens or closes." },
];

export function ButtonPropsTable() {
  return (
    <div className="u-table-wrap" style={{ marginTop: 16 }}>
      <table className="u-table" style={{ tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: 160 }} />
          <col style={{ width: 190 }} />
          <col style={{ width: 130 }} />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {BUTTON_PROPS.map((p) => (
            <tr key={p.name}>
              <td>
                {p.required ? (
                  <>
                    <span className="d-prop">{p.name}</span>
                    <br />
                    <Badge style={{ marginTop: 6 }}>required</Badge>
                  </>
                ) : (
                  <span className="d-prop">{p.name}</span>
                )}
              </td>
              <td className="d-type">{p.type}</td>
              <td className="d-def">{p.def}</td>
              <td>{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PrevNext({ slug }: { slug: string }) {
  const i = DOC_PAGES.findIndex((p) => p.slug === slug);
  const prev = DOC_PAGES[i - 1];
  const next = DOC_PAGES[i + 1];
  return (
    <div className="d-pn">
      {prev ? (
        <Link href={docHref(prev.slug)}>
          <span className="u-caption">Previous</span>
          <span style={{ color: "var(--ink-100)", fontWeight: 500 }}>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={docHref(next.slug)} style={{ textAlign: "right" }}>
          <span className="u-caption">Next</span>
          <span style={{ color: "var(--ink-100)", fontWeight: 500 }}>{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
