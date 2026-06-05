import Image from "next/image";

const supportedChains = [
  { name: "Ethereum", icon: "/chains/ethereum.png" },
  { name: "Base", icon: "/chains/base.png" },
  { name: "Optimism", icon: "/chains/optimism.png" },
  { name: "Arbitrum", icon: "/chains/arbitrum.png" },
  { name: "Polygon", icon: "/chains/polygon.png" },
  { name: "Solana", icon: "/chains/solana.png" },
  { name: "Sui", icon: "/chains/sui.png" },
  { name: "NEAR", icon: "/chains/near.png" },
  { name: "Bitcoin", icon: "/chains/bitcoin.png" },
  { name: "Avalanche", icon: "/chains/avalanche.png" },
  { name: "BNB Chain", icon: "/chains/bnb.png" },
  { name: "Aptos", icon: "/chains/aptos.png" },
  { name: "TON", icon: "/chains/ton.png" },
  { name: "Tron", icon: "/chains/tron.png" },
];

const useCases = [
  {
    title: "Account funding",
    description: "Let users top up balances from assets they already hold.",
  },
  {
    title: "Wallet top-ups",
    description: "Give embedded or app wallets a source-chain flexible funding path.",
  },
  {
    title: "DeFi deposits",
    description: "Accept liquidity without sending users away to bridge first.",
  },
  {
    title: "Marketplace checkout",
    description: "Receive the settlement asset while buyers pay from their chain.",
  },
  {
    title: "App onboarding",
    description: "Turn first deposits into an in-app flow instead of a bridge task.",
  },
];

function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className="logo-svg"
      height={size}
      src="/uniport-mark.svg"
      width={size}
    />
  );
}

function CodeLine({
  children,
  number,
}: {
  children?: React.ReactNode;
  number: string;
}) {
  return (
    <li className="code-line">
      <span className="line-number">{number}</span>
      <span className="line-code">{children}</span>
    </li>
  );
}

function SdkSnippet() {
  return (
    <div className="code-window" aria-label="Uniport SDK example">
      <div className="code-window-bar">
        <div className="window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="file-name">DepositAction.tsx</span>
      </div>
      <ol className="code-block">
        <CodeLine number="1">
          <span className="tok-keyword">import</span>{" "}
          <span className="tok-brace">{"{"}</span>{" "}
          <span className="tok-component">UniportButton</span>{" "}
          <span className="tok-brace">{"}"}</span>{" "}
          <span className="tok-keyword">from</span>{" "}
          <span className="tok-string">&quot;uniport-sdk&quot;</span>
          <span className="tok-muted">;</span>
        </CodeLine>
        <CodeLine number="2" />
        <CodeLine number="3">
          <span className="tok-keyword">export function</span>{" "}
          <span className="tok-function">DepositAction</span>
          <span className="tok-muted">() {"{"}</span>
        </CodeLine>
        <CodeLine number="4">
          <span className="indent">{"  "}</span>
          <span className="tok-keyword">return</span>{" "}
          <span className="tok-muted">(</span>
        </CodeLine>
        <CodeLine number="5">
          <span className="indent">{"    "}</span>
          <span className="tok-tag">&lt;UniportButton</span>
        </CodeLine>
        <CodeLine number="6">
          <span className="indent">{"      "}</span>
          <span className="tok-prop">recipient</span>
          <span className="tok-muted">=</span>
          <span className="tok-string">&quot;0x...&quot;</span>
        </CodeLine>
        <CodeLine number="7">
          <span className="indent">{"      "}</span>
          <span className="tok-prop">destinationToken</span>
          <span className="tok-muted">=</span>
          <span className="tok-string">&quot;optimismUSDC&quot;</span>
        </CodeLine>
        <CodeLine number="8">
          <span className="indent">{"      "}</span>
          <span className="tok-prop">label</span>
          <span className="tok-muted">=</span>
          <span className="tok-string">&quot;Deposit&quot;</span>
        </CodeLine>
        <CodeLine number="9">
          <span className="indent">{"    "}</span>
          <span className="tok-tag">/&gt;</span>
        </CodeLine>
        <CodeLine number="10">
          <span className="indent">{"  "}</span>
          <span className="tok-muted">);</span>
        </CodeLine>
        <CodeLine number="11">
          <span className="tok-muted">{"}"}</span>
        </CodeLine>
      </ol>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main>
      <section className="hero-section">
        <nav className="top-nav" aria-label="Primary navigation">
          <a className="brand-lockup" href="#top" aria-label="Uniport home">
            <span className="brand-icon">
              <LogoMark size={34} />
            </span>
            <span>Uniport</span>
          </a>
          <div className="nav-links">
            <a href="#why">Why Uniport</a>
            <a href="#use-cases">Use cases</a>
            <a href="#developers">Developers</a>
          </div>
          <a className="nav-cta" href="https://demo.uniport.dev">
            Launch demo
          </a>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Deposits from any chain</p>
            <h1>Let users deposit from anywhere your app does not live.</h1>
            <p className="hero-lede">
              Uniport lets apps receive assets on their home chain while users
              pay from whatever chain they already use.
            </p>
            <p className="hero-subcopy">
              Install one SDK component, set the destination token and
              recipient, and give users a deposit flow that handles quote
              creation, exact payment instructions, and settlement routing.
            </p>
            <div className="hero-actions">
              <a href="https://demo.uniport.dev" className="primary-action">
                Try the demo
              </a>
              <a
                href="https://www.npmjs.com/package/uniport-sdk"
                className="secondary-action"
              >
                Install SDK
              </a>
            </div>
          </div>

          <div className="product-panel" aria-label="Uniport deposit flow">
            <div className="receive-card">
              <div>
                <span className="card-label">Your app receives</span>
                <strong>USDC on Optimism</strong>
              </div>
              <span className="ready-pill">Ready quote</span>
            </div>

            <div className="flow-visual">
              <div className="wallet-card">
                <span className="card-label">User pays from</span>
                <div className="source-list">
                  <span>Ethereum</span>
                  <span>Bitcoin</span>
                  <span>Solana</span>
                  <span>+19 more</span>
                </div>
              </div>

              <div className="route-bridge" aria-hidden="true">
                <LogoMark size={58} />
                <span />
              </div>

              <div className="instruction-card">
                <span className="card-label">Deposit instruction</span>
                <strong>Send exactly 1 USDC</strong>
                <p>Funds settle to the app&apos;s Optimism address.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="content-section split-section" id="why">
        <div className="section-heading">
          <p className="eyebrow">The actual problem</p>
          <h2>Your app lives on one chain. Your users&apos; funds do not.</h2>
        </div>
        <div className="problem-copy">
          <p>
            Most crypto apps still make users bridge before they can deposit,
            pay, or top up. That creates extra tabs, extra decisions, and a
            predictable drop-off point before the user reaches your product.
          </p>
          <p>
            Uniport turns that into an app-native deposit flow. The app says
            what it wants to receive. The user chooses where they are paying
            from. Uniport handles the route between those two realities.
          </p>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading wide-heading">
          <p className="eyebrow">What Uniport gives developers</p>
          <h2>A funding primitive, not another generic bridge page.</h2>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-index">01</span>
            <h3>Declare the settlement target</h3>
            <p>
              Your app chooses the recipient and destination token, such as USDC
              on Optimism, Base, or Sui.
            </p>
          </article>
          <article className="feature-card dark-card">
            <span className="feature-index">02</span>
            <h3>Let the payer choose their source</h3>
            <p>
              Users can fund from supported chains instead of being forced to
              bridge manually before using your app.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-index">03</span>
            <h3>Keep orchestration off the frontend</h3>
            <p>
              Uniport&apos;s hosted backend handles the quote and intent plumbing so
              API keys and routing complexity stay out of app clients.
            </p>
          </article>
        </div>
      </section>

      <section className="content-section code-section" id="developers">
        <div className="code-narrative">
          <p className="eyebrow">SDK surface</p>
          <h2>One component turns any app action into a cross-chain deposit.</h2>
          <p>
            Use it for account funding, balances, checkout, deposits, and any
            flow where your app needs funds on a specific chain but users arrive
            with assets somewhere else.
          </p>
        </div>
        <div className="developer-visual">
          <SdkSnippet />
          <div className="developer-flow-grid" aria-label="How Uniport works">
            <article>
              <span>01</span>
              <strong>Set destination</strong>
              <p>Your app chooses the token, chain, and recipient.</p>
            </article>
            <article>
              <span>02</span>
              <strong>User picks source</strong>
              <p>The payer chooses where their assets are coming from.</p>
            </article>
            <article>
              <span>03</span>
              <strong>Quote returns</strong>
              <p>Uniport gives exact amount and deposit instructions.</p>
            </article>
            <article>
              <span>04</span>
              <strong>App receives</strong>
              <p>Funds settle where the app asked to receive them.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section muted-section" id="use-cases">
        <div className="section-heading wide-heading">
          <p className="eyebrow">Where it fits</p>
          <h2>For apps that need deposits, not users lost in bridge tabs.</h2>
        </div>
        <div className="use-case-grid">
          {useCases.map((useCase) => (
            <article key={useCase.title}>
              <span aria-hidden="true">+</span>
              <h3>{useCase.title}</h3>
              <p>{useCase.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section chain-section" id="chains">
        <div className="chain-copy">
          <p className="eyebrow">Supported chains</p>
          <h2>Built around the chains users already hold assets on.</h2>
          <p>
            Uniport is designed for a multi-chain world: apps can stay focused
            on their destination ecosystem while accepting deposits from
            supported source networks.
          </p>
        </div>
        <div className="chain-cloud">
          {supportedChains.map((chain) => (
            <span
              aria-label={chain.name}
              className="chain-card"
              key={chain.name}
              title={chain.name}
            >
              <Image
                alt=""
                aria-hidden="true"
                className="chain-icon"
                height={34}
                src={chain.icon}
                width={34}
              />
              <span>{chain.name}</span>
            </span>
          ))}
          <span
            aria-label="More supported chains"
            className="chain-card chain-card-more"
            title="More supported chains"
          >
            <span className="more-icon" aria-hidden="true">+</span>
            <span>More chains</span>
          </span>
        </div>
      </section>

      <section className="content-section final-cta">
        <div>
          <p className="eyebrow">Launch with Uniport</p>
          <h2>Plug into any ecosystem from anywhere.</h2>
          <p>
            Uniport is a chain-abstraction SDK that lets any crypto app accept
            deposits from any supported chain.
          </p>
        </div>
        <div className="cta-panel">
          <div>
            <span>Accept from</span>
            <strong>20+ chains</strong>
          </div>
          <div>
            <span>Settle to</span>
            <strong>Your home chain</strong>
          </div>
          <a href="https://demo.uniport.dev" className="primary-action">
            Open demo
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="brand-lockup">
          <span className="brand-icon">
            <LogoMark size={34} />
          </span>
          <span>Uniport</span>
        </div>
        <p>Chain-abstraction SDK for crypto app deposits.</p>
      </footer>
    </main>
  );
}
