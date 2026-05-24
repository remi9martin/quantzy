import { Link } from 'react-router-dom';
import { Eyebrow, Lock } from '../components/UI.jsx';

const REPORTS = [
  { cat: 'Macro',     title: 'CPI nowcast deviation regimes',     date: '2026-04-22', tier: 'std',  read: '8m' },
  { cat: 'Macro',     title: 'Fed dot-plot vs market mispricing', date: '2026-04-19', tier: 'apex', read: '14m' },
  { cat: 'NBA',       title: 'Pace-adjusted G5 home advantage',   date: '2026-04-21', tier: 'std',  read: '6m' },
  { cat: 'Crypto',    title: 'ETF flow regimes · post-halving',   date: '2026-04-18', tier: 'apex', read: '17m' },
  { cat: 'Politics',  title: 'Resolution-rule risk in debate mkts', date: '2026-04-17', tier: 'apex', read: '9m' },
  { cat: 'Methodology', title: 'How we score liquidity quality',  date: '2026-04-12', tier: 'std',  read: '7m' },
  { cat: 'AI',        title: 'EU AI Act trilogue cycles',         date: '2026-04-10', tier: 'apex', read: '12m' },
  { cat: 'Sports',    title: 'CLV decay · books vs Quantzy',      date: '2026-04-08', tier: 'std',  read: '11m' },
];

export function Vault() {
  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1600px] mx-auto space-y-5">
      <div>
        <Eyebrow>Intelligence Vault</Eyebrow>
        <h1 className="font-display text-[32px] tracking-tight">Research, models, postmortems.</h1>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {['All','Macro','NBA','Crypto','Politics','AI','Sports','Methodology'].map((c, i) => (
          <button key={c} className={`btn btn-${i === 0 ? 'cerulean' : 'ghost'} btn-sm`}>{c}</button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {REPORTS.map((r, i) => (
          <article key={i} className={`hairline rounded-2xl bg-white p-4 ${r.tier === 'apex' ? 'gold-frame' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="chip cerulean">{r.cat}</span>
              {r.tier === 'apex' ? <span className="chip gold"><Lock /> Apex</span> : <span className="chip">Standard</span>}
            </div>
            <h3 className="font-display text-[18px] mt-2 leading-snug">{r.title}</h3>
            <div className="text-[11px] text-slate2 mt-2">{r.date} · {r.read} read</div>
            <button className="btn btn-ghost btn-sm w-full mt-3">Open report →</button>
          </article>
        ))}
      </div>
    </div>
  );
}
