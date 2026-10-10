"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Icon } from "@/components/site/icon";
import { DOC_GROUPS, DOC_PAGES, docHref, getDoc, type TocItem } from "@/lib/docs-nav";

function SidebarGroups({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {DOC_GROUPS.map((group) => (
        <div key={group}>
          <h5>{group}</h5>
          <ul>
            {DOC_PAGES.filter((p) => p.group === group).map((p) => (
              <li key={p.slug}>
                <Link href={docHref(p.slug)} aria-current={pathname === docHref(p.slug) ? "page" : undefined} onClick={onNavigate}>
                  {p.nav ?? p.title}
                  {p.note ? <span className="u-caption u-mono">{p.note}</span> : null}
                </Link>
              </li>
            ))}
            {group === "Resources" ? (
              <li>
                <a href="/llms.txt" onClick={onNavigate}>llms.txt</a>
              </li>
            ) : null}
          </ul>
        </div>
      ))}
    </>
  );
}

export function DocsSidebar() {
  return (
    <aside className="d-side" aria-label="Docs navigation">
      <SidebarGroups />
    </aside>
  );
}

/** Phone bar under the header: opens the page list and the page's table of contents. */
export function DocsMobileBar({ slug, toc }: { slug: string; toc: TocItem[] }) {
  const [menu, setMenu] = useState(false);
  const [onPage, setOnPage] = useState(false);
  const page = getDoc(slug);
  return (
    <div className="d-mbar">
      <button type="button" onClick={() => setMenu(true)} aria-label="Open docs navigation">
        <Icon name="menuShort" />
        {page?.group} <span style={{ color: "var(--ink-300)" }}>/</span>{" "}
        <span style={{ color: "var(--ink-100)" }}>{page?.nav ?? page?.title}</span>
      </button>
      <button type="button" className="u-caption" onClick={() => setOnPage(true)}>
        On this page
      </button>
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-[280px] gap-0 border-line-100 bg-surface-100 p-0">
          <SheetTitle className="sr-only">Docs navigation</SheetTitle>
          <div className="d-side" style={{ display: "flex", border: 0, padding: "56px 20px 32px 30px", overflowY: "auto" }}>
            <SidebarGroups onNavigate={() => setMenu(false)} />
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={onPage} onOpenChange={setOnPage}>
        <SheetContent side="bottom" className="gap-0 border-line-100 bg-surface-200 p-0">
          <SheetTitle className="sr-only">On this page</SheetTitle>
          <nav className="d-toc" style={{ display: "flex", position: "static", padding: "20px 20px 28px", fontSize: 15, gap: 14 }}>
            <span className="u-caption" style={{ color: "var(--ink-100)", fontWeight: 500 }}>On this page</span>
            {toc.map((t) => (
              <a key={t.id} href={`#${t.id}`} onClick={() => setOnPage(false)}>
                {t.label}
              </a>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/** "On this page" rail; highlights the section in view. */
export function DocsToc({ toc, children }: { toc: TocItem[]; children?: React.ReactNode }) {
  const [current, setCurrent] = useState<string | undefined>(toc[1]?.id ?? toc[0]?.id);
  useEffect(() => {
    const onScroll = () => {
      let id: string | undefined;
      for (const t of toc) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < 140) id = t.id;
      }
      if (id) setCurrent(id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);
  return (
    <aside className="d-toc" aria-label="On this page">
      <span className="u-caption" style={{ color: "var(--ink-100)", fontWeight: 500 }}>On this page</span>
      {toc.map((t) => (
        <a key={t.id} href={`#${t.id}`} aria-current={current === t.id ? "true" : undefined} onClick={() => setCurrent(t.id)}>
          {t.label}
        </a>
      ))}
      {children}
    </aside>
  );
}
