import type { ReactNode } from "react";
import { highlight } from "@/lib/highlight";
import { Icon } from "@/components/site/icon";
import { CodeCopyButton } from "@/components/site/copy";

/** Lines of highlighted code in the design's `u-ln` rows. */
export function CodeLines({
  code,
  lang = "tsx",
  lineNumbers = true,
  highlightLines = [],
}: {
  code: string;
  lang?: string;
  lineNumbers?: boolean;
  highlightLines?: number[];
}) {
  return (
    <pre>
      {highlight(code, lang).map((segs, i) => (
        <span key={i} className={`u-ln${highlightLines.includes(i + 1) ? " u-ln-hl" : ""}`}>
          {lineNumbers ? <i>{i + 1}</i> : null}
          {segs.map((s, j) => (s.c ? <span key={j} className={s.c}>{s.t}</span> : s.t))}
        </span>
      ))}
    </pre>
  );
}

/** Raised code panel with a filename bar and a copy button (CodeBlock). */
export function CodeBlock({
  code,
  file,
  lang = "tsx",
  lineNumbers = true,
  highlightLines,
  head,
  className,
  fileIcon = true,
}: {
  code: string;
  file?: string;
  lang?: string;
  lineNumbers?: boolean;
  highlightLines?: number[];
  head?: ReactNode;
  className?: string;
  fileIcon?: boolean;
}) {
  return (
    <div className={`u-code${className ? ` ${className}` : ""}`}>
      {head ?? (
        <div className="u-code-head">
          <span className="u-code-file">
            {file && fileIcon ? <Icon name="file" size="sm" /> : null}
            {file ?? lang}
          </span>
          <CodeCopyButton text={code} />
        </div>
      )}
      <CodeLines code={code} lang={lang} lineNumbers={lineNumbers} highlightLines={highlightLines} />
    </div>
  );
}
