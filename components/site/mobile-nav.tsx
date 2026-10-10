"use client";

import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/site/icon";
import type { NavLink } from "@/components/site/site-header";
import { LINKS } from "@/lib/chains";

export function MobileNav({ nav }: { nav: NavLink[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="u-menu-btn" aria-label="Open menu">
          <Icon name="menu" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] border-line-100 bg-surface-200 p-0">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 pt-16">
          {nav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex h-11 items-center rounded-md px-3 text-[15px] font-medium text-ink-200 hover:bg-surface-300 hover:text-ink-100"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={LINKS.github}
            className="flex h-11 items-center gap-2 rounded-md px-3 text-[15px] font-medium text-ink-200 hover:bg-surface-300 hover:text-ink-100"
          >
            <Icon name="github" size="sm" />
            GitHub
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
