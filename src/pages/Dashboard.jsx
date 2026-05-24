import { Link } from 'react-router-dom';
import { Eyebrow, Chip, PulseDot, Sparkline, EdgeBar, ConfBand, MiniGauge, Tabs, Lock, Arrow } from '../components/UI.jsx';
import { MascotMark } from '../components/Mascot.jsx';
import { QBadge } from '../components/Logo.jsx';
import { SIGNALS, CATALYSTS, MISSED, CATEGORIES, TRADERS } from '../data/markets.js';
import { useMemo, useState } from 'react';

/* -------------------------------------------------------------------------- */
/* KPI strip with sparkline trend chips                                       */
/* -------------------------------------------------------------------------- */

function Kpi({ label, value, delta, tone = 'ink', spark, sub }) {
  const c = tone === 'positive' ? 'text-positive' : tone === 'negative' ? 'text-negative' : tone === 'cerulean' ? 'text-cerulean' : tone === 'gold' ? 'text-[#7E5E22]' : 'text-ink';
  const sc = tone === 'positive' ? '#10B981' : tone === 'negative' ? '#E24A4A' : tone === 'gold' ? '#C9A24B' : '#2563EB';
  return (
    <div className="hairline rounded-xl bg-white p-3.5 hover:shadow-card transition relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="eyebrow">{label}</div>
        {delta && (
          <span className={`text-[10.5px] tnum font-semibold ${delta.startsWith('-') ? 'text-negative' : 'text-positive'}`}>{delta}</span>
        )}
      </div>
      <div className={`mt-1 text-[22px] font-semibold tnum ${c}`}>{value}</div>
      {sub && <div className="text-[11px] text-slate2">{sub}</div>}
      {spark && (
        <div className="mt-1.5 -mx-1">
          <Sparkline values={spark} width={220} height={26} color={sc} />
        </div>
      )}
    </div>
  );
}

function KpiStrip() {
  const k = [
    { label: 'Active edge',         value: '+7.38%', delta: '+0.6 pp',  tone: 'positive', spark: [3.2,3.4,3.8,4.1,4.6,5.2,5.5,6.0,6.4,6.8,7.0,7.1,7.2,7.3,7.4] },
    { label: 'Calibrated hit rate', value: '78.3%',  delta: '+1.4 pp', tone: 'cerulean', spark: [72,73,73,74,75,75,76,76,77,77,78,78,78,78,78] },
    { label: 'Open opportunities',  value: '23',     delta: '+4',       tone: 'ink',      spark: [12,14,15,16,18,19,19,20,21,22,22,22,23,23,23] },
    { label: 'Markets monitored',   value: '2,841',  sub: 'Polymarket · Kalshi · Sports · Crypto', tone: 'ink',  spark: [2400,2420,2480,2520,2580,2620,2680,2710,2740,2780,2810,2820,2830,2835,2841] },
    { label: 'Missed wins · 30d',   value: '6',      delta: '-2',       tone: 'gold',     spark: [11,10,10,9,9,8,8,8,7,7,6,6,6,6,6] },
    { label: 'League rank',         value: 'Silver II', sub: '#412 · +42 this week', tone: 'cerulean' },
  ];
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
      {k.map((x) => <Kpi key={x.label} {...x} />)}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Priority rail · top 3 to act on now                                        */
/* -------------------------------------------------------------------------- */

function PriorityRail() {
  const top = SIGNALS.slice(0, 3);
  return (
    <div className="hairline rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eyebrow>Priority · act now</Eyebrow>
          <span className="chip cerulean"><PulseDot /> Live</span>
        </div>
        <Link to="/app/feed" className="text-[12px] text-cerulean font-semibold inline-flex items-center gap-1">All edges <Arrow size={12} /></Link>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {top.map((s, i) => (
          <Link to={`/app/signal/${s.id}`} key={s.id} className={`block hairline rounded-xl p-3.5 hover:shadow-lift transition ${s.tier === 'apex' ? 'gold-frame' : ''} relative overflow-hidden`}>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: i === 0 ? '#10B981' : i === 1 ? '#2563EB' : '#C9A24B' }} />
            <div className="flex items-center justify-between">
              <span className="chip">#{i + 1} priority</span>
              <span className={`chip ${s.status === 'NEW' ? 'green' : s.status === 'MOVING' ? 'cerulean' : 'gold'}`}>{s.status}</span>
            </div>
            <div className="mt-2 text-[13.5px] font-semibold leading-tight">{s.market}</div>
            <div className="mt-2"><EdgeBar market={s.marketPct} fair={s.fairPct} /></div>
            <div className="mt-2 grid grid-cols-4 gap-1 text-[11px]">
              <div><div className="eyebrow">Edge</div><div className="text-positive font-semibold tnum">+{s.edgePct}%</div></div>
              <div><div className="eyebrow">Conf</div><div className="font-semibold tnum">{s.confidence}%</div></div>
              <div><div className="eyebrow">Liq</div><div className="font-semibold tnum">{s.liquidity}</div></div>
              <div><div className="eyebrow">In</div><div className="font-semibold tnum">{s.timeLeft}</div></div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10.5px] text-slate2">
              <span>{s.traders.taking} taking</span>·<span>{s.traders.skipping} skip</span>·<span>{s.traders.fading} fade</span>
              <span className="ml-auto inline-flex gap-2">
                <button className="btn btn-ghost btn-xs">Watch</button>
                <button className="btn btn-cerulean btn-xs">Take</button>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Edge feed inline (sortable)                                                */
/* -------------------------------------------------------------------------- */

const SORTS = [
  { value: 'edge', label: 'Highest Edge' },
  { value: 'conf', label: 'Confidence' },
  { value: 'liq',  label: 'Liquidity' },
  { value: 'soon', label: 'Ending Soon' },
  { value: 'soc',  label: 'Social' },
];

function EdgeFeedInline() {
  const [sort, setSort] = useState('edge');
  const [pulseId, setPulseId] = useState(null);
  const sorted = useMemo(() => {
    const arr = [...SIGNALS];
    if (sort === 'edge') arr.sort((a, b) => b.edgePct - a.edgePct);
    if (sort === 'conf') arr.sort((a, b) => b.confidence - a.confidence);
    if (sort === 'liq')  arr.sort((a, b) => b.liquidityScore - a.liquidityScore);
    if (sort === 'soc')  arr.sort((a, b) => b.socialConv - a.socialConv);
    if (sort === 'soon') arr.sort((a, b) => parseInt(a.timeLeft) - parseInt(b.timeLeft));
    return arr.slice(0, 6);
  }, [sort]);

  // Simulate "edge moved" pulse on a random row every ~6s.
  // Lightweight visual nudge — no real data fetching.
  useMemo(() => {
    if (typeof window === 'undefined') return;
    const id = setInterval(() => {
      const pick = SIGNALS[Math.floor(Math.random() * SIGNALS.length)].id;
      setPulseId(pick);
      setTimeout(() => setPulseId(null), 1800);
    }, 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hairline rounded-2xl bg-white">
      <div className="flex items-center justify-between p-3 border-b border-mist">
        <div className="flex items-center gap-2">
          <Eyebrow>Edge feed</Eyebrow>
          <Tabs value={sort} onChange={setSort} items={SORTS} />
        </div>
        <div className="flex items-center gap-2">
          <span className="chip">Niches: 4</span>
          <span className="chip cerulean">Live</span>
          <Link to="/app/feed" className="btn btn-ghost btn-xs">Open feed →</Link>
        </div>
      </div>
      <ul className="divide-y divide-mist">
        {sorted.map((s) => (
          <li key={s.id} className={`p-3 grid grid-cols-[minmax(220px,2.4fr)_minmax(140px,1.4fr)_repeat(5,minmax(70px,1fr))_auto] items-center gap-3 hover:bg-platinum/40 transition ${pulseId === s.id ? 'ring-1 ring-cerulean/40 bg-cerulean/5' : ''}`}>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="chip">{s.venue}</span>
                {s.tier === 'apex' && <span className="chip gold"><Lock /> Apex</span>}
                {s.fade && <span className="chip red">Fade</span>}
              </div>
              <Link to={`/app/signal/${s.id}`} className="text-[13px] font-semibold mt-1 leading-tight block hover:text-cerulean">{s.market}</Link>
              <div className="text-[10.5px] text-slate2 mt-0.5">{s.subtopic} · catalyst {s.catalyst}</div>
            </div>
            <EdgeBar market={s.marketPct} fair={s.fairPct} />
            <Cell label="Edge" value={`+${s.edgePct}%`} tone="positive" />
            <Cell label="Conf" value={`${s.confidence}%`} />
            <Cell label="Liq"  value={s.liquidity} />
            <Cell label="Social" value={`${s.socialConv}%`} tone="cerulean" />
            <Cell label="In"   value={s.timeLeft} />
            <div className="flex items-center gap-1">
              <button className="btn btn-ghost btn-xs">Watch</button>
              <button className="btn btn-cerulean btn-xs">Take</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Cell({ label, value, tone = 'ink' }) {
  const c = tone === 'positive' ? 'text-positive' : tone === 'cerulean' ? 'text-cerulean' : 'text-ink';
  return (
    <div className="text-[11.5px]">
      <div className="eyebrow">{label}</div>
      <div className={`font-semibold tnum ${c}`}>{value}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sticky AI Analyst panel                                                    */
/* -------------------------------------------------------------------------- */

function AIAnalystSticky() {
  return (
    <aside className="hairline rounded-2xl bg-gradient-to-b from-white to-platinum/40 p-4 sticky top-[100px]">
      <div className="flex items-center gap-2.5">
        <MascotMark size={26} />
        <div>
          <div className="text-[13px] font-semibold">Quantzy Analyst</div>
          <div className="text-[10.5px] text-slate2">Tuesday · 14:02 UTC</div>
        </div>
        <span className="ml-auto chip cerulean"><PulseDot /> Live</span>
      </div>
      <div className="mt-3 text-[12.5px] leading-relaxed text-ink">
        <p>Your best opportunity today is in <span className="font-semibold">NBA totals</span>, not politics.</p>
        <p className="mt-2">Your watchlist shows 4 markets with &gt;8% edge but only 2 have sufficient liquidity. Top trader consensus favors <span className="font-semibold">OKC G5 winner</span> with composite conviction +9pp.</p>
        <p className="mt-2 text-slate2">Macro is overbought on June-cut probability — fade signal forming. CPI window in 9 days.</p>
      </div>
      <div className="mt-3 grid gap-1.5">
        <button className="btn btn-cerulean btn-sm w-full justify-between">Review top 3 <Arrow size={12} /></button>
        <button className="btn btn-ghost btn-sm w-full justify-between">Why not politics?</button>
        <button className="btn btn-ghost btn-sm w-full justify-between">Where am I overconfident?</button>
      </div>
      <div className="mt-3 hairline rounded-md p-2 bg-white">
        <div className="eyebrow">Ask Quantzy</div>
        <div className="mt-1 flex items-center gap-2">
          <input className="flex-1 bg-transparent text-[12px] outline-none placeholder-slate1" placeholder="What am I missing in NBA props?" />
          <button className="btn btn-primary btn-xs">↵</button>
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* Catalyst calendar + missed teaser + categories                             */
/* -------------------------------------------------------------------------- */

function Calendar() {
  return (
    <div className="hairline rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Catalyst calendar</Eyebrow>
        <span className="chip">Next 7d</span>
      </div>
      <ul className="space-y-1.5">
        {CATALYSTS.map((c, i) => (
          <li key={i} className="grid grid-cols-[110px_minmax(0,1fr)_auto] items-center gap-3 text-[12px]">
            <span className="text-slate2 tnum">{c.when}</span>
            <span className="font-medium truncate">{c.label}</span>
            <span className={`chip ${c.impact === 'High' ? 'red' : c.impact === 'Med' ? 'cerulean' : ''}`}>{c.impact} · {c.markets}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MissedTeaser() {
  return (
    <div className="hairline rounded-2xl bg-gradient-to-br from-[#fff7ec] via-white to-white p-4 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.18), transparent 70%)' }} />
      <div className="flex items-center justify-between">
        <Eyebrow>You almost had this</Eyebrow>
        <Link to="/app/missed" className="text-[12px] text-cerulean font-semibold">Open ledger →</Link>
      </div>
      <div className="text-[24px] font-display mt-1">$5,492 <span className="text-[12px] text-slate2 font-sans">missed edge · 30d</span></div>
      <ul className="mt-2 space-y-1.5">
        {MISSED.slice(0, 3).map((m) => (
          <li key={m.id} className="flex items-center gap-2 text-[12px]">
            <span className="pulse-dot" />
            <span className="truncate flex-1">{m.market}</span>
            <span className="chip">{m.action}</span>
            <span className="text-positive font-semibold tnum">{m.potentialProfit}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 hairline rounded-md p-2 bg-white">
        <div className="text-[11.5px] text-slate2">Pattern diagnosis: <span className="text-ink font-semibold">you skip 60–70% confidence even when edge is high.</span></div>
        <div className="mt-1 flex items-center gap-1.5">
          <button className="btn btn-ghost btn-xs">Lower conf floor</button>
          <button className="btn btn-ghost btn-xs">Set alert</button>
        </div>
      </div>
    </div>
  );
}

function CategoryHeat() {
  const max = Math.max(...CATEGORIES.map((c) => c.edge));
  return (
    <div className="hairline rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Category heat</Eyebrow>
        <span className="chip cerulean">Edge × hit rate</span>
      </div>
      <ul className="space-y-2">
        {CATEGORIES.map((c) => (
          <li key={c.topic} className="grid grid-cols-[100px_minmax(0,1fr)_auto] items-center gap-3 text-[12px]">
            <span className="font-medium">{c.topic}</span>
            <div className="h-1.5 rounded bg-mist relative">
              <div className="h-1.5 rounded" style={{ width: `${(c.edge / max) * 100}%`, background: c.color }} />
            </div>
            <span className="tnum text-slate2">+{c.edge}% · {c.hit}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FollowedActivity() {
  return (
    <div className="hairline rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <Eyebrow>Followed traders · live</Eyebrow>
        <Link to="/app/social" className="text-[12px] text-cerulean font-semibold">Hub →</Link>
      </div>
      <ul className="space-y-2">
        {TRADERS.slice(0, 5).map((t) => (
          <li key={t.name} className="flex items-center gap-2 text-[12px]">
            <span className="h-7 w-7 rounded-full bg-ink text-white grid place-items-center text-[10px] font-semibold">{t.name.slice(0,2).toUpperCase()}</span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold truncate">@{t.name} <span className="text-slate2 font-normal">· {t.specialty}</span></div>
              <div className="text-[10.5px] text-slate2">Took <span className="text-ink">OKC G5</span> · 4m ago · {t.tier}</div>
            </div>
            <span className="chip green">+{t.roi}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApexTeaser() {
  return (
    <div className="rounded-2xl gold-frame bg-gradient-to-br from-[#fffaee] to-white p-4">
      <div className="flex items-center gap-2">
        <QBadge size={22} />
        <div className="eyebrow text-[#7E5E22]">Apex · gated insight</div>
      </div>
      <div className="text-[14px] font-semibold mt-1">3 premium branches in your niches today</div>
      <ul className="mt-2 space-y-1.5 text-[12px]">
        <li className="flex justify-between"><span className="truncate">Spot SOL ETF · before year-end</span><span className="text-positive tnum">+11.0%</span></li>
        <li className="flex justify-between"><span className="truncate">EU AI Act delegated rules</span><span className="text-positive tnum">+7.0%</span></li>
        <li className="flex justify-between"><span className="truncate">Taylor Swift tour extension</span><span className="text-positive tnum">+13.0%</span></li>
      </ul>
      <Link to="/app/tiers" className="btn btn-gold btn-sm w-full mt-3 justify-center">Unlock Apex</Link>
      <div className="text-[10.5px] text-slate2 mt-1.5 text-center">Performance-credit guarantee · see terms</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export function Dashboard() {
  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1600px] mx-auto space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Eyebrow>Welcome back</Eyebrow>
          <h1 className="font-display text-[32px] leading-tight tracking-tight">Good afternoon, Rémi.</h1>
          <p className="text-[13px] text-slate2 mt-0.5">Markets are <span className="text-positive font-semibold">open</span>. 23 opportunities. 6 missed wins to review.</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Link to="/app/scanner" className="btn btn-cerulean btn-sm">Open Scanner</Link>
          <Link to="/app/analyst" className="btn btn-ghost btn-sm">Ask Analyst</Link>
        </div>
      </div>

      <KpiStrip />
      <PriorityRail />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-5">
        <div className="space-y-5 min-w-0">
          <EdgeFeedInline />
          <div className="grid md:grid-cols-2 gap-5">
            <Calendar />
            <CategoryHeat />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <MissedTeaser />
            <FollowedActivity />
          </div>
        </div>
        <div className="space-y-5">
          <AIAnalystSticky />
          <ApexTeaser />
        </div>
      </div>
    </div>
  );
}
