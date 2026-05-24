import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Lock } from '../components/UI.jsx';
import { Logo, QBadge } from '../components/Logo.jsx';

const FEATURES = [
  { k: 'Live scanner',                  obs: false, std: true,  apex: true },
  { k: 'Edge feed (live)',              obs: 'Delayed', std: true, apex: true },
  { k: 'Confidence / edge filters',     obs: false, std: true,  apex: true },
  { k: 'Alerts',                         obs: '1 rule', std: 'Unlimited', apex: 'Priority' },
  { k: 'Saved scans',                    obs: 3, std: 'Unlimited', apex: 'Unlimited' },
  { k: 'Historical calibration',         obs: 'Summary', std: true, apex: true },
  { k: 'Watchlists / paper trading',     obs: false, std: true, apex: true },
  { k: 'Social following',               obs: 'Public', std: true, apex: true },
  { k: 'Premium high-edge signals',      obs: false, std: false, apex: true },
  { k: 'Apex mind-map branches',         obs: false, std: false, apex: true },
  { k: 'Top-trader overlays',            obs: false, std: 'Limited', apex: 'Full' },
  { k: 'Missed-win diagnostics',         obs: false, std: 'Basic', apex: 'Pattern AI' },
  { k: 'Intelligence Vault',             obs: false, std: false, apex: true },
  { k: 'Team access · captain perks',    obs: false, std: 'Member', apex: 'Captain' },
  { k: 'Performance-credit guarantee',   obs: false, std: false, apex: true },
];

export function Tiers({ public: isPublic }) {
  const [annual, setAnnual] = useState(false);
  const m = annual ? 0.83 : 1; // 17% off annual
  return (
    <div className={isPublic ? 'min-h-screen surface-paper' : ''}>
      {isPublic && (
        <header className="border-b border-mist">
          <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2"><Logo size={20} /></Link>
            <Link to="/methodology" className="ml-auto text-[13px] text-slate2 hover:text-ink">Methodology</Link>
            <Link to="/app" className="btn btn-primary btn-sm">Enter app</Link>
          </div>
        </header>
      )}

      <div className="px-4 lg:px-6 py-10 max-w-[1280px] mx-auto space-y-8">
        <div className="text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="font-display text-[44px] leading-tight tracking-tight mt-2">Choose your access tier.</h1>
          <p className="text-[14px] text-slate2 mt-2 max-w-[60ch] mx-auto">No picks-as-a-service. You pay for the intelligence layer — model, calibration, social refinement, and the missed-win recovery loop.</p>
          <div className="inline-flex hairline rounded-full p-0.5 bg-platinum mt-5">
            <button onClick={() => setAnnual(false)} className={`px-3 h-8 rounded-full text-[12px] font-semibold ${!annual ? 'bg-white shadow-card' : 'text-slate2'}`}>Monthly</button>
            <button onClick={() => setAnnual(true)}  className={`px-3 h-8 rounded-full text-[12px] font-semibold ${annual ? 'bg-white shadow-card' : 'text-slate2'}`}>Annual <span className="chip green ml-1">-17%</span></button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Tier name="Observer"           price="0"        m={m} desc="Public proof feed, delayed signals, basic search." cta="Browse" />
          <Tier name="Intelligence Pro"   price={99 * m}   highlight desc="Live scanner, social, calibration, alerts, paper trading." cta="Start trial" />
          <Tier name="Apex Elite"         price={250 * m}  gold     desc="Premium branches, vault, top-trader overlays, captain perks." cta="Apply" />
        </div>

        <div className="hairline rounded-2xl bg-white">
          <div className="p-4 border-b border-mist flex items-center justify-between">
            <Eyebrow>Comparison</Eyebrow>
            <span className="text-[11px] text-slate2">All plans include venue normalization across Polymarket, Kalshi, Sports & Crypto.</span>
          </div>
          <table className="w-full text-[12.5px]">
            <thead className="text-slate2">
              <tr><th className="py-2 px-4 text-left">Feature</th><th>Observer</th><th>Pro</th><th className="pr-4">Apex</th></tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.k} className="border-t border-mist">
                  <td className="py-2 px-4">{f.k}</td>
                  <Cell v={f.obs} /><Cell v={f.std} /><Cell v={f.apex} pr />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="hairline rounded-2xl bg-gradient-to-br from-[#fffaee] to-white p-5 gold-frame">
          <div className="flex items-center gap-2"><QBadge size={22} /><Eyebrow className="text-[#7E5E22]">Performance-credit guarantee</Eyebrow></div>
          <p className="text-[13px] mt-2 max-w-[80ch]">If your eligible Apex-tracked signals do not generate enough paper-tracked edge to cover your upgrade in 60 days, we credit the difference back to your subscription. Stake/risk parameters apply.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <Teaser t="Standard" desc="3 unlocked branches in your niches today" edge="+8.2%" lock={false} />
          <Teaser t="Apex"    desc="3 premium branches hidden in your niches"    edge="+14.2%" lock />
          <Teaser t="Apex"    desc="High-confidence macro alpha · CPI window"    edge="+11.0%" lock />
        </div>
      </div>
    </div>
  );
}

function Tier({ name, price, m = 1, highlight, gold, desc, cta }) {
  const isFree = name.toLowerCase() === 'observer';
  return (
    <div className={`hairline rounded-2xl p-5 ${highlight ? 'shadow-lift bg-gradient-to-br from-cerulean/8 to-white' : ''} ${gold ? 'gold-frame bg-gradient-to-br from-[#fffaee] to-white' : 'bg-white'}`}>
      <div className="flex items-center justify-between">
        <Eyebrow>{name}</Eyebrow>
        {gold && <span className="chip gold">Apex</span>}
        {highlight && <span className="chip cerulean">Most popular</span>}
      </div>
      <div className="font-display text-[44px] tracking-tight mt-2 tnum">
        {isFree ? 'Free' : <>${typeof price === 'number' ? Math.round(price) : price}<span className="text-[16px] text-slate2 font-sans">/mo</span></>}
      </div>
      <p className="text-[13px] text-slate2 mt-2">{desc}</p>
      <button className={`btn ${gold ? 'btn-gold' : highlight ? 'btn-cerulean' : 'btn-primary'} w-full mt-4`}>{cta}</button>
    </div>
  );
}

function Cell({ v, pr }) {
  let body;
  if (v === true) body = <span className="text-positive">●</span>;
  else if (v === false) body = <span className="text-haze">—</span>;
  else body = <span className="text-ink">{v}</span>;
  return <td className={`py-2 ${pr ? 'pr-4' : ''} text-center text-[12.5px]`}>{body}</td>;
}

function Teaser({ t, desc, edge, lock }) {
  return (
    <div className={`hairline rounded-2xl bg-white p-4 ${lock ? 'gold-frame' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`chip ${t === 'Apex' ? 'gold' : 'cerulean'}`}>{t}</span>
        {lock && <span className="chip"><Lock /> Locked</span>}
      </div>
      <div className="text-[13.5px] font-semibold mt-1.5">{desc}</div>
      <div className="text-[18px] font-display text-positive tnum mt-1">{edge}</div>
      <Link to="/app/scanner" className="btn btn-ghost btn-sm w-full mt-2">Preview</Link>
    </div>
  );
}
