import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Icon, type IconName } from "@/components/site/icon";
import { InstallCommand } from "@/components/site/copy";
import { HeroCode } from "@/components/site/hero-code";
import { SiteHeader, Lockup } from "@/components/site/site-header";
import { CHAINS, LINKS, chainIcon } from "@/lib/chains";
import "./landing.css";

/* eslint-disable @next/next/no-img-element */

const WITHOUT = [
  "User opens a separate bridge app or exchange",
  "Manually picks source and destination chains",
  "Waits, then comes back, if they come back at all",
  "Your app has no idea any of this happened",
];
const WITH = [
  "Your app declares what it receives, and where",
  "The user pays from the chain they already hold funds on",
  "One quote, one deposit address, no bridge tab",
  "Funds settle where your app asked for them",
];

const FEATURES = [
  ["01", "Declare the settlement target", "Your app chooses the recipient and destination token, such as USDC on Optimism, Base, or Sui."],
  ["02", "Let the payer choose their source", "Users fund from supported chains instead of being forced to bridge manually before using your app."],
  ["03", "Keep orchestration off the frontend", "Uniport’s hosted backend handles the quote and intent plumbing, so API keys and routing complexity stay out of app clients."],
];

const USES: { icon: IconName; title: string; body: React.ReactNode; label: string }[] = [
  { icon: "wallet", title: "Account funding", body: "Let users top up balances from assets they already hold.", label: "Add funds" },
  { icon: "circlePlus", title: "Wallet top-ups", body: "Give embedded or app wallets a source-chain flexible funding path.", label: "Top up" },
  { icon: "layers", title: "DeFi deposits", body: "Accept liquidity without sending users away to bridge first.", label: "Add liquidity" },
  { icon: "bag", title: "Marketplace checkout", body: "Receive the settlement asset while buyers pay from their chain.", label: "Pay 48.00 USDC" },
  { icon: "login", title: "App onboarding", body: "Turn first deposits into an in-app flow instead of a bridge task.", label: "Fund account" },
  {
    icon: "terminal",
    title: "Something else?",
    body: (
      <>
        If your app needs funds on one chain, it fits.{" "}
        <Link href={LINKS.docs} style={{ color: "var(--brand-text)" }}>
          Start with the quickstart
        </Link>
      </>
    ),
    label: "Deposit",
  },
];

const FAQ = [
  ["Do I need an API key?", "No. The SDK calls Uniport’s hosted backend, which keeps the routing API key server-side. Nothing secret ships in your client."],
  ["Where do funds settle?", "To the recipient address you pass, on the chain and token named by destinationToken. With optimismUSDC, your app receives USDC on Optimism."],
  ["What happens if a payment fails?", "Funds go back to the payer’s refund address on the chain they paid from. The payer enters it in the modal, or you prefill it with the refundAddress prop. With a fixed amount, refunds go to Uniport’s NEAR Intents account instead, and the payer contacts Uniport to get them back."],
  ["Which chains need a memo?", "Stellar. The modal shows the memo right next to the deposit address, with its own copy button."],
  ["What does Uniport cost?", "Uniport takes 0.4% of each deposit. With a fixed amount, Uniport also rounds what the payer sends up to a friendlier number, by at most 0.25%, and keeps the difference."],
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="u-eyebrow">{children}</span>;
}

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteHeader />

      <main id="top">
        <section className="h-hero">
          <div className="u-halo h-obj-halo" aria-hidden="true" />
          <div className="u-container" style={{ position: "relative" }}>
            <div className="h-hero-top">
              <Eyebrow>Deposits from any chain</Eyebrow>
              <h1 className="u-display-1 u-sheen">Let users deposit from anywhere your app does not live.</h1>
            </div>
            <div className="h-hero-grid">
              <div className="h-hero-copy">
                <p className="u-lede">
                  Uniport lets apps receive assets on their home chain while users pay from whatever chain they already use.
                </p>
                <div className="u-row" style={{ gap: 12 }}>
                  <Button asChild variant="primary" size="lg">
                    <a href={LINKS.demo}>Try the demo</a>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href={LINKS.docs}>Read the docs</Link>
                  </Button>
                </div>
                <InstallCommand />
                <div className="h-trust">
                  {["No API key", "MIT licensed", "React 18+"].map((t) => (
                    <span key={t}>
                      <Icon name="check" size="sm" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <HeroCode />
            </div>
            <div className="h-strip">
              <p className="u-small">
                <span style={{ color: "var(--ink-100)", fontWeight: 500 }}>Pay from 32 chains.</span> Settle to the one your
                app lives on.
              </p>
              <div className="h-logos">
                {CHAINS.map((c) => (
                  <img key={c.name} className="u-logo-24" src={chainIcon(c.icon)} alt={c.name} title={c.name} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="u-section" id="why" style={{ paddingTop: 112 }}>
          <div className="u-container h-why">
            <div className="u-sec-head">
              <Eyebrow>The actual problem</Eyebrow>
              <h2 className="u-h1">Your app lives on one chain. Your users’ funds do not.</h2>
              <div className="u-body" style={{ marginTop: 8 }}>
                <p>
                  Most crypto apps still make users bridge before they can deposit, pay, or top up. That creates extra tabs,
                  extra decisions, and a predictable drop-off point before the user reaches your product.
                </p>
                <p>
                  Uniport turns that into an app-native deposit flow. The app says what it wants to receive. The user chooses
                  where they are paying from. Uniport handles the route between those two realities.
                </p>
              </div>
            </div>
            <div className="u-card h-cmp">
              <div>
                <p className="u-h4" style={{ color: "var(--ink-200)" }}>Without Uniport</p>
                <ul>
                  {WITHOUT.map((t) => (
                    <li key={t} style={{ color: "var(--ink-300)" }}>
                      <Icon name="x" size="sm" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="u-h4">With Uniport</p>
                <ul>
                  {WITH.map((t) => (
                    <li key={t} style={{ color: "var(--ink-100)" }}>
                      <Icon name="check" size="sm" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="u-section">
          <div className="u-container">
            <div className="u-sec-head">
              <Eyebrow>What Uniport gives developers</Eyebrow>
              <h2 className="u-h1">A funding primitive, not another generic bridge page.</h2>
            </div>
            <div className="u-grid-3" style={{ marginTop: 48 }}>
              {FEATURES.map(([n, title, body]) => (
                <article key={n} className="u-card u-card-pad h-feat">
                  <span className="u-step-n">{n}</span>
                  <h3 className="u-h3">{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="u-section" id="developers">
          <div className="u-container">
            <div className="u-sec-head">
              <Eyebrow>Integrate</Eyebrow>
              <h2 className="u-h1">One component turns any app action into a cross-chain deposit.</h2>
              <p className="u-lede">
                Account funding, balances, checkout: any flow where your app needs funds on one chain and users arrive with
                assets somewhere else.
              </p>
            </div>
            <div className="h-int" style={{ marginTop: 48 }}>
              <div>
                <ol className="h-int-steps" style={{ marginTop: 0 }}>
                  <li>
                    <span className="h-n">1</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <p className="u-h4">Install the SDK</p>
                      <InstallCommand compact />
                    </div>
                  </li>
                  <li>
                    <span className="h-n">2</span>
                    <div>
                      <p className="u-h4">
                        Render <span className="u-inline-code">UniportButton</span> with three props
                      </p>
                      <p className="u-small" style={{ marginTop: 4 }}>Where funds land, in what token, and what the button says.</p>
                    </div>
                  </li>
                  <li>
                    <span className="h-n">3</span>
                    <div>
                      <p className="u-h4">Ship it</p>
                      <p className="u-small" style={{ marginTop: 4 }}>
                        Your users pick a chain, get an exact quote, and pay. No backend of your own, no API key.
                      </p>
                    </div>
                  </li>
                </ol>
                <Button asChild variant="secondary" size="md" style={{ marginTop: 36 }}>
                  <Link href={LINKS.docs}>
                    Read the quickstart
                    <Icon name="arrowRight" size="sm" />
                  </Link>
                </Button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="u-table-wrap">
                  <table className="u-table u-table-stack">
                    <thead>
                      <tr>
                        <th>Prop</th>
                        <th>What it does</th>
                        <th>Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <span className="u-mono" style={{ fontSize: 13 }}>recipient</span>{" "}
                          <Badge square style={{ marginLeft: 6 }}>required</Badge>
                        </td>
                        <td>Your address on the destination chain. Funds settle here.</td>
                        <td className="u-mono" style={{ fontSize: 13, color: "var(--syn-s)" }}>&quot;0x71C9…4e2B&quot;</td>
                      </tr>
                      <tr>
                        <td>
                          <span className="u-mono" style={{ fontSize: 13 }}>destinationToken</span>{" "}
                          <Badge square style={{ marginLeft: 6 }}>required</Badge>
                        </td>
                        <td>
                          The token and chain your app receives, named <span className="u-inline-code">{"{chain}{SYMBOL}"}</span>.
                        </td>
                        <td className="u-mono" style={{ fontSize: 13, color: "var(--syn-s)" }}>&quot;optimismUSDC&quot;</td>
                      </tr>
                      <tr>
                        <td>
                          <span className="u-mono" style={{ fontSize: 13 }}>label</span>
                        </td>
                        <td>The button text your users see.</td>
                        <td className="u-mono" style={{ fontSize: 13, color: "var(--syn-s)" }}>&quot;Deposit&quot;</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="u-small" style={{ color: "var(--ink-300)" }}>
                  Nine more optional props cover a fixed amount, a prefilled refund address, the modal theme and the{" "}
                  <span className="u-inline-code">onSuccess</span> / <span className="u-inline-code">onError</span> callbacks.{" "}
                  <Link href={LINKS.props} style={{ color: "var(--brand-text)" }}>
                    All props
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="u-section" id="how">
          <div className="u-container">
            <div className="u-sec-head">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="u-h1">Four steps between your users’ chain and yours.</h2>
            </div>
            <ol className="h-how" style={{ marginTop: 48 }}>
              <li>
                <div className="h-mini">
                  <span className="u-caption">Your app sets</span>
                  <span className="u-mono" style={{ fontSize: 13 }}>
                    <span className="u-a">destinationToken</span>=<span className="u-s">&quot;optimismUSDC&quot;</span>
                  </span>
                </div>
                <span className="u-step-n">01</span>
                <p className="u-h4">Set destination</p>
                <p className="u-small">Your app chooses the token, chain, and recipient.</p>
              </li>
              <li>
                <div className="h-mini">
                  <span className="u-caption">Pay from</span>
                  <div className="u-chips" style={{ flexWrap: "nowrap" }}>
                    <span className="u-chip u-chip-on"><img src={chainIcon("ethereum")} alt="" />Ethereum</span>
                    <span className="u-chip"><img src={chainIcon("solana")} alt="" />Solana</span>
                    <span className="u-chip u-chip-more">+22</span>
                  </div>
                </div>
                <span className="u-step-n">02</span>
                <p className="u-h4">User picks source</p>
                <p className="u-small">The payer chooses where their assets are coming from.</p>
              </li>
              <li>
                <div className="h-mini">
                  <span className="u-caption">Send exactly</span>
                  <span className="u-num" style={{ fontSize: 24, lineHeight: "28px", fontWeight: 600, letterSpacing: "-0.02em" }}>
                    1,251.84 <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-200)" }}>USDC</span>
                  </span>
                  <span className="u-addr">on Ethereum, to 0x8f3a…c21e</span>
                </div>
                <span className="u-step-n">03</span>
                <p className="u-h4">Quote returns</p>
                <p className="u-small">Uniport gives an exact amount and deposit instructions.</p>
              </li>
              <li>
                <div className="h-mini">
                  <span className="u-caption" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    Your app receives
                    <Badge variant="success" dot>Settled</Badge>
                  </span>
                  <span className="u-num" style={{ fontSize: 24, lineHeight: "28px", fontWeight: 600, letterSpacing: "-0.02em" }}>
                    1,250.00 <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-200)" }}>USDC</span>
                  </span>
                  <span className="u-addr">on Optimism, to 0x71C9…4e2B</span>
                </div>
                <span className="u-step-n">04</span>
                <p className="u-h4">App receives</p>
                <p className="u-small">Funds settle where the app asked to receive them.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="u-section" id="use-cases">
          <div className="u-container">
            <div className="u-sec-head">
              <Eyebrow>Where it fits</Eyebrow>
              <h2 className="u-h1">For apps that need deposits, not users lost in bridge tabs.</h2>
            </div>
            <div className="h-uses" style={{ marginTop: 48 }}>
              {USES.map((u) => (
                <div key={u.title}>
                  <Icon name={u.icon} />
                  <p className="u-h4">{u.title}</p>
                  <p className="u-small">{u.body}</p>
                  <span className="h-lbl">
                    label=<b>&quot;{u.label}&quot;</b>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="u-section" id="chains">
          <div className="u-container">
            <div className="u-sec-head">
              <Eyebrow>Supported chains</Eyebrow>
              <h2 className="u-h1">Built around the chains users already hold assets on.</h2>
              <p className="u-lede">
                Apps stay focused on their destination ecosystem while accepting deposits from every supported source network.
              </p>
            </div>
            <div className="h-chains">
              {CHAINS.map((c) => (
                <span key={c.name} className="u-chip">
                  <img src={chainIcon(c.icon)} alt="" />
                  {c.name}
                </span>
              ))}
            </div>
            <div className="u-card h-tokens">
              <p className="u-amount">
                82<small>destination tokens</small>
              </p>
              <p className="u-small">
                Name any of them as <span className="u-inline-code">destinationToken</span>:{" "}
                <span className="u-inline-code">optimismUSDC</span>, <span className="u-inline-code">baseETH</span>,{" "}
                <span className="u-inline-code">solanaSOL</span>, <span className="u-inline-code">bitcoinBTC</span>.
              </p>
              <Button asChild variant="secondary" size="md">
                <Link href={LINKS.tokens}>
                  See every token
                  <Icon name="arrowRight" size="sm" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="u-section" id="faq">
          <div className="u-container h-faq">
            <div className="u-sec-head">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="u-h1">What developers ask first.</h2>
            </div>
            <Accordion type="single" collapsible defaultValue="0">
              {FAQ.map(([q, a], i) => (
                <AccordionItem key={q} value={String(i)}>
                  <AccordionTrigger>{q}</AccordionTrigger>
                  <AccordionContent>{a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="u-section">
          <div className="u-container">
            <div className="h-close">
              <div className="u-halo" aria-hidden="true" style={{ left: "-10%", bottom: "-60%", width: 640, height: 640, opacity: 0.7 }} />
              <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 20 }}>
                <Eyebrow>Launch with Uniport</Eyebrow>
                <h2 className="u-display-2">Plug into any ecosystem from anywhere.</h2>
                <p className="u-lede">
                  Uniport is a chain-abstraction SDK that lets any crypto app accept deposits from any supported chain.
                </p>
                <div className="u-row" style={{ gap: 12, marginTop: 8 }}>
                  <Button asChild variant="primary" size="lg">
                    <a href={LINKS.demo}>Open demo</a>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href={LINKS.docs}>Read the docs</Link>
                  </Button>
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <div className="h-stat">
                  <span className="u-caption">Accept from</span>
                  <span className="u-h2 u-num">32 chains</span>
                </div>
                <div className="h-stat">
                  <span className="u-caption">Settle to</span>
                  <span className="u-h2">Your home chain</span>
                </div>
                <div className="h-stat" style={{ borderBottom: "1px solid var(--line-100)" }}>
                  <span className="u-caption">Integration</span>
                  <span className="u-h2">One component</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="u-container">
      <div className="h-foot">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ alignSelf: "flex-start" }}>
            <Lockup />
          </div>
          <p className="u-small" style={{ maxWidth: 280 }}>Chain-abstraction SDK for crypto app deposits.</p>
          <p className="u-caption u-mono">uniport-sdk 0.0.7 · MIT</p>
        </div>
        <div>
          <h4>Product</h4>
          <ul>
            <li><a href={LINKS.demo}>Demo</a></li>
            <li><Link href="/#how">How it works</Link></li>
            <li><Link href="/#chains">Supported chains</Link></li>
          </ul>
        </div>
        <div>
          <h4>Developers</h4>
          <ul>
            <li><Link href={LINKS.docs}>Docs</Link></li>
            <li><a href={LINKS.npm}>npm</a></li>
            <li><a href={LINKS.github}>GitHub</a></li>
          </ul>
        </div>
        <div>
          <h4>Resources</h4>
          <ul>
            <li><Link href={LINKS.tokens}>Token list</Link></li>
            <li><Link href="/#faq">FAQ</Link></li>
            <li><a href="/llms.txt">llms.txt</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
