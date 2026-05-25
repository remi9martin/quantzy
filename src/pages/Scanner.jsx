import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Chip, PulseDot, Sparkline, EdgeBar, ConfBand, Tabs, Lock, Arrow } from '../components/UI.jsx';
import { MindMap, SAMPLE_TREE } from '../components/MindMap.jsx';
import { Drawer } from '../components/MobileNav.jsx';
import { TOPICS, SIGNALS, TRADERS } from '../data/markets.js';
import { MascotMark } from '../components/Mascot.jsx';

/* -------------------- Left filter rail ------------------------------------ */

function FilterGroup({ label, children }) {
  return (
    <div>
      <div className="eyebrow mb-1.5">{label}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Slider({ label, value, suffix = '%', onChange, min = 0, max = 100, step = 1 }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11.5px]">
        <span className="text-slate1">{label}</span>
        <span className="tnum text-white font-semibold">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-cerulean"
      />
    </div>
  );
}

function Toggle({ label, checked, onChange, hint }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between text-[12px] hairline rounded-md px-2 py-1.5 ${checked ? 'bg-cerulean/15 border-cerulean/40' : 'bg-carbon'}`}
    >
      <span className="text-left">
        <span className="block text-white">{label}</span>
        {hint && <span className="block text-[10px] text-slate1">{hint}</span>}
      </span>
      <span className={`w-7 h-4 rounded-full p-0.5 ${checked ? 'bg-cerulean' : 'bg-white/10'}`}>
        <span className={`block h-3 w-3 rounded-full bg-carbon transition-transform ${checked ? 'translate-x-3' : ''}`} />
      </span>
    </button>
  );
}

function ScannerLeftRail({ filters, setFilters }) {
  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-white/10 bg-carbon/60 backdrop-blur-sm">
      <div className="px-4 py-4 space-y-5 sticky top-[88px] max-h-[calc(100vh-88px)] overflow-y-auto">
        <FilterGroup label="Topic universe">
          <select
            value={filters.topic}
            onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
            className="w-full bg-carbon hairline rounded-md text-[12.5px] px-2 h-8"
          >
            {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {['Polymarket','Kalshi','Sports','Crypto'].map((v) => (
              <span key={v} className="chip cerulean text-[10px]">{v}</span>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Thresholds">
          <Slider label="Edge ≥"        value={filters.edge}     onChange={(v) => setFilters({ ...filters, edge: v })} max={20} />
          <Slider label="Confidence ≥"  value={filters.conf}     onChange={(v) => setFilters({ ...filters, conf: v })} />
          <Slider label="Liquidity ≥"   value={filters.liq}      onChange={(v) => setFilters({ ...filters, liq: v })} />
          <Slider label="Social ≥"      value={filters.social}   onChange={(v) => setFilters({ ...filters, social: v })} />
          <Slider label="Time ≤"        value={filters.time}     onChange={(v) => setFilters({ ...filters, time: v })} suffix="d" max={365} />
        </FilterGroup>

        <FilterGroup label="Filters">
          <Toggle label="Exclude rules-risky" checked={filters.cleanRules} onChange={(v) => setFilters({ ...filters, cleanRules: v })} hint="High-ambiguity resolutions hidden" />
          <Toggle label="Exclude already moved" checked={filters.notMoved} onChange={(v) => setFilters({ ...filters, notMoved: v })} hint="Hide if &gt; 60% of edge already priced in" />
          <Toggle label="Followed-trader activity" checked={filters.social_active} onChange={(v) => setFilters({ ...filters, social_active: v })} hint="Top traders entered" />
          <Toggle label="Show locked Apex" checked={filters.showApex} onChange={(v) => setFilters({ ...filters, showApex: v })} />
          <Toggle label="Include missed opportunities" checked={filters.includeMissed} onChange={(v) => setFilters({ ...filters, includeMissed: v })} />
        </FilterGroup>

        <FilterGroup label="Risk mode">
          <div className="inline-flex hairline rounded-md p-0.5 bg-onyx w-full">
            {['Cons','Bal','Aggr','Degen'].map((m, i) => (
              <button
                key={m}
                onClick={() => setFilters({ ...filters, risk: m })}
                className={`flex-1 text-[11px] h-7 rounded ${filters.risk === m ? 'bg-carbon shadow-card text-white font-semibold' : 'text-slate1'}`}
              >{m}</button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Saved scans">
          <ul className="space-y-1.5 text-[12px]">
            <li className="flex items-center justify-between"><span>NBA · totals · &lt;24h</span><span className="text-positive tnum">+8.2%</span></li>
            <li className="flex items-center justify-between"><span>Politics · clean rules</span><span className="text-positive tnum">+5.4%</span></li>
            <li className="flex items-center justify-between"><span>AI · catalyst &lt;7d</span><span className="text-positive tnum">+11.1%</span></li>
          </ul>
          <button className="btn btn-ghost btn-xs w-full mt-1">+ Save current</button>
        </FilterGroup>
      </div>
    </aside>
  );
}

/* ------------------- Right inspector --------------------------------------- */

function InspectorBody({ leaf }) {
  const lo = leaf.confLow || leaf.conf - 6;
  const hi = leaf.confHigh || leaf.conf + 6;
  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Eyebrow>Inspector</Eyebrow>
          <div className="flex items-center gap-1">
            <span className="chip">Polymarket</span>
            {leaf.tier === 'apex' && <span className="chip gold"><Lock /> Apex</span>}
          </div>
        </div>
        <div>
          <div className="text-[14.5px] font-semibold leading-tight">{leaf.label}</div>
          <div className="text-[11px] text-slate1 mt-0.5">Resolution · estimated June 2024 · clean rules</div>
        </div>

        <div className="hairline rounded-lg bg-white/5 p-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div><div className="eyebrow">Market</div><div className="font-semibold tnum">{leaf.mp}¢</div></div>
            <div><div className="eyebrow">Fair</div><div className="font-semibold tnum text-cerulean">{leaf.fp}¢</div></div>
            <div><div className="eyebrow">Edge</div><div className="font-semibold tnum text-positive">+{leaf.edge.toFixed(1)}%</div></div>
          </div>
          <div className="mt-2"><EdgeBar market={leaf.mp} fair={leaf.fp} /></div>
        </div>

        <div>
          <div className="eyebrow mb-1">Confidence</div>
          <ConfBand value={leaf.conf} />
          <div className="flex items-center justify-between text-[10.5px] text-slate1 mt-1 tnum">
            <span>{lo}%</span><span className="text-cerulean font-semibold">{leaf.conf}%</span><span>{hi}%</span>
          </div>
          <div className="text-[11px] text-slate1 mt-1">In this band: 612 resolved · actual <span className="text-positive font-semibold">75.6%</span></div>
        </div>

        <div>
          <div className="eyebrow mb-1">Probability decomposition</div>
          {leaf.factors.map((f) => (
            <div key={f.k} className="mb-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate1">{f.k}</span>
                <span className="tnum text-white font-semibold">{Math.round(f.v * 100)}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded">
                <div className="h-1.5 rounded bg-cerulean" style={{ width: `${f.v * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="eyebrow mb-1">Thesis</div>
          <p className="text-[12px] leading-snug text-white">{leaf.thesis}</p>
        </div>

        <div className="hairline rounded-lg p-3 bg-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate1 mb-1.5">
            <span>Social overlay</span>
            <span className="tnum">{leaf.social}%</span>
          </div>
          <div className="flex -space-x-1.5">
            {TRADERS.slice(0, 5).map((t) => (
              <span key={t.name} title={`@${t.name}`} className="h-6 w-6 rounded-full bg-ink text-white grid place-items-center text-[9px] font-semibold ring-2 ring-carbon">
                {t.name.slice(0,2).toUpperCase()}
              </span>
            ))}
          </div>
          <div className="text-[11px] text-slate1 mt-1.5">12 entered · 3 skipping · 2 fading</div>
        </div>

        <div>
          <div className="eyebrow mb-1">Invalidation triggers</div>
          <ul className="text-[11.5px] space-y-1 text-slate1">
            <li>• Price crosses 0.62 (model exit)</li>
            <li>• Liquidity collapses below $400k</li>
            <li>• Resolution rule challenged on venue</li>
            <li>• 7d implied vol &gt; 80th percentile</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <Link to={`/app/signal/${leaf.id}`} className="btn btn-cerulean btn-sm justify-center">Open</Link>
          <button className="btn btn-primary btn-sm">Take</button>
          <button className="btn btn-ghost btn-sm">Watch</button>
          <button className="btn btn-ghost btn-sm">Simulate</button>
          <button className="btn btn-ghost btn-sm">Ask AI</button>
          <button className="btn btn-ghost btn-sm">Challenge</button>
        </div>
    </div>
  );
}

function InspectorEmpty() {
  return (
    <div className="hairline rounded-lg bg-white/5 p-4 mt-2 text-center">
      <MascotMark size={36} className="mx-auto" />
      <div className="text-[13px] font-semibold mt-2">Pick a leaf</div>
      <p className="text-[11.5px] text-slate1 mt-1">Tap any market node in the map to see its full thesis, factor breakdown, and social overlay.</p>
    </div>
  );
}

function Inspector({ leaf }) {
  return (
    <aside className="hidden lg:block w-[340px] shrink-0 border-l border-white/10 bg-carbon">
      <div className="px-4 py-3 sticky top-[88px] max-h-[calc(100vh-88px)] overflow-y-auto">
        <div className="eyebrow mb-2">Opportunity inspector</div>
        {leaf ? <InspectorBody leaf={leaf} /> : <InspectorEmpty />}
      </div>
    </aside>
  );
}

/* -------------------- Bottom: opportunity matrix + calibration ----------- */

function OpportunityMatrix() {
  const data = SIGNALS.slice(0, 12).map((s) => ({
    id: s.id, x: s.edgePct, y: s.confidence, r: 4 + (s.liquidityScore / 12),
    color: s.tier === 'apex' ? '#C9A24B' : s.fade ? '#E24A4A' : s.confidence > 70 ? '#2563EB' : '#9AA3AE',
    label: s.market.length > 22 ? s.market.slice(0, 22) + '…' : s.market,
  }));
  const W = 460, H = 220, P = 28;
  const xMax = 16, yMax = 100;
  const x = (v) => P + (v / xMax) * (W - P - 6);
  const y = (v) => H - P - (v / yMax) * (H - P - 12);
  return (
    <div className="hairline rounded-xl bg-carbon p-3">
      <div className="flex items-center justify-between mb-2">
        <Eyebrow>Opportunity matrix</Eyebrow>
        <span className="chip cerulean">Edge × Conf · liquidity = bubble</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <rect x={P} y={12} width={W - P - 6} height={H - P - 12} fill="rgba(37,99,235,0.05)" />
        <line x1={P} y1={(H - P + 12) / 2} x2={W - 6} y2={(H - P + 12) / 2} stroke="rgba(255,255,255,0.08)" />
        <line x1={(P + W - 6) / 2} y1={12} x2={(P + W - 6) / 2} y2={H - P} stroke="rgba(255,255,255,0.08)" />
        <text x={W - 8} y={20} textAnchor="end" fontSize="9" fill="#9AA3AE">Alpha zone ↑</text>
        <text x={P + 4} y={H - P - 4} fontSize="9" fill="#9AA3AE">noise</text>
        {/* axes */}
        {[0, 5, 10, 15].map((v) => (
          <text key={v} x={x(v)} y={H - 10} fontSize="8.5" textAnchor="middle" fill="#9AA3AE">{v}%</text>
        ))}
        {[50, 70, 90].map((v) => (
          <text key={v} x={20} y={y(v) + 3} fontSize="8.5" textAnchor="end" fill="#9AA3AE">{v}</text>
        ))}
        {data.map((d) => (
          <g key={d.id}>
            <circle cx={x(d.x)} cy={y(d.y)} r={d.r} fill={d.color} fillOpacity="0.6" stroke={d.color} />
            <title>{d.label}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}

function CalibCard() {
  return (
    <div className="hairline rounded-xl bg-carbon p-3">
      <Eyebrow>Calibration · this band</Eyebrow>
      <div className="text-[12px] text-slate1 mt-1">Model says <span className="text-white font-semibold">75–85%</span>. Historical actual <span className="text-positive font-semibold">78.3%</span> over <span className="text-white font-semibold">842</span> resolved samples.</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="hairline rounded-md p-2"><div className="eyebrow">Brier</div><div className="font-semibold tnum">0.146</div></div>
        <div className="hairline rounded-md p-2"><div className="eyebrow">Slope</div><div className="font-semibold tnum">0.98</div></div>
        <div className="hairline rounded-md p-2"><div className="eyebrow">Best cat</div><div className="font-semibold">Macro</div></div>
        <div className="hairline rounded-md p-2"><div className="eyebrow">Weakest</div><div className="font-semibold">Culture</div></div>
      </div>
    </div>
  );
}

function MissedCard() {
  return (
    <div className="hairline rounded-xl bg-gradient-to-br from-[#2A2418] to-carbon p-3">
      <Eyebrow>Missed edge · this topic</Eyebrow>
      <div className="text-[12px] text-slate1 mt-1">You searched <span className="text-white font-semibold">"Fed rates"</span> 11 days ago. Two markets later moved <span className="text-warn font-semibold">+31¢</span>.</div>
      <ul className="mt-2 text-[11.5px] space-y-1">
        <li className="flex justify-between"><span>Fed cuts 25bps · June</span><span className="text-positive tnum">+$1,240</span></li>
        <li className="flex justify-between"><span>CPI &lt;3.2% · May</span><span className="text-positive tnum">+$870</span></li>
      </ul>
      <button className="btn btn-ghost btn-xs mt-2 w-full">Replay timeline</button>
    </div>
  );
}

function TierTeaser() {
  return (
    <div className="rounded-xl gold-frame bg-gradient-to-br from-[#2A2418] to-carbon p-3">
      <Eyebrow className="text-[#7E5E22]">Apex teaser</Eyebrow>
      <div className="text-[13px] font-semibold mt-1">Apex branch hidden in this topic</div>
      <div className="text-[11px] text-slate1 mt-1">+14.2% edge · 82% confidence · $4.2M liquidity</div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <div className="hairline rounded-md p-1.5 text-center"><div className="eyebrow">Edge</div><div className="font-semibold tnum text-positive">+14.2%</div></div>
        <div className="hairline rounded-md p-1.5 text-center"><div className="eyebrow">Conf</div><div className="font-semibold tnum">82%</div></div>
        <div className="hairline rounded-md p-1.5 text-center"><div className="eyebrow">Liq</div><div className="font-semibold tnum">$4.2M</div></div>
      </div>
      <Link to="/app/tiers" className="btn btn-gold btn-xs w-full mt-2">Unlock</Link>
    </div>
  );
}

/* ---------------------------- Main page ---------------------------------- */

const VIEW_MODES = [
  { value: 'mind',  label: 'Mind map' },
  { value: 'const', label: 'Constellation' },
  { value: 'radar', label: 'Radar' },
  { value: 'heat',  label: 'Heatmap' },
  { value: 'table', label: 'Table' },
];

export function Scanner() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('mind');
  const [mobileInspector, setMobileInspector] = useState(false);
  const [mobileFilters, setMobileFilters]     = useState(false);
  const [filters, setFilters] = useState({
    topic: 'politics',
    edge: 5, conf: 60, liq: 30, social: 0, time: 180,
    cleanRules: true, notMoved: true, social_active: false, showApex: true, includeMissed: false,
    risk: 'Bal',
  });

  const handleSelect = (leaf) => {
    setSelected(leaf);
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
      setMobileInspector(true);
    }
  };

  return (
    <div className="flex">
      <ScannerLeftRail filters={filters} setFilters={setFilters} />
      <div className="flex-1 min-w-0">
        <div className="px-4 lg:px-6 py-4 max-w-[1600px] mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <Eyebrow>Market scanner</Eyebrow>
              <h1 className="font-display text-[26px] tracking-tight">{TOPICS.find((t) => t.id === filters.topic)?.label || 'US Politics'}</h1>
            </div>
            <Tabs value={view} onChange={setView} items={VIEW_MODES} className="ml-auto" />
            <button onClick={() => setMobileFilters(true)} className="btn btn-ghost btn-sm lg:hidden">Filters</button>
            <button className="btn btn-ghost btn-sm hidden sm:inline-flex">Export</button>
            <button className="btn btn-cerulean btn-sm">Save scan</button>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {[
              { k: 'Markets',  v: '412',     t: 'ink' },
              { k: 'Liquidity', v: '$48M',   t: 'ink' },
              { k: 'Avg edge', v: '+6.8%',   t: 'positive' },
              { k: 'Apex branches', v: '3', t: 'gold' },
              { k: 'Social heat',   v: 'High', t: 'cerulean' },
              { k: 'Catalyst window', v: '3d', t: 'ink' },
            ].map((x) => (
              <div key={x.k} className="hairline rounded-lg bg-carbon p-2.5">
                <div className="eyebrow">{x.k}</div>
                <div className={`mt-0.5 text-[16px] font-semibold tnum ${x.t === 'positive' ? 'text-positive' : x.t === 'gold' ? 'text-[#7E5E22]' : x.t === 'cerulean' ? 'text-cerulean' : 'text-white'}`}>{x.v}</div>
              </div>
            ))}
          </div>

          {/* Map / view */}
          <div className="hairline rounded-2xl bg-carbon relative overflow-hidden shadow-card">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-[11px] text-slate1">
                <PulseDot tone="green" /><span>Live · 14:02 UTC</span>
                <span className="chip">Edge ≥ {filters.edge}%</span>
                <span className="chip">Conf ≥ {filters.conf}%</span>
                <span className="chip">Liq ≥ {filters.liq}</span>
                <span className="chip">{filters.cleanRules ? 'Clean rules' : 'All rules'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="btn btn-ghost btn-xs">Zoom</button>
                <button className="btn btn-ghost btn-xs">Pan</button>
                <button className="btn btn-ghost btn-xs">Reset</button>
              </div>
            </div>
            {view === 'mind' && <MindMap onSelect={handleSelect} selectedId={selected?.id} />}
            {view === 'const' && <ConstellationView onSelect={handleSelect} />}
            {view === 'radar' && <RadarView />}
            {view === 'heat' && <HeatmapView />}
            {view === 'table' && <TableView onSelect={handleSelect} />}
          </div>

          {/* Bottom row */}
          <div className="grid lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-3">
            <OpportunityMatrix />
            <CalibCard />
            <MissedCard />
            <TierTeaser />
          </div>
        </div>
      </div>
      <Inspector leaf={selected} />

      {/* Mobile drawers */}
      <Drawer open={mobileFilters} onClose={() => setMobileFilters(false)} title="Filters">
        <ScannerFiltersInner filters={filters} setFilters={setFilters} />
      </Drawer>
      <Drawer open={mobileInspector} onClose={() => setMobileInspector(false)} title="Inspector">
        {selected ? <InspectorBody leaf={selected} /> : <InspectorEmpty />}
      </Drawer>
    </div>
  );
}

function ScannerFiltersInner({ filters, setFilters }) {
  return (
    <div className="space-y-5">
      <FilterGroup label="Topic universe">
        <select
          value={filters.topic}
          onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
          className="w-full bg-carbon hairline rounded-md text-[13px] px-2 h-9"
        >
          {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </FilterGroup>
      <FilterGroup label="Thresholds">
        <Slider label="Edge ≥"        value={filters.edge}     onChange={(v) => setFilters({ ...filters, edge: v })} max={20} />
        <Slider label="Confidence ≥"  value={filters.conf}     onChange={(v) => setFilters({ ...filters, conf: v })} />
        <Slider label="Liquidity ≥"   value={filters.liq}      onChange={(v) => setFilters({ ...filters, liq: v })} />
        <Slider label="Time ≤"        value={filters.time}     onChange={(v) => setFilters({ ...filters, time: v })} suffix="d" max={365} />
      </FilterGroup>
      <FilterGroup label="Risk mode">
        <div className="inline-flex hairline rounded-md p-0.5 bg-onyx w-full">
          {['Cons','Bal','Aggr','Degen'].map((m) => (
            <button
              key={m}
              onClick={() => setFilters({ ...filters, risk: m })}
              className={`flex-1 text-[12px] h-8 rounded ${filters.risk === m ? 'bg-carbon shadow-card text-white font-semibold' : 'text-slate1'}`}
            >{m}</button>
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

/* ----------------- Alternate map views (compact, but real) -------------- */

function ConstellationView({ onSelect }) {
  const W = 940, H = 560;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" style={{ background: '#0B0D10', aspectRatio: `${W}/${H}` }}>
      <defs>
        <radialGradient id="bg-stars" cx="50%" cy="50%" r="60%">
          <stop offset="0" stopColor="#0F1622" />
          <stop offset="1" stopColor="#050608" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bg-stars)" />
      {Array.from({ length: 80 }).map((_, i) => {
        const x = (i * 137.5) % W, y = (i * 91.7) % H;
        return <circle key={i} cx={x} cy={y} r={Math.random() * 1.2} fill="rgba(255,255,255,0.30)" />;
      })}
      {SIGNALS.slice(0, 12).map((s, i) => {
        const a = (i / 12) * Math.PI * 2;
        const r = 120 + (s.confidence - 60) * 4;
        const cx = W / 2 + r * Math.cos(a);
        const cy = H / 2 + r * Math.sin(a);
        const size = 4 + s.edgePct;
        const color = s.tier === 'apex' ? '#C9A24B' : s.fade ? '#E24A4A' : '#3B82F6';
        return (
          <g key={s.id} onClick={() => onSelect?.({ id: s.id, label: s.market, mp: s.marketPct, fp: s.fairPct, edge: s.edgePct, conf: s.confidence, liq: s.liquidity, social: s.socialConv, tier: s.tier, factors: [{ k: 'Polling', v: 0.6 }, { k: 'Catalyst', v: 0.5 }], thesis: s.thesis, status: s.status })} className="cursor-pointer">
            <circle cx={cx} cy={cy} r={size + 8} fill={color} opacity="0.18" />
            <circle cx={cx} cy={cy} r={size} fill={color} />
            <text x={cx} y={cy + size + 12} textAnchor="middle" fontSize="9.5" fill="rgba(255,255,255,0.85)">{s.subtopic}</text>
          </g>
        );
      })}
      <text x="50%" y="38" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" letterSpacing="0.18em">CONSTELLATION · BRIGHTNESS = EDGE · SIZE = LIQUIDITY</text>
    </svg>
  );
}

function RadarView() {
  const W = 940, H = 560, cx = 470, cy = 280;
  const rings = [60, 120, 180, 240];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full block bg-[#050608]" style={{ aspectRatio: `${W}/${H}` }}>
      {rings.map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,191,166,0.18)" strokeDasharray="2 4" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={cx} y1={cy} x2={cx + 240 * Math.cos(a)} y2={cy + 240 * Math.sin(a)} stroke="rgba(0,191,166,0.12)" />;
      })}
      <g>
        <line x1={cx} y1={cy} x2={cx + 240} y2={cy} stroke="#00BFA6" />
        <circle cx={cx + 240} cy={cy} r="4" fill="#00BFA6" />
      </g>
      {SIGNALS.slice(0, 14).map((s, i) => {
        const a = (i / 14) * Math.PI * 2;
        const r = 60 + (s.confidence - 50) * 3;
        return (
          <g key={s.id}>
            <circle cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={3 + s.edgePct / 3} fill={s.tier === 'apex' ? '#C9A24B' : '#3B82F6'} />
          </g>
        );
      })}
      <text x="50%" y="38" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" letterSpacing="0.18em">TACTICAL RADAR · ANGLE = CATEGORY · RADIUS = CONFIDENCE</text>
      {['24h', '7d', '30d', '90d'].map((l, i) => (
        <text key={l} x={cx + rings[i]} y={cy - 6} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.55)">{l}</text>
      ))}
    </svg>
  );
}

function HeatmapView() {
  const cats = ['Politics', 'NBA', 'Crypto', 'Macro', 'AI', 'Culture', 'Weather'];
  const horizons = ['<24h', '24h–7d', '7d–30d', '30d–90d', '>90d'];
  return (
    <div className="p-4">
      <div className="grid grid-cols-[100px_repeat(5,minmax(0,1fr))] gap-1">
        <div></div>
        {horizons.map((h) => <div key={h} className="eyebrow">{h}</div>)}
        {cats.map((c) => (
          <>
            <div key={c} className="text-[12px] font-semibold py-1.5">{c}</div>
            {horizons.map((h) => {
              const v = (Math.abs(c.charCodeAt(0) + h.length) % 12) / 12;
              const color = v > 0.65 ? '#0F9D58' : v > 0.35 ? '#2563EB' : '#9AA3AE';
              return (
                <div key={c + h} className="rounded-md text-center text-[11px] font-semibold tnum text-white py-2"
                  style={{ background: color, opacity: 0.4 + v * 0.6 }}>
                  +{(2 + v * 10).toFixed(1)}%
                </div>
              );
            })}
          </>
        ))}
      </div>
      <div className="text-[11px] text-slate1 mt-3">Click any cell to expand into ranked market cards.</div>
    </div>
  );
}

function TableView({ onSelect }) {
  return (
    <div className="p-2">
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left text-slate1">
              <th className="py-1.5 px-2">Market</th>
              <th>Topic</th>
              <th>Edge</th>
              <th>Conf</th>
              <th>Liq</th>
              <th>Social</th>
              <th>In</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {SIGNALS.map((s) => (
              <tr key={s.id} className="border-t border-white/10 hover:bg-white/5 cursor-pointer"
                onClick={() => onSelect?.({ id: s.id, label: s.market, mp: s.marketPct, fp: s.fairPct, edge: s.edgePct, conf: s.confidence, liq: s.liquidity, social: s.socialConv, tier: s.tier, factors: [{ k: 'Polling', v: 0.6 }, { k: 'Catalyst', v: 0.5 }], thesis: s.thesis, status: s.status })}>
                <td className="py-1.5 px-2 truncate max-w-[260px]">{s.market}</td>
                <td className="text-slate1">{s.subtopic}</td>
                <td className="text-positive font-semibold tnum">+{s.edgePct}%</td>
                <td className="tnum">{s.confidence}%</td>
                <td className="tnum">{s.liquidity}</td>
                <td className="tnum">{s.socialConv}%</td>
                <td className="tnum">{s.timeLeft}</td>
                <td>{s.status}</td>
                <td><button className="btn btn-ghost btn-xs">Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
