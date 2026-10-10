"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Icon } from "@/components/site/icon";
import { DOC_PAGES, SEARCH_EXTRAS, docHref } from "@/lib/docs-nav";

function Mark({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/** Header search trigger + ⌘K command palette (shadcn Command in a Dialog). */
export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const groups = [
    {
      heading: "Pages",
      items: [
        ...DOC_PAGES.map((p) => ({ key: p.slug, label: p.title, context: p.group, href: docHref(p.slug), icon: "file" as const, mono: false, keywords: "" })),
        ...SEARCH_EXTRAS.filter((e) => e.group === "Pages").map((e) => ({ key: e.label, label: e.label, context: e.context, href: e.href, icon: "file" as const, mono: false, keywords: e.keywords ?? "" })),
      ],
    },
    {
      heading: "Props",
      items: SEARCH_EXTRAS.filter((e) => e.group === "Props").map((e) => ({ key: e.label, label: e.label, context: e.context, href: e.href, icon: "code" as const, mono: true, keywords: e.keywords ?? "" })),
    },
    {
      heading: "Sections",
      items: SEARCH_EXTRAS.filter((e) => e.group === "Sections").map((e) => ({ key: e.label, label: e.label, context: e.context, href: e.href, icon: "hash" as const, mono: false, keywords: e.keywords ?? "" })),
    },
  ];

  return (
    <>
      <button type="button" className="d-search" aria-label="Search docs" onClick={() => setOpen(true)}>
        <Icon name="search" size="sm" />
        <span>Search docs</span>
        <span className="u-kbd-group" style={{ display: "inline-flex", gap: 4 }}>
          <kbd className="u-kbd">⌘</kbd>
          <kbd className="u-kbd">K</kbd>
        </span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-[112px] w-[640px] max-w-[calc(100%-32px)] translate-y-0 gap-0 overflow-hidden rounded-[16px] border border-line-100 bg-surface-200 p-0 shadow-popover ring-0 sm:max-w-[640px]"
        >
          <DialogTitle className="sr-only">Search docs</DialogTitle>
          <DialogDescription className="sr-only">Search pages, props and sections of the Uniport docs.</DialogDescription>
          <Command className="rounded-none! bg-transparent p-0" loop>
            <div style={{ display: "flex", alignItems: "center", gap: 12, height: 56, padding: "0 16px", borderBottom: "1px solid var(--line-100)" }}>
              <Icon name="search" style={{ color: "var(--ink-300)" }} />
              <CommandPrimitive.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Search docs"
                aria-label="Search"
                className="flex-1 border-0 bg-transparent text-[16px] leading-6 text-ink-100 outline-none placeholder:text-ink-300"
              />
              <kbd className="u-kbd">esc</kbd>
            </div>
            <CommandList className="k-list max-h-[380px] p-2">
              <CommandEmpty className="px-3 py-6 text-center text-sm text-ink-300">No results for “{query}”.</CommandEmpty>
              {groups.map((g) => (
                <CommandGroup key={g.heading} heading={g.heading} className="k-group p-0">
                  {g.items.map((it) => (
                    <CommandItem
                      key={g.heading + it.key}
                      value={`${it.label} ${it.context}`}
                      keywords={it.keywords ? [it.keywords] : undefined}
                      onSelect={() => go(it.href)}
                      className="k-item"
                    >
                      <Icon name={it.icon} />
                      <span className={it.mono ? "u-mono" : undefined} style={it.mono ? { fontSize: 13 } : undefined}>
                        <Mark text={it.label} query={query} />
                      </span>
                      <small>{it.context}</small>
                      <kbd className="u-kbd">↵</kbd>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
          <div style={{ display: "flex", alignItems: "center", gap: 16, height: 40, padding: "0 16px", borderTop: "1px solid var(--line-100)", fontSize: 12, color: "var(--ink-300)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <kbd className="u-kbd">↑</kbd>
              <kbd className="u-kbd">↓</kbd>Navigate
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <kbd className="u-kbd">↵</kbd>Open
            </span>
            <span style={{ marginLeft: "auto" }}>
              Also in{" "}
              <a href="/llms.txt" style={{ color: "var(--brand-text)" }}>
                llms.txt
              </a>
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
