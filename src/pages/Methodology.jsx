import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo.jsx';
import { Eyebrow } from '../components/UI.jsx';

export function Methodology() {
  return (
    <div className="surface-paper min-h-screen">
      <header className="border-b border-mist">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2"><Logo size={20} /></Link>
          <Link to="/pricing" className="ml-auto text-[13px] text-slate2 hover:text-ink">Pricing</Link>
          <Link to="/app" className="btn btn-primary btn-sm">Enter app</Link>
        </div>
      </header>

      <article className="max-w-[820px] mx-auto px-6 py-12 space-y-8">
        <div>
          <Eyebrow>Methodology</Eyebrow>
          <h1 className="font-display text-[44px] leading-tight tracking-tight mt-2">How Quantzy prices reality.</h1>
          <p className="text-[14px] text-slate2 mt-3">Quantzy runs an event-market intelligence stack: data ingestion across venues, market normalization, a multi-component probability model, calibration audit, social weighting, and a missed-win recovery loop. We publish what we can without giving away the production fingerprint.</p>
        </div>

        <Section title="1 · Data ingestion">
          <p>We ingest order-book snapshots, trade prints, and resolution metadata from Polymarket, Kalshi, PrizePicks, DraftKings, BetOnline, Deribit and a handful of niche venues. All markets are deduplicated via a topic graph and resolution-rule fingerprint.</p>
        </Section>

        <Section title="2 · Probability decomposition">
          <p>For each market we estimate fair probability as the sum of seven components: base rate from analogs, news sentiment, market-flow drift, liquidity stress, expert / catalyst priors, rules-clarity penalty, and time decay. Components are exposed in the inspector.</p>
        </Section>

        <Section title="3 · Confidence bands">
          <p>Each estimate ships with a confidence interval informed by sample size, model variance, and rules risk. Published reliability diagrams show predicted vs. actual resolution rate by band over rolling windows.</p>
        </Section>

        <Section title="4 · Social weighting">
          <p>Top-decile traders by calibration are weighted into a composite conviction score. We measure the lift of "Quantzy + social" vs Quantzy alone and publish the differential. Crowd-only consensus is excluded — participation must be calibrated.</p>
        </Section>

        <Section title="5 · Missed-win loop">
          <p>Every user search, watchlist add, and skip is anonymized and used to retrain the recommendation system. If a market the user touched later moves, it is logged as a missed win and surfaced with diagnostic patterns.</p>
        </Section>

        <Section title="6 · Risk and compliance">
          <p>Quantzy is an intelligence platform. Nothing here is a recommendation to trade. Verify resolution rules and venue compliance in your jurisdiction. Apex tier includes the performance-credit guarantee — see terms.</p>
        </Section>
      </article>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-[26px] tracking-tight mb-2">{title}</h2>
      <div className="text-[14px] text-ink leading-relaxed">{children}</div>
    </section>
  );
}
