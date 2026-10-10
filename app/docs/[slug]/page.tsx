import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badges, PrevNext, slugify } from "@/components/docs/blocks";
import { DocsMobileBar, DocsSidebar, DocsToc } from "@/components/docs/nav";
import { CopyLink } from "@/components/site/copy";
import { Icon } from "@/components/site/icon";
import { DOC_PAGES, getDoc, type TocItem } from "@/lib/docs-nav";

export const dynamicParams = false;

export function generateStaticParams() {
  return DOC_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  return doc ? { title: `${doc.title} — Docs`, description: doc.description } : {};
}

type DocMeta = { lede?: string; badges?: string[]; mono?: boolean; wide?: boolean };

const source = (slug: string) => fs.readFile(path.join(process.cwd(), "content/docs", `${slug}.mdx`), "utf8");

/** Table of contents from the page source: `## Heading`, <H2 id>, and <Step id>. */
function buildToc(mdx: string): TocItem[] {
  const toc: TocItem[] = [];
  const clean = (s: string) => s.replace(/`/g, "").replace(/<[^>]+>/g, "").trim();
  for (const line of mdx.split("\n")) {
    let m = line.match(/^## (.+)$/);
    if (m) {
      toc.push({ id: slugify(clean(m[1])), label: clean(m[1]) });
      continue;
    }
    m = line.match(/^<(?:Step|H2)\b[^>]*?(?:id="([^"]+)")?[^>]*>(.+?)<\/(?:Step|H2)>/);
    if (m) toc.push({ id: m[1] ?? slugify(clean(m[2])), label: clean(m[2]) });
  }
  return toc;
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const mod = (await import(`@/content/docs/${slug}.mdx`)) as { default: React.ComponentType; meta?: DocMeta };
  const Content = mod.default;
  const meta = mod.meta ?? {};
  const raw = await source(slug);
  const toc = buildToc(raw);

  return (
    <>
      <DocsMobileBar slug={slug} toc={toc} />
      <div className="d-shell">
        <DocsSidebar />
        <main className={`d-main${meta.wide ? " d-wide" : ""}`}>
          <nav className="d-crumb" aria-label="Breadcrumb">
            <Link href="/docs/introduction">Docs</Link>
            <Icon name="chevronRight" size="sm" />
            <span>{doc.group}</span>
          </nav>
          <h1 className="u-h1" style={meta.mono ? { fontFamily: "var(--font-mono)", letterSpacing: "-0.04em" } : undefined}>
            {doc.title}
          </h1>
          <p className="u-lede" style={{ marginTop: 12 }}>
            {meta.lede ?? doc.description}
          </p>
          {meta.badges ? <Badges items={meta.badges} /> : null}
          <Content />
          <PrevNext slug={slug} />
          <div className="u-row" style={{ justifyContent: "space-between", marginTop: 24 }}>
            <a className="u-caption" href={`https://github.com/officialcmg/uniport-landing/blob/main/content/docs/${slug}.mdx`}>
              Edit this page on GitHub
            </a>
            <Link className="u-caption" href="/docs/changelog">
              Changelog · 0.0.7
            </Link>
          </div>
        </main>
        <DocsToc toc={toc}>
          <hr className="u-sep" style={{ margin: "12px 0" }} />
          <CopyLink text={raw}>Copy page as Markdown</CopyLink>
          <a href="/llms.txt" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="file" size="sm" />
            llms.txt
          </a>
        </DocsToc>
      </div>
    </>
  );
}
