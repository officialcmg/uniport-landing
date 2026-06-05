const supportedChains = [
  "Ethereum",
  "Base",
  "Arbitrum",
  "Optimism",
  "Polygon",
  "Solana",
  "Sui",
  "NEAR",
  "Bitcoin",
  "Avalanche",
  "BNB Chain",
  "Stellar",
  "Aptos",
  "TON",
  "Tron",
  "Cardano",
];

const codeSample = `import { UniportButton } from "uniport-sdk";

export function CheckoutAction() {
  return (
    <UniportButton
      recipient="0xe7995A5b1B41779DeA900E2204dc08110de363d5"
      destinationToken="baseUSDC"
      label="Pay invoice"
    />
  );
}`;

function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="logo-svg"
      height={size}
      src="/uniport-mark.svg"
      width={size}
    />
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
            <a href="#sdk">SDK</a>
            <a href="#rails">Rails</a>
          </div>
          <a className="nav-cta" href="https://www.npmjs.com/package/uniport-sdk">
            npm package
          </a>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Chain-abstraction SDK</p>
            <h1>
              Accept deposits from any supported chain. Settle exactly where
              your app needs funds.
            </h1>
            <p className="hero-lede">
              Uniport is a chain-abstraction SDK that lets any crypto app accept
              deposits from any supported chain.
            </p>
            <div className="hero-actions">
              <a href="#sdk" className="primary-action">
                See the SDK
              </a>
            </div>
          </div>

          <div className="product-panel" aria-label="Uniport payment flow">
            <div className="flow-header">
              <span>Payment route</span>
              <strong>Invoice #2048</strong>
            </div>
            <div className="route-map">
              <div className="route-node source-node">
                <span>Customer sends</span>
                <strong>USDC on Solana</strong>
              </div>
              <div className="route-line">
                <LogoMark size={106} />
              </div>
              <div className="route-node destination-node">
                <span>App receives</span>
                <strong>USDC on Base</strong>
              </div>
            </div>
            <div className="flow-stats">
              <div>
                <span>Deposit address</span>
                <strong>Generated</strong>
              </div>
              <div>
                <span>Hosted backend</span>
                <strong>Selected</strong>
              </div>
              <div>
                <span>Quote status</span>
                <strong>Ready</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-strip">
        <div className="strip-inner">
          <span>One SDK call</span>
          <span>Any supported source chain</span>
          <span>Destination-token settlement</span>
          <span>Hosted quote orchestration</span>
        </div>
      </section>

      <section className="content-section" id="sdk">
        <div className="section-heading">
          <p className="eyebrow">Builder surface</p>
          <h2>A crypto checkout flow without chain-specific payment logic.</h2>
          <p>
            Uniport gives apps a destination-first payment primitive: choose the
            token your product wants to receive, then let the payer select where
            they are coming from.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-index">01</span>
            <h3>Destination first</h3>
            <p>
              Apps specify the recipient and destination token. Uniport handles
              quote creation, deposit instructions, and status polling.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-index">02</span>
            <h3>Source-chain flexible</h3>
            <p>
              Users can pay from supported networks instead of being forced into
              the chain where the app settles funds.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-index">03</span>
            <h3>Hosted by default</h3>
            <p>
              The SDK talks to Uniport's hosted backend, keeping API-key and
              intent orchestration concerns outside the merchant frontend.
            </p>
          </article>
        </div>

        <div className="code-band">
          <div>
            <p className="eyebrow">Drop-in component</p>
            <h2>From app intent to deposit address.</h2>
            <p>
              The landing page should make the promise feel simple: install the
              SDK, declare the settlement target, and let Uniport route the
              payment.
            </p>
          </div>
          <pre aria-label="Uniport SDK example">
            <code>{codeSample}</code>
          </pre>
        </div>
      </section>

      <section className="content-section muted-section" id="rails">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Supported rails</p>
          <h2>Built for apps that do not want to pick a single chain.</h2>
        </div>
        <div className="chain-cloud">
          {supportedChains.map((chain) => (
            <span key={chain}>{chain}</span>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="architecture">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Architecture</p>
            <h2>Three pieces, one payment outcome.</h2>
          </div>
          <div className="architecture-steps">
            <div>
              <span>App</span>
              <strong>Declares destination token and recipient.</strong>
            </div>
            <div>
              <span>Uniport</span>
              <strong>Quotes the route and returns deposit instructions.</strong>
            </div>
            <div>
              <span>Payer</span>
              <strong>Sends from a supported source chain.</strong>
            </div>
            <div>
              <span>Settlement</span>
              <strong>Funds arrive where the app asked to receive them.</strong>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="brand-lockup">
          <span className="brand-icon">
            <LogoMark size={34} />
          </span>
          <span>Uniport</span>
        </div>
        <p>Chain-abstraction SDK for crypto deposits.</p>
      </footer>
    </main>
  );
}
