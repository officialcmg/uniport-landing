// Single source for the docs sidebar, prev/next links, ⌘K search and llms.txt.

export type DocPage = {
  slug: string;
  title: string;
  group: string;
  description: string;
  /** Sidebar label when it differs from the title. */
  nav?: string;
  /** Small mono note shown at the right of the sidebar link. */
  note?: string;
};

export const DOC_GROUPS = ["Getting started", "UniportButton", "Reference", "Resources"] as const;

export const DOC_PAGES: DocPage[] = [
  { slug: "introduction", title: "Introduction", group: "Getting started", description: "What Uniport is, and what it does for your app." },
  { slug: "quickstart", title: "Quickstart", group: "Getting started", description: "Add a cross-chain deposit button to a React app." },
  { slug: "how-it-works", title: "How it works", group: "Getting started", description: "What happens between a click and a settled deposit." },
  { slug: "uniport-button", title: "UniportButton", nav: "Props", group: "UniportButton", description: "Every prop the button accepts, and every destination token." },
  { slug: "callbacks", title: "Callbacks", group: "UniportButton", description: "onSuccess, onError and onOpenChange." },
  { slug: "styling", title: "Styling", group: "UniportButton", description: "Theme, variant and className." },
  { slug: "chains-and-tokens", title: "Chains and tokens", group: "Reference", description: "All 24 source chains and 63 destination tokens." },
  { slug: "refunds", title: "Refunds", group: "Reference", description: "Where funds go when a payment can’t complete." },
  { slug: "memo-chains", title: "Memo chains", group: "Reference", description: "Chains that need a memo alongside the deposit address." },
  { slug: "errors", title: "Errors", group: "Reference", description: "UniportError and its codes." },
  { slug: "faq", title: "FAQ", group: "Resources", description: "Answers to what developers ask first." },
  { slug: "changelog", title: "Changelog", group: "Resources", description: "What changed in each uniport-sdk release.", note: "0.0.7" },
];

export const docHref = (slug: string) => `/docs/${slug}`;

export function getDoc(slug: string) {
  return DOC_PAGES.find((p) => p.slug === slug);
}

export function getNeighbours(slug: string) {
  const i = DOC_PAGES.findIndex((p) => p.slug === slug);
  return { prev: i > 0 ? DOC_PAGES[i - 1] : undefined, next: i < DOC_PAGES.length - 1 ? DOC_PAGES[i + 1] : undefined };
}

export type TocItem = { id: string; label: string };

/** Extra ⌘K entries: props and sections that deserve their own result. */
export const SEARCH_EXTRAS: { group: "Pages" | "Props" | "Sections"; label: string; mono?: boolean; context: string; href: string; keywords?: string }[] = [
  { group: "Pages", label: "What happens if a payment fails?", context: "FAQ", href: "/docs/faq#what-happens-if-a-payment-fails", keywords: "refund failed swap" },
  { group: "Props", label: "recipient", mono: true, context: "UniportButton", href: "/docs/uniport-button#props" },
  { group: "Props", label: "destinationToken", mono: true, context: "UniportButton", href: "/docs/uniport-button#props" },
  { group: "Props", label: "label", mono: true, context: "UniportButton", href: "/docs/uniport-button#props" },
  { group: "Props", label: "amount", mono: true, context: "UniportButton", href: "/docs/uniport-button#amount" },
  { group: "Props", label: "refundAddress", mono: true, context: "UniportButton", href: "/docs/uniport-button#refunds" },
  { group: "Props", label: "theme", mono: true, context: "UniportButton", href: "/docs/styling" },
  { group: "Props", label: "variant", mono: true, context: "UniportButton", href: "/docs/styling" },
  { group: "Props", label: "onSuccess", mono: true, context: "UniportButton", href: "/docs/callbacks" },
  { group: "Props", label: "onError", mono: true, context: "UniportButton", href: "/docs/callbacks" },
  { group: "Props", label: "onOpenChange", mono: true, context: "UniportButton", href: "/docs/callbacks" },
  { group: "Sections", label: "Refund address on EVM chains", context: "UniportButton › Props", href: "/docs/uniport-button#refunds" },
  { group: "Sections", label: "Stellar trustlines and refunds", context: "Memo chains", href: "/docs/memo-chains" },
  { group: "Sections", label: "Fixed amounts", context: "UniportButton › Props", href: "/docs/uniport-button#amount" },
  { group: "Sections", label: "Install the SDK", context: "Quickstart", href: "/docs/quickstart#install" },
];
