"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/site/icon";
import { CodeCopyButton } from "@/components/site/copy";
import { CodeLines } from "@/components/site/code-block";
import { TOKENS } from "@/lib/tokens";
import { chainIcon } from "@/lib/chains";

const PMS = {
  npm: "npm install uniport-sdk",
  pnpm: "pnpm add uniport-sdk",
  yarn: "yarn add uniport-sdk",
  bun: "bun add uniport-sdk",
} as const;
type Pm = keyof typeof PMS;

/** Install command with package-manager tabs (shadcn Tabs in the code block head). */
export function InstallTabs() {
  const [pm, setPm] = useState<Pm>("npm");
  return (
    <div className="u-code" style={{ marginTop: 16 }}>
      <div className="u-code-head" style={{ paddingLeft: 6 }}>
        <Tabs value={pm} onValueChange={(v) => setPm(v as Pm)}>
          <TabsList variant="bare">
            {(Object.keys(PMS) as Pm[]).map((k) => (
              <TabsTrigger
                key={k}
                value={k}
              >
                {k}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <CodeCopyButton text={PMS[pm]} />
      </div>
      <CodeLines code={`$ ${PMS[pm]}`} lang="bash" lineNumbers={false} />
    </div>
  );
}

// The common settlement choices first.
const FEATURED = ["optimismUSDC", "baseUSDC", "arbitrumUSDC", "ethereumUSDC", "solanaUSDC", "suiUSDC", "polygonUSDC", "avalancheUSDC", "bscUSDC", "nearUSDC", "stellarUSDC", "tronUSDT"];
const rank = (name: string) => {
  const i = FEATURED.indexOf(name);
  return i < 0 ? FEATURED.length : i;
};

const FILTERS = [
  { id: "all", label: `All ${TOKENS.length}` },
  { id: "stable", label: "Stablecoins" },
  { id: "native", label: "Native" },
] as const;
type Filter = (typeof FILTERS)[number]["id"];

/** Destination tokens: filter tabs, search, and the first 12 rows until "Show all". */
export function TokenTable({ initial = "stable", limit = 12 }: { initial?: Filter; limit?: number }) {
  const [filter, setFilter] = useState<Filter>(initial);
  const [query, setQuery] = useState("");
  const [all, setAll] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...TOKENS]
      .sort((a, b) => rank(a.name) - rank(b.name))
      .filter((t) => filter === "all" || t.kind === filter).filter(
      (t) => !q || t.chain.toLowerCase().includes(q) || t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
    );
  }, [filter, query]);
  const shown = all || query ? rows : rows.slice(0, limit);

  return (
    <>
      <div className="d-tokbar">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            {FILTERS.map((f) => (
              <TabsTrigger
                key={f.id}
                value={f.id}
              >
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <label style={{ position: "relative", width: 240 }}>
          <span style={{ position: "absolute", left: 10, top: 10, color: "var(--ink-300)" }}>
            <Icon name="search" size="sm" />
          </span>
          <input
            className="u-input"
            placeholder="Filter by chain or symbol"
            aria-label="Filter tokens"
            style={{ paddingLeft: 32 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>
      <div className="u-table-wrap" style={{ marginTop: 12 }}>
        <table className="u-table">
          <thead>
            <tr>
              <th>Chain</th>
              <th>destinationToken</th>
              <th>Symbol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((t) => (
              <tr key={t.name}>
                <td>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="u-logo-24" style={{ width: 20, height: 20 }} src={chainIcon(t.icon)} alt="" />
                    {t.chain}
                  </span>
                </td>
                <td className="u-mono" style={{ fontSize: 13, color: "var(--syn-s)" }}>{t.name}</td>
                <td>{t.symbol}</td>
                <td style={{ textAlign: "right" }}>{t.memo ? <Badge variant="warning">Memo + trustline</Badge> : null}</td>
              </tr>
            ))}
            {shown.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ color: "var(--ink-300)" }}>No token matches “{query}”.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {!all && !query && (filter !== "all" || rows.length > limit) ? (
        <Button
          variant="secondary"
          size="md"
          style={{ marginTop: 12 }}
          onClick={() => {
            setFilter("all");
            setAll(true);
          }}
        >
          Show all {TOKENS.length} tokens
        </Button>
      ) : null}
    </>
  );
}
