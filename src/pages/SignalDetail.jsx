import { useParams, Link } from 'react-router-dom';
import { Eyebrow, Chip, PulseDot, Sparkline, EdgeBar, ConfBand, Lock, Arrow } from '../components/UI.jsx';
import { TRADERS, getSignal, SIGNALS } from '../data/markets.js';

export function SignalDetail() {
  const { id } = useParams();
  const s = getSignal(id);
  const related = SIGNALS.filter((x) => x.topic === s.topic && x.id !== s.id).slice(0, 4);

  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="hairline rounded-2xl bg-carbon p-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip">{s.venue}</span>
          <span className="chip cerulean">{s.subtopic}</span>
          {s.tier === 'apex' && <span className="chip gold"><Lock /> Apex</span>}
          <span className="chip">Resolves {s.timeLeft}</span>
          <span className="ml-auto chip cerulean"><PulseDot /> {s.status}</span>
        </div>
        <h1 className="font-display text-[34px] leading-tight mt-2">{s.market}</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          <Box k="Market price" v={`${s.marketPct}¢`} />
          <Box k="Fair value"   v={`${s.fairPct}¢`} c="text-cerulean" />
          <Box k="Edge"         v={`+${s.edgePct}%`} c="text-positive" />
          <Box k="Confidence"   v={`${s.confidence}%`} sub={`${s.confLow}–${s.confHigh}% band`} />
          <Box k="Liquidity"    v={s.liquidity} sub={`${s.volume24} 24h vol`} />
        </div>
        <div className="mt-4">
          <EdgeBar market={s.marketPct} fair={s.fairPct} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button className="btn btn-cerulean">Take real trade</button>
          <button className="btn btn-primary">Paper trade</button>
          <button className="btn btn-ghost">Add alert</button>
          <button className="btn btn-ghost">Follow topic</button>
          <button className="btn btn-ghost">Challenge model</button>
          <button className="btn btn-ghost ml-auto">Share card →</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        {/* LEFT: thesis, decomposition, calibration */}
        <div className="space-y-5">
          <div className="hairline rounded-2xl bg-carbon p-5">
            <div className="flex items-center justify-between">
              <Eyebrow>Thesis</Eyebrow>
              <span className="chip cerulean">Plain English · auditable</span>
            </div>
            <p className="text-[14px] mt-2 leading-relaxed">{s.thesis}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11.5px]">
              <li className="hairline rounded-md p-2 bg-white/5 list-none"><div className="eyebrow">News sentiment</div><div className="font-semibold tnum">+0.62</div></li>
              <li className="hairline rounded-md p-2 bg-white/5 list-none"><div className="eyebrow">Market flow</div><div className="font-semibold tnum">+0.18</div></li>
              <li className="hairline rounded-md p-2 bg-white/5 list-none"><div className="eyebrow">Liquidity stress</div><div className="font-semibold tnum">-0.04</div></li>
            </div>
          </div>

          <div className="hairline rounded-2xl bg-carbon p-5">
            <div className="flex items-center justify-between mb-3">
              <Eyebrow>Probability decomposition</Eyebrow>
              <span className="chip">7 components</span>
            </div>
            <ProbabilityWaterfall fair={s.fairPct} />
          </div>

          <div className="hairline rounded-2xl bg-carbon p-5">
            <Eyebrow>Confidence calibration</Eyebrow>
            <p className="text-[12.5px] text-slate1 mt-1">This signal sits in the <span className="text-white font-semibold">70–80% band</span>. Quantzy signals in this band have historically resolved true <span className="text-positive font-semibold">75.6%</span> of the time across <span className="text-white font-semibold">612 samples</span>.</p>
            <div className="mt-3"><ConfBand value={s.confidence} /></div>
            <div className="grid grid-cols-4 gap-2 mt-3 text-[11.5px]">
              <Box k="Brier" v="0.146" />
              <Box k="Slope" v="0.98" />
              <Box k="Samples" v="612" />
              <Box k="Reliability" v="A+" c="text-positive" />
            </div>
          </div>

          <div className="hairline rounded-2xl bg-carbon p-5">
            <Eyebrow>Invalidation triggers</Eyebrow>
            <ul className="text-[12.5px] mt-2 grid sm:grid-cols-2 gap-2">
              <li className="hairline rounded-md p-2 bg-white/5">Price &gt; 0.62 (model exit)</li>
              <li className="hairline rounded-md p-2 bg-white/5">Liquidity collapse below $400k</li>
              <li className="hairline rounded-md p-2 bg-white/5">Resolution rule challenged</li>
              <li className="hairline rounded-md p-2 bg-white/5">7d implied vol &gt; 80th pct</li>
            </ul>
          </div>
        </div>

        {/* RIGHT: social, related, history */}
        <div className="space-y-5">
          <div className="hairline rounded-2xl bg-carbon p-5">
            <Eyebrow>Social trading overlay</Eyebrow>
            <div className="text-[18px] font-display tnum mt-1">{s.socialConv}% <span className="text-[12px] text-slate1 font-sans">composite conviction</span></div>
            <div className="flex -space-x-1.5 mt-2">
              {TRADERS.slice(0, 6).map((t) => (
                <span key={t.name} title={`@${t.name}`} className="h-7 w-7 rounded-full bg-ink text-white grid place-items-center text-[10px] font-semibold ring-2 ring-carbon">
                  {t.name.slice(0, 2).toUpperCase()}
                </span>
              ))}
            </div>
            <ul className="mt-3 text-[12px] space-y-1.5">
              <li className="flex items-center justify-between"><span>{s.traders.taking} taking</span><span className="text-positive font-semibold">+ Apex avg</span></li>
              <li className="flex items-center justify-between"><span>{s.traders.skipping} skipping</span><span className="text-slate1">— neutral</span></li>
              <li className="flex items-center justify-between"><span>{s.traders.fading} fading</span><span className="text-warn font-semibold">contrarian</span></li>
            </ul>
            <button className="btn btn-ghost btn-sm w-full mt-3">View per-trader thesis</button>
          </div>

          <div className="hairline rounded-2xl bg-carbon p-5">
            <div className="flex items-center justify-between mb-2">
              <Eyebrow>Related signals</Eyebrow>
              <Link to="/app/feed" className="text-[12px] text-cerulean font-semibold inline-flex items-center gap-1">All <Arrow size={12} /></Link>
            </div>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.id} className="hairline rounded-md p-2 bg-white/5">
                  <Link to={`/app/signal/${r.id}`} className="flex items-center gap-2 text-[12px]">
                    <span className="truncate flex-1">{r.market}</span>
                    <span className="chip green">+{r.edgePct}%</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hairline rounded-2xl bg-carbon p-5">
            <Eyebrow>Historical analogs</Eyebrow>
            <div className="mt-2"><Sparkline values={s.spark} width={300} height={48} color="#2563EB" /></div>
            <ul className="mt-2 text-[12px] text-slate1 space-y-1">
              <li>2020 cycle · 13 of 18 similar signals resolved true</li>
              <li>2022 cycle · 9 of 12 resolved true · avg edge captured 8.4%</li>
              <li>2024 prior · 6 of 8 resolved true · avg drawdown 4.1%</li>
            </ul>
          </div>

          <div className="hairline rounded-2xl bg-gradient-to-br from-[#2A2418] to-carbon p-5 gold-frame">
            <Eyebrow className="text-[#7E5E22]">Share card</Eyebrow>
            <div className="text-[12.5px] text-slate1 mt-1">Export a Quantzy-branded card with your call, confidence, and outcome window. Auto-mints to your profile if you take it.</div>
            <button className="btn btn-gold btn-sm w-full mt-3">Export PNG · Twitter / X</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box({ k, v, c = 'text-white', sub }) {
  return (
    <div className="hairline rounded-md p-2.5 bg-white/5">
      <div className="eyebrow">{k}</div>
      <div className={`font-semibold tnum text-[18px] ${c}`}>{v}</div>
      {sub && <div className="text-[10.5px] text-slate1">{sub}</div>}
    </div>
  );
}

function ProbabilityWaterfall({ fair }) {
  const components = [
    { k: 'Base rate',          v: 0.42, c: '#9AA3AE' },
    { k: 'News sentiment',     v: 0.10, c: '#10B981' },
    { k: 'Market movement',    v: 0.05, c: '#10B981' },
    { k: 'Liquidity flow',     v: 0.02, c: '#2563EB' },
    { k: 'Expert consensus',   v: 0.04, c: '#2563EB' },
    { k: 'Rules clarity',      v: -0.02, c: '#E24A4A' },
    { k: 'Time decay',         v: -0.03, c: '#E24A4A' },
  ];
  let cum = 0;
  const W = 600, H = 180, P = 24;
  const x = (i) => P + (i * (W - P * 2)) / components.length;
  const y = (v) => H - 20 - v * 220;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <line x1={P} y1={y(0)} x2={W - P} y2={y(0)} stroke="rgba(255,255,255,0.10)" />
        {components.map((c, i) => {
          const yStart = y(cum);
          cum += c.v;
          const yEnd = y(cum);
          const top = Math.min(yStart, yEnd), bottom = Math.max(yStart, yEnd);
          return (
            <g key={c.k}>
              <rect x={x(i) + 4} y={top} width={(W - P * 2) / components.length - 12} height={Math.max(2, bottom - top)}
                fill={c.c} opacity={0.85} rx="3" />
              <text x={x(i) + ((W - P * 2) / components.length) / 2} y={H - 6} textAnchor="middle" fontSize="9.5" fill="#6B7280">{c.k}</text>
              <text x={x(i) + ((W - P * 2) / components.length) / 2} y={top - 5} textAnchor="middle" fontSize="10" fontWeight="600" fill="#FFFFFF">
                {c.v >= 0 ? '+' : ''}{Math.round(c.v * 100)}
              </text>
            </g>
          );
        })}
        <g>
          <rect x={W - P - 70} y={y(cum) - 18} width="68" height="18" rx="9" fill="#1A1D24" />
          <text x={W - P - 36} y={y(cum) - 5} textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">Fair {fair}%</text>
        </g>
      </svg>
    </div>
  );
}
