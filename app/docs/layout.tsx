import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site/site-header";
import { DocsSearch } from "@/components/docs/search";
import "./docs.css";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteHeader
        innerClassName="d-header-in"
        mobileNav={false}
        githubIcon={false}
        badge={<Badge style={{ marginLeft: 4 }}>Docs</Badge>}
        center={<DocsSearch />}
      />
      {children}
    </div>
  );
}
