import { Link } from 'react-router-dom';
import { Logo, Wordmark, QBadge } from '../components/Logo.jsx';
import { Mascot, MascotMark } from '../components/Mascot.jsx';
import { Chip, PulseDot, Sparkline, EdgeBar, ConfBand, Eyebrow } from '../components/UI.jsx';
import { SIGNALS, TOPICS, CATEGORIES } from '../data/markets.js';

/* ----------------------------- Public top nav ----------------------------- */

function MarketingNav() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/70 border-b border-mist">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size={22} />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-[13px] text-slate2 font-medium">
          <a href="#scanner" className="hover:text-ink">Scanner</a>
          <a href="#social"  className="hover:text-ink">Social Edge</a>
          <a href="#calib"   className="hover:text-ink">Calibration</a>
          <a href="#missed"  className="hover:text-ink">Missed Wins</a>
          <Link to="/pricing" className="hover:text-ink">Pricing</Link>
          <Link to="/methodology" className="hover:text-ink">Methodology</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a href="#feed" className="hidden md:inline-flex btn btn-ghost btn-sm">Live edge preview</a>
          <Link to="/app" className="btn btn-primary btn-sm">Enter app</Link>
        </div>
      </div>
    </header>
  );
}

/* -------------------------- Hero scanner preview ------------------------- */
// Self-contained mini mind map used inside the hero. Branches drawn with SVG;
// leaves are styled cards positioned around the center node.

function HeroMindMap() {
  // Center: "US Politics". Branches: Pres winner, Senate, Debates, Court rulings.
  // Leaves: specific markets with edge / confidence / liquidity / status chips.
  const center = { label: 'US Politics', sub: '412 markets · $48M' };
  const branches = [
    { id: 'b1', angle: -150, label: 'Pres winner', edge: '+7.0%', conf: 76, locked: false, hot: true,
      node: { mkt: 'Trump 2024', mp: 51, fp: 58, liq: '$12.4M', status: 'NEW', tier: 'Standard' } },
    { id: 'b2', angle: -70,  label: 'Senate', edge: '+5.4%', conf: 71, locked: false,
      node: { mkt: 'GOP holds Senate', mp: 56, fp: 62, liq: '$3.8M', status: 'MOVING', tier: 'Standard' } },
    { id: 'b3', angle: 25,   label: 'Debates', edge: '+11.0%', conf: 64, locked: true, hot: true,
      node: { mkt: 'Debate before July 1', mp: 41, fp: 52, liq: '$1.1M', status: 'APEX', tier: 'Apex' } },
    { id: 'b4', angle: 110,  label: 'Court rulings', edge: '+3.2%', conf: 58, locked: false,
      node: { mkt: 'TikTok divestiture by Sep', mp: 22, fp: 18, liq: '$1.4M', status: 'FADE', tier: 'Standard' } },
  ];
  const W = 640, H = 460, cx = 320, cy = 230, r = 165;
  const pos = (deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  return (
    <div className="relative w-full">
      <div className="relative rounded-2xl overflow-hidden hairline shadow-lift bg-white">
        {/* Subtle grid + radial wash */}
        <div className="absolute inset-0 bg-grid opacity-[0.55]" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(420px 280px at 50% 48%, rgba(37,99,235,0.10), transparent 70%), radial-gradient(280px 200px at 78% 92%, rgba(201,162,75,0.10), transparent 70%)',
        }} />

        {/* Top instrumentation strip */}
        <div className="relative z-10 flex items-center gap-3 px-5 h-11 border-b border-mist bg-white/80 backdrop-blur">
          <div className="flex items-center gap-2 text-[11px] tracking-wider2 uppercase text-slate2">
            <PulseDot tone="green" /><span>Live · 14:02 UTC</span>
          </div>
          <span className="chip cerulean">Topic · US Politics</span>
          <span className="chip">Filter · Edge ≥ 5%</span>
          <span className="chip">Liquidity ≥ $250k</span>
          <span className="chip">Resolution · clean</span>
          <span className="ml-auto inline-flex items-center gap-2 text-[11px] tnum text-slate2">
            <span>Branches <span className="text-ink font-semibold">12</span></span>
            <span>Apex <span className="text-gold font-semibold">3</span></span>
            <span>Composite <span className="text-positive font-semibold">+8.4%</span></span>
          </span>
        </div>

        {/* SVG mind map */}
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" style={{ aspectRatio: `${W}/${H}` }}>
          {/* concentric guide rings */}
          <g opacity="0.55">
            {[60, 110, 165].map((rr) => (
              <circle key={rr} cx={cx} cy={cy} r={rr} fill="none" stroke="rgba(11,13,16,0.07)" strokeDasharray="2 4" />
            ))}
          </g>

          {/* Branch paths */}
          {branches.map((b) => {
            const p = pos(b.angle);
            const mid = { x: (cx + p.x) / 2, y: (cy + p.y) / 2 - 8 };
            const d = `M ${cx} ${cy} Q ${mid.x} ${mid.y} ${p.x} ${p.y}`;
            const stroke = b.locked ? '#C9A24B' : b.hot ? '#2563EB' : '#94A3B8';
            return (
              <g key={b.id}>
                <path
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={b.locked ? 2.2 : b.hot ? 2 : 1.4}
                  strokeOpacity={b.locked ? 0.85 : b.hot ? 0.85 : 0.7}
                  strokeLinecap="round"
                  className="draw"
                  style={{ '--len': 800 }}
                />
                {/* dot at midpoint with edge label */}
                <g transform={`translate(${mid.x} ${mid.y})`}>
                  <rect x="-32" y="-10" width="64" height="20" rx="10" fill="#FFFFFF" stroke="rgba(11,13,16,0.10)" />
                  <text x="0" y="4" textAnchor="middle" fontSize="10.5" fontWeight="600"
                    fill={b.locked ? '#7E5E22' : '#0B0D10'}>
                    {b.edge}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Center node */}
          <g>
            <circle cx={cx} cy={cy} r="58" fill="#0B0D10" />
            <circle cx={cx} cy={cy} r="58" fill="url(#heroCenter)" />
            <defs>
              <radialGradient id="heroCenter" cx="50%" cy="40%" r="60%">
                <stop offset="0" stopColor="#1E40AF" stopOpacity="0.95" />
                <stop offset="1" stopColor="#0B0D10" stopOpacity="1" />
              </radialGradient>
            </defs>
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#FFFFFF" letterSpacing="0.04em">
              {center.label.toUpperCase()}
            </text>
            <text x={cx} y={cy + 13} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.66)" letterSpacing="0.06em">
              {center.sub}
            </text>
            {/* slow rotating ring */}
            <g className="spin-slow" style={{ transformOrigin: `${cx}px ${cy}px` }}>
              <circle cx={cx} cy={cy} r="76" fill="none" stroke="rgba(37,99,235,0.35)" strokeDasharray="2 6" />
              <circle cx={cx + 76} cy={cy} r="2" fill="#C9A24B" />
            </g>
          </g>

          {/* Branch end-leaves (positioned via foreignObject for HTML cards) */}
          {branches.map((b) => {
            const p = pos(b.angle);
            const left = p.x - 110, top = p.y - 48;
            return (
              <foreignObject key={b.id} x={left} y={top} width="220" height="98">
                <div className={`node-card hairline rounded-lg bg-white px-3 py-2 ${b.locked ? 'gold-frame' : ''}`}
                  style={{ boxShadow: '0 12px 30px -16px rgba(11,13,16,0.20)' }}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="eyebrow">{b.label}</div>
                    {b.locked
                      ? <span className="chip gold">Apex</span>
                      : b.hot ? <span className="chip cerulean"><PulseDot /> Hot</span>
                      : <span className="chip">Open</span>}
                  </div>
                  <div className="text-[12.5px] font-semibold text-ink mt-0.5 leading-tight truncate">{b.node.mkt}</div>
                  <div className="mt-1.5">
                    <EdgeBar market={b.node.mp} fair={b.node.fp} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-1.5 tnum">
                    <span className="text-slate2">Conf <span className="text-ink font-semibold">{b.conf}%</span></span>
                    <span className="text-slate2">Liq <span className="text-ink font-semibold">{b.node.liq}</span></span>
                    <span className={`font-semibold ${b.node.status === 'FADE' ? 'text-warn' : b.node.status === 'APEX' ? 'text-gold' : b.node.status === 'MOVING' ? 'text-cerulean' : 'text-positive'}`}>{b.node.status}</span>
                  </div>
                </div>
              </foreignObject>
            );
          })}
        </svg>

        {/* Bottom annotation strip */}
        <div className="relative z-10 flex items-center gap-4 px-5 h-11 border-t border-mist bg-white/80 backdrop-blur">
          <div className="flex items-center gap-2 text-[11px] text-slate2">
            <MascotMark size={20} />
            <span><span className="text-ink font-semibold">Quantzy model</span> says: high-conviction cluster forming around <span className="text-ink font-semibold">debates</span> branch.</span>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[10.5px] tracking-wider2 uppercase text-slate2">
            <span className="pulse-dot gold" /> 3 Apex signals · top traders watching
          </span>
        </div>
      </div>

      {/* Floating dopamine notes */}
      <div className="hidden md:block absolute -left-3 top-12 rotate-[-3deg]">
        <div className="hairline rounded-md bg-white px-3 py-1.5 shadow-card text-[11px]">
          <span className="text-positive font-semibold">+18.4%</span> just captured by <span className="text-ink font-semibold">@kaldera</span>
        </div>
      </div>
      <div className="hidden md:block absolute -right-2 -bottom-3 rotate-[2deg]">
        <div className="hairline rounded-md bg-white px-3 py-1.5 shadow-card text-[11px] inline-flex items-center gap-2">
          <PulseDot tone="green" /> <span><span className="text-ink font-semibold">3</span> top traders converging on this branch</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Hero ----------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 surface-paper" />
      <div className="relative max-w-[1280px] mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-12 items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="chip cerulean"><PulseDot /> Closed beta · cohort 03</span>
            <span className="chip">Polymarket · Kalshi · Sports · Crypto</span>
          </div>
          <h1 className="mt-5 font-display text-[64px] leading-[0.98] tracking-tight text-ink">
            Find the <span className="italic-q text-cerulean">edge</span><br />before the market does.
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-slate2 max-w-[58ch]">
            Quantzy is the prediction-market intelligence terminal — a quant model, calibration engine, and social trading arena that ranks every event market by edge, confidence, liquidity, catalyst timing, rules risk, and verified-trader conviction.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Link to="/app" className="btn btn-cerulean">Enter the terminal</Link>
            <Link to="/app/scanner" className="btn btn-primary">Open the Scanner</Link>
            <a href="#missed" className="btn btn-ghost">See missed wins →</a>
          </div>
          <div className="mt-7 grid grid-cols-3 gap-x-6 gap-y-3 max-w-[520px]">
            <Stat label="Resolved samples" value="3,082" />
            <Stat label="Calibrated hit rate" value="78.3%" tone="positive" />
            <Stat label="Avg edge captured" value="+7.4%" tone="cerulean" />
            <Stat label="Markets tracked" value="2,841" />
            <Stat label="Verified traders" value="1,420" />
            <Stat label="Apex signals / wk" value="36" tone="gold" />
          </div>
        </div>

        <div className="relative">
          {/* Mascot peeking from behind the preview */}
          <div className="absolute -top-10 -right-2 z-20 hidden md:block float-y">
            <Mascot size={170} />
          </div>
          <HeroMindMap />
        </div>
      </div>

      {/* Trust marquee */}
      <div className="border-y border-mist bg-platinum/60">
        <div className="max-w-[1280px] mx-auto px-6 py-3 overflow-hidden">
          <div className="marquee-track text-[11px] tracking-wider2 uppercase text-slate2">
            {[...Array(2)].map((_, k) => (
              <span key={k} className="inline-flex items-center gap-8">
                <span>Polymarket</span><span>·</span>
                <span>Kalshi</span><span>·</span>
                <span>PrizePicks</span><span>·</span>
                <span>DraftKings</span><span>·</span>
                <span>Deribit</span><span>·</span>
                <span>Manifold</span><span>·</span>
                <span>Sportsbook books</span><span>·</span>
                <span>Crypto perpetuals</span><span>·</span>
                <span>Macro print desks</span><span>·</span>
                <span>Catalyst calendar</span><span>·</span>
                <span>Calibration audit</span><span>·</span>
                <span>Verified-trader registry</span><span>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, tone = 'ink' }) {
  const cls = tone === 'positive' ? 'text-positive' : tone === 'cerulean' ? 'text-cerulean' : tone === 'gold' ? 'text-[#7E5E22]' : 'text-ink';
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className={`mt-0.5 text-[18px] font-semibold tnum ${cls}`}>{value}</div>
    </div>
  );
}

/* --------------------- "What Quantzy sees" feature grid -------------------- */

function FeatureGrid() {
  const tiles = [
    { k: 'Market price',        v: '51¢', sub: 'Polymarket · live', tone: 'ink' },
    { k: 'Quantzy fair value',  v: '58¢', sub: '76% confidence', tone: 'cerulean' },
    { k: 'Edge',                v: '+7.0%', sub: 'Above floor', tone: 'positive' },
    { k: 'Liquidity',           v: '$12.4M', sub: 'Score 92/100' },
    { k: 'Catalyst timing',     v: '3d', sub: 'Debate window' },
    { k: 'Rules risk',          v: 'Low', sub: 'Audited resolution' },
    { k: 'Social conviction',   v: '71%', sub: '12 top traders agree', tone: 'cerulean' },
    { k: 'Historical calibration', v: '74.8%', sub: '1,204 samples in band', tone: 'gold' },
  ];
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-20" id="scanner">
      <div className="flex items-end justify-between gap-8 mb-8">
        <div>
          <Eyebrow>What Quantzy sees</Eyebrow>
          <h2 className="font-display text-[40px] leading-tight tracking-tight mt-2">
            Eight dimensions. <span className="italic-q text-cerulean">One signal.</span>
          </h2>
          <p className="text-slate2 mt-2 max-w-[60ch]">
            Every market is decomposed into a vector you can audit. We do not show you a pick — we show you the priced reality and let you act on the gap.
          </p>
        </div>
        <Link to="/app/scanner" className="btn btn-ghost hidden md:inline-flex">Open Scanner →</Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
        {tiles.map((t) => {
          const c = t.tone === 'positive' ? 'text-positive' : t.tone === 'cerulean' ? 'text-cerulean' : t.tone === 'gold' ? 'text-[#7E5E22]' : 'text-ink';
          return (
            <div key={t.k} className="hairline rounded-xl bg-white p-4 hover:shadow-lift transition">
              <div className="eyebrow">{t.k}</div>
              <div className={`mt-1 text-[22px] font-semibold tnum ${c}`}>{t.v}</div>
              <div className="text-[11px] text-slate2 mt-0.5">{t.sub}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------ "Why a mind map?" with split layout ------------------- */

function MindMapPitch() {
  return (
    <section className="border-y border-mist surface-platinum">
      <div className="max-w-[1280px] mx-auto px-6 py-20 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 items-center">
        <div>
          <Eyebrow>Why a mind map?</Eyebrow>
          <h2 className="font-display text-[40px] leading-tight tracking-tight mt-2">
            Topics, not <span className="italic-q text-cerulean">isolated tickers.</span>
          </h2>
          <p className="text-slate2 mt-3">
            Prediction markets are fragmented. People don&apos;t think in single contracts — they think in stories: <span className="text-ink font-medium">an election</span>, <span className="text-ink font-medium">a playoff series</span>, <span className="text-ink font-medium">a Fed meeting</span>. Quantzy maps a topic into branches of opportunity, then ranks the leaves where edge actually clusters.
          </p>
          <ul className="mt-5 space-y-2 text-[13px] text-slate2">
            <li className="flex gap-2"><span className="text-cerulean">●</span> Branch thickness encodes liquidity</li>
            <li className="flex gap-2"><span className="text-positive">●</span> Glow intensity encodes edge</li>
            <li className="flex gap-2"><span className="text-gold">●</span> Gold ring marks Apex / premium signals</li>
            <li className="flex gap-2"><span className="text-warn">●</span> Red ring flags resolution-rule risk</li>
            <li className="flex gap-2"><span className="text-cerulean">●</span> Blue halo = you searched this before</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {TOPICS.slice(0, 8).map((t, i) => {
            const tones = ['cerulean', 'gold', 'positive', 'cerulean', 'gold', 'cerulean', 'positive', 'gold'];
            return (
              <div key={t.id} className="hairline rounded-xl bg-white p-3 group hover:shadow-lift transition">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold">{t.label}</div>
                  <span className={`chip ${tones[i % tones.length]}`}>{t.count} mkts</span>
                </div>
                <div className="mt-2 h-9">
                  <Sparkline values={Array.from({ length: 18 }, () => 30 + Math.random() * 40 + i * 2)} width={220} height={36} color="#2563EB" />
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="chip">edge {(2 + Math.random() * 9).toFixed(1)}%</span>
                  <span className="chip cerulean">conf {Math.floor(60 + Math.random() * 25)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------- Social edge layer (testimonials-ish) ---------------- */

function SocialEdge() {
  const ops = [
    { n: 'kaldera',     spec: 'Macro & Fed',      pl: '+18.4%', cal: 96, hit: 71, tier: 'Apex' },
    { n: 'rulesriskQ',  spec: 'Resolution risk',  pl: '+12.6%', cal: 97, hit: 78, tier: 'Apex' },
    { n: 'darkpool88',  spec: 'Crypto ETFs',      pl: '+14.7%', cal: 91, hit: 66, tier: 'Apex' },
    { n: 'oddsoracle',  spec: 'NBA props',        pl: '+9.8%',  cal: 88, hit: 68, tier: 'Gold' },
  ];
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-20" id="social">
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
        <div>
          <Eyebrow>The social edge layer</Eyebrow>
          <h2 className="font-display text-[40px] leading-tight tracking-tight mt-2">
            The model finds it. <span className="italic-q text-cerulean">The community refines it.</span>
          </h2>
          <p className="text-slate2 mt-3">
            Quantzy doesn&apos;t just rank signals — it tracks who acts, who passes, who wins, and who is calibrated. The best operators become signal amplifiers, and the model gets smarter at picking from its own pool.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat label="Quantzy raw hit rate"      value="74.8%" />
            <Stat label="+ top trader confirmation" value="82.6%" tone="positive" />
            <Stat label="Composite uplift"           value="+7.8 pp" tone="cerulean" />
          </div>
          <Link to="/app/social" className="btn btn-primary mt-6 inline-flex">Browse the social hub →</Link>
        </div>

        <div className="hairline rounded-2xl bg-white p-2 shadow-lift">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="eyebrow">Trending operators · this week</div>
            <span className="chip cerulean">Live</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 p-2">
            {ops.map((o) => (
              <div key={o.n} className="hairline rounded-lg p-3 bg-platinum/40 hover:bg-platinum transition">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-ink text-white grid place-items-center text-[12px] font-semibold">{o.n.slice(0,2).toUpperCase()}</div>
                  <div>
                    <div className="text-[13px] font-semibold">@{o.n}</div>
                    <div className="text-[11px] text-slate2">{o.spec} · {o.tier}</div>
                  </div>
                  <span className="ml-auto chip green">{o.pl}</span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-[11px] tnum">
                  <span className="text-slate2">Calibration <span className="text-ink font-semibold">{o.cal}</span></span>
                  <span className="text-slate2">Hit <span className="text-ink font-semibold">{o.hit}%</span></span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <button className="btn btn-ghost btn-xs">Follow</button>
                  <button className="btn btn-ghost btn-xs">Copy %</button>
                  <button className="btn btn-ghost btn-xs">Challenge</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Calibration trust panel ---------------------------- */

function CalibrationPanel() {
  return (
    <section className="border-y border-mist surface-platinum">
      <div className="max-w-[1280px] mx-auto px-6 py-20 grid lg:grid-cols-[1.2fr_1fr] gap-10" id="calib">
        <div className="hairline rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between">
            <div className="eyebrow">Reliability diagram · 3,082 resolved signals</div>
            <span className="chip cerulean">Brier 0.146</span>
          </div>
          <CalibrationDiagram />
          <div className="grid grid-cols-5 gap-2 mt-3">
            {[
              { b: '50–60', n: 412, p: 55.0, a: 53.8 },
              { b: '60–70', n: 528, p: 65.2, a: 64.4 },
              { b: '70–80', n: 612, p: 74.8, a: 75.6 },
              { b: '80–90', n: 388, p: 84.6, a: 83.2 },
              { b: '90+',   n: 142, p: 92.4, a: 91.0 },
            ].map((r) => (
              <div key={r.b} className="hairline rounded-md p-2 bg-platinum/40">
                <div className="eyebrow">{r.b}%</div>
                <div className="text-[12px] mt-0.5 tnum">predicted <span className="font-semibold">{r.p}</span></div>
                <div className="text-[12px] tnum">actual <span className="font-semibold text-positive">{r.a}</span></div>
                <div className="text-[10px] text-slate2 tnum">n={r.n}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Eyebrow>Confidence you can audit</Eyebrow>
          <h2 className="font-display text-[40px] leading-tight tracking-tight mt-2">
            We publish our <span className="italic-q text-cerulean">calibration</span>.
          </h2>
          <p className="text-slate2 mt-3">
            Every confidence band is benchmarked against the actual resolution rate of every signal in that band. When Quantzy says 80%, events resolve at 80% — or we tell you why we slipped.
          </p>
          <ul className="mt-5 space-y-2 text-[13px] text-slate2">
            <li className="flex gap-2"><span className="text-positive">✓</span> Reliability diagram refreshed nightly</li>
            <li className="flex gap-2"><span className="text-positive">✓</span> Brier score & log-loss per category</li>
            <li className="flex gap-2"><span className="text-positive">✓</span> Drawdown & rule-risk performance</li>
            <li className="flex gap-2"><span className="text-positive">✓</span> Public per-signal archive</li>
          </ul>
          <Link to="/app/historical" className="btn btn-primary mt-6 inline-flex">Audit our history →</Link>
        </div>
      </div>
    </section>
  );
}

function CalibrationDiagram() {
  const W = 540, H = 280, P = 36;
  const pts = [
    [55.0, 53.8], [65.2, 64.4], [74.8, 75.6], [84.6, 83.2], [92.4, 91.0],
  ];
  const x = (v) => P + ((v - 50) / 50) * (W - P - 12);
  const y = (v) => H - P - ((v - 50) / 50) * (H - P - 12);
  const path = pts.map((p, i) => (i ? `L ${x(p[0])} ${y(p[1])}` : `M ${x(p[0])} ${y(p[1])}`)).join(' ');
  return (
    <div className="mt-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <rect x="0" y="0" width={W} height={H} fill="#fff" />
        {/* gridlines */}
        {[60, 70, 80, 90].map((g) => (
          <g key={g} opacity="0.5">
            <line x1={x(g)} x2={x(g)} y1={P} y2={H - P} stroke="rgba(11,13,16,0.06)" />
            <line y1={y(g)} y2={y(g)} x1={P} x2={W - 12} stroke="rgba(11,13,16,0.06)" />
            <text x={x(g)} y={H - 14} textAnchor="middle" fontSize="9" fill="#9AA3AE">{g}</text>
            <text x={20} y={y(g) + 3} textAnchor="end" fontSize="9" fill="#9AA3AE">{g}</text>
          </g>
        ))}
        {/* perfect calibration line */}
        <line x1={x(50)} y1={y(50)} x2={x(100)} y2={y(100)} stroke="rgba(37,99,235,0.30)" strokeDasharray="4 4" />
        {/* model curve */}
        <path d={path} fill="none" stroke="#2563EB" strokeWidth="2.2" />
        {pts.map(([px, py], i) => (
          <g key={i}>
            <circle cx={x(px)} cy={y(py)} r="4.5" fill="#fff" stroke="#2563EB" strokeWidth="2" />
          </g>
        ))}
        <text x={W - 18} y={28} fontSize="10" textAnchor="end" fill="#9AA3AE">Predicted % →</text>
        <text x={26} y={26} fontSize="10" fill="#9AA3AE">↑ Actual %</text>
      </svg>
    </div>
  );
}

/* ----------------------- "Compete with the model" ------------------------- */

function CompetePanel() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
        <div>
          <Eyebrow>Compete with the model</Eyebrow>
          <h2 className="font-display text-[40px] leading-tight tracking-tight mt-2">
            Beat Quantzy. <span className="italic-q text-cerulean">Or join it.</span>
          </h2>
          <p className="text-slate2 mt-3">
            Accept, reject, or fade every model call. Submit your own probability and let the resolution speak. Score on calibration, edge captured, timing, and risk-adjusted return — not raw P&amp;L.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Chip tone="cerulean">Accept</Chip>
            <Chip tone="red">Fade</Chip>
            <Chip tone="gold">Beat the band</Chip>
            <Chip>Trader vs trader</Chip>
            <Chip>Team vs team</Chip>
          </div>
          <Link to="/app/challenges" className="btn btn-primary mt-6 inline-flex">Enter the challenge arena →</Link>
        </div>

        <div className="hairline rounded-2xl bg-white p-5 shadow-lift">
          <div className="flex items-center justify-between">
            <div className="eyebrow">Head-to-head · this week</div>
            <span className="chip cerulean">Round 12 · Macro</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="rounded-lg surface-platinum hairline p-4 text-center">
              <div className="eyebrow">Quantzy</div>
              <div className="font-display text-[34px] mt-1">22%</div>
              <div className="text-[11px] text-slate2">Confidence band 64–78</div>
              <div className="mt-3"><ConfBand value={22} /></div>
              <div className="mt-3 text-[11px] text-positive font-semibold">Won 4 of last 7</div>
            </div>
            <div className="rounded-lg hairline p-4 text-center bg-gradient-to-br from-white to-[#fdfaf0]">
              <div className="eyebrow">@kaldera</div>
              <div className="font-display text-[34px] mt-1">15%</div>
              <div className="text-[11px] text-slate2">Submitted · 14:02 UTC</div>
              <div className="mt-3"><ConfBand value={15} /></div>
              <div className="mt-3 text-[11px] text-warn font-semibold">Closer by 4.8% if &lt;20</div>
            </div>
          </div>
          <div className="mt-3 hairline rounded-lg p-3 bg-platinum/40">
            <div className="text-[12px] text-slate2">Market: <span className="text-ink font-semibold">Fed cuts 25bps at June meeting</span></div>
            <div className="text-[11px] text-slate2 mt-0.5">Resolves in 38d · Kalshi · Macro</div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="hairline rounded-md p-2"><div className="eyebrow">Streak</div><div className="text-[14px] font-semibold tnum">9W</div></div>
            <div className="hairline rounded-md p-2"><div className="eyebrow">Calibration</div><div className="text-[14px] font-semibold tnum">96</div></div>
            <div className="hairline rounded-md p-2"><div className="eyebrow">League</div><div className="text-[14px] font-semibold">Apex</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Missed wins (urgency) ----------------------------- */

function MissedSection() {
  return (
    <section className="border-y border-mist surface-platinum" id="missed">
      <div className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="flex items-end justify-between gap-8 mb-6">
          <div>
            <Eyebrow>You almost had this</Eyebrow>
            <h2 className="font-display text-[40px] leading-tight tracking-tight mt-2">
              Missed wins, <span className="italic-q text-cerulean">recovered.</span>
            </h2>
            <p className="text-slate2 mt-2 max-w-[60ch]">
              When you search, watch, or skip a market that later moves, Quantzy records it — not to shame, to retrain. Your instincts become data.
            </p>
          </div>
          <Link to="/app/missed" className="btn btn-ghost hidden md:inline-flex">Open missed-wins ledger →</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {[
            { mkt: 'BTC > $70k by Apr 1',    when: '12 days ago', action: 'Searched, did not act',    edge: '+12.4%', move: '+31¢', pot: '$1,840', tier: 'Standard' },
            { mkt: 'Senate D win majority',  when: '20 days ago', action: 'Watched, dismissed',       edge: '+8.1%',  move: '+18¢', pot: '$760',   tier: 'Standard' },
            { mkt: 'AAPL beat by >5%',       when: '14 days ago', action: 'Searched',                 edge: '+9.7%',  move: '+22¢', pot: '$1,210', tier: 'Apex' },
          ].map((m, i) => (
            <div key={i} className="hairline rounded-2xl bg-white p-4 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.10), transparent 70%)' }} />
              <div className="flex items-center justify-between">
                <span className="chip">Missed · {m.when}</span>
                {m.tier === 'Apex' ? <span className="chip gold">Apex-locked</span> : <span className="chip cerulean">Standard</span>}
              </div>
              <div className="text-[14px] font-semibold mt-2 leading-tight">{m.mkt}</div>
              <div className="text-[11px] text-slate2 mt-0.5">You: <span className="text-ink">{m.action}</span></div>
              <div className="mt-3 hairline rounded-lg p-3 bg-platinum/40 grid grid-cols-3 gap-2">
                <div><div className="eyebrow">Edge then</div><div className="font-semibold tnum">{m.edge}</div></div>
                <div><div className="eyebrow">Move</div><div className="font-semibold tnum text-warn">{m.move}</div></div>
                <div><div className="eyebrow">Potential</div><div className="font-semibold tnum text-positive">{m.pot}</div></div>
              </div>
              <div className="mt-3 flex gap-1.5">
                <button className="btn btn-ghost btn-xs">Set this alert</button>
                <button className="btn btn-ghost btn-xs">Follow niche</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Public edge feed (proof scroll) ------------------- */

function PublicFeed() {
  const items = SIGNALS.slice(0, 6).map((s, i) => ({ ...s, when: `${(i + 1) * 7}m ago` }));
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-20" id="feed">
      <div className="flex items-end justify-between gap-8 mb-6">
        <div>
          <Eyebrow>Public proof feed</Eyebrow>
          <h2 className="font-display text-[40px] leading-tight tracking-tight mt-2">
            Live, but <span className="italic-q text-cerulean">delayed.</span>
          </h2>
          <p className="text-slate2 mt-2 max-w-[60ch]">
            A read-only window into the terminal. Real-time signals, top-trader activity, and resolutions — delayed enough to keep the edge inside the membership.
          </p>
        </div>
        <span className="chip cerulean hidden md:inline-flex"><PulseDot /> Tape · 30-min delay</span>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((s) => (
          <div key={s.id} className={`hairline rounded-xl bg-white p-4 ${s.tier === 'apex' ? 'gold-frame' : ''}`}>
            <div className="flex items-center gap-2">
              <span className="chip">{s.venue}</span>
              <span className="chip cerulean">{s.subtopic}</span>
              {s.tier === 'apex' && <span className="chip gold">Apex</span>}
              <span className="ml-auto text-[10.5px] tracking-wider2 uppercase text-slate2">{s.when}</span>
            </div>
            <div className="text-[13.5px] font-semibold mt-2 leading-tight">{s.market}</div>
            <div className="grid grid-cols-[1fr_minmax(140px,160px)] gap-3 mt-3 items-center">
              <EdgeBar market={s.marketPct} fair={s.fairPct} />
              <Sparkline values={s.spark} width={150} height={28} color="#2563EB" />
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2 text-[11px]">
              <div><div className="eyebrow">Edge</div><div className="text-positive font-semibold tnum">+{s.edgePct}%</div></div>
              <div><div className="eyebrow">Conf</div><div className="font-semibold tnum">{s.confidence}%</div></div>
              <div><div className="eyebrow">Liq</div><div className="font-semibold tnum">{s.liquidity}</div></div>
              <div><div className="eyebrow">Resolves</div><div className="font-semibold tnum">{s.timeLeft}</div></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- Final CTA --------------------------------- */

function FinalCTA() {
  return (
    <section className="surface-obsidian text-white">
      <div className="max-w-[1280px] mx-auto px-6 py-24 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
        <div>
          <span className="chip dark"><PulseDot tone="gold" /> Apex cohort opens · June 12</span>
          <h2 className="font-display text-[48px] leading-tight tracking-tight mt-3">
            The edge is not <span className="italic-q text-gold">found.</span><br />
            It is <span className="italic-q text-gold">engineered.</span>
          </h2>
          <p className="text-white/70 mt-4 max-w-[60ch]">
            Quantzy finds the priced reality across every market that matters, ranks where the edge lives, and lets you compete against the model and the crowd in real time.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link to="/app" className="btn btn-gold">Enter the terminal</Link>
            <Link to="/pricing" className="btn btn-ghost !text-white !bg-white/8 !border-white/14 hover:!bg-white/12">See pricing</Link>
            <Link to="/methodology" className="btn btn-ghost !text-white/80 !bg-transparent !border-white/14">Methodology</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="hairline-dark rounded-xl p-4 bg-white/5"><div className="eyebrow text-white/60">Standard</div><div className="font-display text-[32px] mt-1">$99<span className="text-[14px] text-white/50">/mo</span></div><div className="text-[12px] text-white/65 mt-1">Live scanner · alerts · social trading</div></div>
          <div className="rounded-xl p-4 gold-frame bg-gradient-to-br from-[#1E1408] to-[#0B0D10]"><div className="eyebrow text-gold">Apex</div><div className="font-display text-[32px] mt-1">$250<span className="text-[14px] text-white/50">/mo</span></div><div className="text-[12px] text-white/65 mt-1">Premium branches · vault · captains</div></div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Footer ------------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-mist surface-paper">
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8">
        <div>
          <Logo size={20} />
          <p className="text-[12px] text-slate2 mt-3 max-w-[40ch]">
            Quantzy is a research and intelligence platform. Nothing here is a recommendation to trade. Verify resolution rules and venue compliance in your jurisdiction.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-2">Product</div>
          <ul className="space-y-1.5 text-[13px] text-slate2">
            <li><Link to="/app/scanner">Scanner</Link></li>
            <li><Link to="/app/feed">Edge Feed</Link></li>
            <li><Link to="/app/historical">Calibration</Link></li>
            <li><Link to="/app/social">Social Hub</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-2">Company</div>
          <ul className="space-y-1.5 text-[13px] text-slate2">
            <li><Link to="/methodology">Methodology</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><a href="#missed">Public proof</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-2">Legal</div>
          <ul className="space-y-1.5 text-[13px] text-slate2">
            <li><a href="#">Risk disclosure</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Disclosures</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-mist">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between text-[11px] text-slate1">
          <span>© MMXXVI Quantzy · all times UTC</span>
          <span className="font-mono tnum">model build · q-04.7-c</span>
        </div>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <div>
      <MarketingNav />
      <Hero />
      <FeatureGrid />
      <MindMapPitch />
      <SocialEdge />
      <CalibrationPanel />
      <CompetePanel />
      <MissedSection />
      <PublicFeed />
      <FinalCTA />
      <Footer />
    </div>
  );
}
