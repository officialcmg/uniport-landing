import fs from "node:fs/promises";
import path from "node:path";
import { DOC_GROUPS, DOC_PAGES } from "@/lib/docs-nav";

export const dynamic = "force-static";

// llms.txt: an index of the docs for coding agents, followed by the full Markdown of each page.
export async function GET() {
  const base = "https://uniport.dev";
  const index = DOC_GROUPS.map(
    (g) =>
      `## ${g}\n\n` +
      DOC_PAGES.filter((p) => p.group === g)
        .map((p) => `- [${p.title}](${base}/docs/${p.slug}): ${p.description}`)
        .join("\n")
  ).join("\n\n");

  const pages = await Promise.all(
    DOC_PAGES.map(async (p) => {
      const mdx = await fs.readFile(path.join(process.cwd(), "content/docs", `${p.slug}.mdx`), "utf8");
      const body = mdx.replace(/^export const meta = \{[\s\S]*?\n\}\n/, "").trim();
      return `# ${p.title}\n\nSource: ${base}/docs/${p.slug}\n\n${body}`;
    })
  );

  const text = `# Uniport

> Uniport is a chain-abstraction SDK. Apps receive funds on their home chain while users pay from any of 24 chains. One React component, \`UniportButton\` from \`uniport-sdk\`; no API key.

The whole integration:

\`\`\`tsx
import { UniportButton } from "uniport-sdk";

export function DepositAction() {
  return (
    <UniportButton
      recipient="0x..."
      destinationToken="optimismUSDC"
      label="Deposit"
    />
  );
}
\`\`\`

${index}

---

${pages.join("\n\n---\n\n")}
`;
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
