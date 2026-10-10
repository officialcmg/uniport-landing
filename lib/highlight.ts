// Tiny TS/TSX/bash highlighter that emits the design's syntax classes:
// u-k keyword, u-s string, u-t JSX tag, u-a prop name, u-c comment/prompt.

export type Seg = { c: string; t: string };

const KEYWORDS =
  "import|from|export|function|return|const|let|var|async|await|type|interface|default|new|if|else|true|false|null|undefined";

const TSX = new RegExp(
  [
    String.raw`(?<c>\/\/.*$)`,
    String.raw`(?<s>"[^"]*"|'[^']*'|\x60[^\x60]*\x60)`,
    String.raw`(?<t><\/?[A-Za-z][\w.]*|\/>)`,
    String.raw`(?<a>\b[A-Za-z_]\w*(?==["{]))`,
    String.raw`(?<k>\b(?:${KEYWORDS})\b)`,
  ].join("|"),
  "g"
);

function highlightLine(line: string, lang: string): Seg[] {
  if (lang === "bash" || lang === "sh") {
    return line.startsWith("$ ") ? [{ c: "u-c", t: "$ " }, { c: "", t: line.slice(2) }] : [{ c: "", t: line }];
  }
  if (lang === "text") return [{ c: "", t: line }];
  const out: Seg[] = [];
  let last = 0;
  for (const m of line.matchAll(TSX)) {
    const g = m.groups ?? {};
    const cls = g.c ? "u-c" : g.s ? "u-s" : g.t ? "u-t" : g.a ? "u-a" : "u-k";
    if (m.index! > last) out.push({ c: "", t: line.slice(last, m.index) });
    out.push({ c: cls, t: m[0] });
    last = m.index! + m[0].length;
  }
  if (last < line.length) out.push({ c: "", t: line.slice(last) });
  return out;
}

export function highlight(code: string, lang = "tsx"): Seg[][] {
  return code.replace(/\n$/, "").split("\n").map((l) => highlightLine(l, lang));
}
