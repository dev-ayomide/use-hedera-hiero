import AccountLookup from "../components/AccountLookup";
import BalanceDisplay from "../components/BalanceDisplay";
import TopicFeed from "../components/TopicFeed";
import TokenInfo from "../components/TokenInfo";
import TransactionScheduler from "../components/TransactionScheduler";

export default function HomePage() {
  return (
    <main className="shell">
      <header className="masthead">
        <div>
          <h1 className="masthead__title">
            use-<em>hedera</em>
          </h1>
          <p className="masthead__lede">
            A hands-on bench for the hook library—query mirror data, push consensus messages, move HTS units, and
            schedule transfers without drowning in SDK ceremony.
          </p>
        </div>
        <div className="masthead__meta" aria-label="Stack">
          <span className="badge">Testnet-ready</span>
          <span className="badge badge--teal">React 18 · Next 14</span>
        </div>
      </header>

      <section aria-labelledby="section-ledger">
        <h2 id="section-ledger" className="visually-hidden">
          Accounts and tokens
        </h2>
        <div className="bento bento--3">
          <AccountLookup />
          <BalanceDisplay />
          <TokenInfo />
        </div>
      </section>

      <section aria-labelledby="section-write">
        <h2 id="section-write" className="visually-hidden">
          Consensus and schedules
        </h2>
        <div className="bento">
          <TopicFeed />
          <TransactionScheduler />
        </div>
      </section>
    </main>
  );
}
