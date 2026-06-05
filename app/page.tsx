import Image from "next/image";

const supportedRails = [
  { name: "Ethereum", icon: "/chains/ethereum.svg" },
  { name: "Base", icon: "/chains/base.svg" },
  { name: "Optimism", icon: "/chains/optimism.svg" },
  { name: "Arbitrum", icon: "/chains/arbitrum.svg" },
  { name: "Polygon", icon: "/chains/polygon.svg" },
  { name: "Solana", icon: "/chains/solana.svg" },
  { name: "Sui", icon: "/chains/sui.svg" },
  { name: "NEAR", icon: "/chains/near.svg" },
  { name: "Bitcoin", icon: "/chains/bitcoin.svg" },
  { name: "Avalanche", icon: "/chains/avalanche.svg" },
  { name: "BNB Chain", icon: "/chains/bnb.svg" },
  { name: "Aptos", icon: "/chains/aptos.svg" },
  { name: "TON", icon: "/chains/ton.svg" },
  { name: "Tron", icon: "/chains/tron.svg" },
  { name: "Cardano", icon: "/chains/cardano.svg" },
];

const useCases = [
  "Account funding",
  "Wallet top-ups",
  "DeFi deposits",
  "Marketplace checkout",
  "App onboarding",
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
            <p className="eyebrow">Chain-abstraction deposits</p>
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
                  <span>Solana</span>
                  <span>Base</span>
                  <span>Arbitrum</span>
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

            <div className="sdk-note">
              <code>{`<UniportButton destinationToken="optimismUSDC" />`}</code>
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
          <div className="mini-steps" aria-label="How Uniport works">
            <span>1. App sets destination</span>
            <span>2. User picks source</span>
            <span>3. Uniport returns instructions</span>
            <span>4. App receives settlement</span>
          </div>
        </div>
        <div className="developer-visual">
          <SdkSnippet />
          <div className="integration-results" aria-label="SDK integration outcomes">
            <div>
              <span>Frontend</span>
              <strong>One drop-in button</strong>
            </div>
            <div>
              <span>Backend</span>
              <strong>Hosted quote routing</strong>
            </div>
            <div>
              <span>User flow</span>
              <strong>Deposit instructions returned</strong>
            </div>
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
            <span key={useCase}>{useCase}</span>
          ))}
        </div>
      </section>

      <section className="content-section rail-section" id="rails">
        <div className="rail-copy">
          <p className="eyebrow">Supported rails</p>
          <h2>Built around the chains users already hold assets on.</h2>
          <p>
            Uniport is designed for a multi-chain world: apps can stay focused
            on their destination ecosystem while accepting deposits from
            supported source networks.
          </p>
        </div>
        <div className="chain-cloud">
          {supportedRails.map((chain) => (
            <span className="chain-card" key={chain.name}>
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
        </div>
      </section>

      <section className="content-section final-cta">
        <div>
          <p className="eyebrow">The promise</p>
          <h2>Plug into any ecosystem from anywhere.</h2>
          <p>
            Uniport is a chain-abstraction SDK that lets any crypto app accept
            deposits from any supported chain.
          </p>
        </div>
        <a href="https://demo.uniport.dev" className="primary-action">
          Open demo
        </a>
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
