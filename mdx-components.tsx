import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import {
  Badges, ButtonPropsTable, C, Callout, Checklist, Code, DepositSnippet, DocTable, H2, M, NextSteps, Step, Steps, slugify, textOf,
} from "@/components/docs/blocks";
import { InstallTabs, TokenTable } from "@/components/docs/interactive";

// Markdown elements in the docs' type: prose in ink-200, inline code on surface-300.
const components: MDXComponents = {
  Badges, ButtonPropsTable, C, Callout, Checklist, Code, DepositSnippet, DocTable, H2, M, NextSteps, Step, Steps, InstallTabs, TokenTable,
  h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  h3: ({ children }) => <h3 id={slugify(textOf(children))}>{children}</h3>,
  code: ({ children }) => <span className="u-inline-code">{children}</span>,
  ul: ({ children }) => <ul className="d-ul">{children}</ul>,
  a: ({ href = "", children }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link className="d-link" href={href}>
        {children}
      </Link>
    ) : (
      <a className="d-link" href={href}>
        {children}
      </a>
    ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
