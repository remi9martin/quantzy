import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Chip, PulseDot, Sparkline, EdgeBar, ConfBand, Tabs, MiniGauge, Arrow } from '../components/UI.jsx';
import { TRADERS, SIGNALS } from '../data/markets.js';

/* -------------------------------------------------------------------------- */
/* Featured-trader hero rail                                                  */
/* -------------------------------------------------------------------------- */

function TraderHeroCard({ t, primary }) {
  return (
    <div className={`hairline rounded-2xl p-4 ${primary ? 'bg-gradient-to-br from-cerulean/10 to-white shadow-lift' : 'bg-white'} relative overflow-hidden`}>
      {primary && <div className="absolute top-0 right-0 chip cerulean rounded-tr-none rounded-br-none rounded-tl-none">Featured · {t.specialty}</div>}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-ink text-white grid place-items-center text-[14px] font-semibold">{t.name.slice(0,2).toUpperCase()}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">@{t.name}</span>
            <span className={`chip ${t.tier === 'Apex' ? 'gold' : t.tier === 'Platinum' ? 'cerulean' : ''}`}>{t.tier}</span>
          </div>
          <div className="text-[11.5px] text-slate2">{t.specialty} · {t.followers.toLocaleString()} followers</div>
        </div>
        <div className="text-right">
          <div className="text-[18px] font-semibold tnum text-positive">+{t.roi}%</div>
          <div className="text-[10.5px] text-slate2">90d ROI</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <MiniGauge value={t.calib} label="Calibration" />
        <div className="hairline rounded-md p-2"><div className="eyebrow">Hit rate</div><div className="font-semibold tnum">{t.hit}%</div><div className="text-[10px] text-slate2">{t.samples} samples</div></div>
        <div className="hairline rounded-md p-2"><div className="eyebrow">Streak</div><div className="font-semibold">{t.streak}</div><div className="text-[10px] text-slate2">DD {t.drawdown}%</div></div>
      </div>

      <div className="mt-3">
        <Sparkline values={Array.from({ length: 20 }, (_, i) => 50 + Math.sin(i / 2) * 10 + i * 1.2)} width={400} height={32} color="#2563EB" />
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <Link to={`/app/trader/${t.name}`} className="btn btn-primary btn-sm">View profile</Link>
        <button className="btn btn-cerulean btn-sm">Follow</button>
        <button className="btn btn-ghost btn-sm">Copy %</button>
        <button className="btn btn-ghost btn-sm">Challenge</button>
      </div>
    </div>
  );
}

function FeaturedRail() {
  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr_1fr] gap-3">
      <TraderHeroCard t={TRADERS[0]} primary />
      <TraderHeroCard t={TRADERS[4]} />
      <TraderHeroCard t={TRADERS[6]} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Trending operators carousel                                                */
/* -------------------------------------------------------------------------- */

function TrendingCarousel() {
  const items = TRADERS.slice(2, 10);
  return (
    <div className="hairline rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <Eyebrow>Trending operators · this week</Eyebrow>
        <div className="flex items-center gap-1.5">
          <button className="btn btn-ghost btn-xs">Hot streak</button>
          <button className="btn btn-ghost btn-xs">Rising</button>
          <button className="btn btn-ghost btn-xs">Calibrators</button>
          <button className="btn btn-ghost btn-xs">Faders</button>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory">
        {items.map((t) => (
          <div key={t.name} className="snap-start shrink-0 w-[260px] hairline rounded-xl bg-platinum/40 p-3 hover:bg-platinum transition">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-ink text-white grid place-items-center text-[12px] font-semibold">{t.name.slice(0,2).toUpperCase()}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-semibold">@{t.name}</div>
                <div className="text-[10.5px] text-slate2">{t.specialty}</div>
              </div>
              <span className="chip green">+{t.roi}%</span>
            </div>
            <div className="mt-2 h-9">
              <Sparkline values={Array.from({ length: 18 }, (_, i) => 50 + Math.sin(i / 2 + t.followers) * 15 + i)} width={240} height={36} color="#2563EB" />
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10.5px] mt-1.5">
              <div><div className="eyebrow">Hit</div><div className="font-semibold tnum">{t.hit}%</div></div>
              <div><div className="eyebrow">Cal</div><div className="font-semibold tnum">{t.calib}</div></div>
              <div><div className="eyebrow">Streak</div><div className="font-semibold">{t.streak}</div></div>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <button className="btn btn-cerulean btn-xs">Follow</button>
              <button className="btn btn-ghost btn-xs">Copy %</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Copy-trade configurator (R2-i5)                                            */
/* -------------------------------------------------------------------------- */

function CopyTradeConfig() {
  const [trader, setTrader]   = useState(TRADERS[0].name);
  const [pct, setPct]         = useState(10);
  const [edgeMin, setEdge]    = useState(5);
  const [confMin, setConf]    = useState(65);
  const [maxPerSig, setMps]   = useState(3);
  const [rulesSafe, setRules] = useState(true);
  const [bankroll, setBnk]    = useState(5000);

  const sel = TRADERS.find((t) => t.name === trader) || TRADERS[0];

  // Dry-run simulation: take last 14 of trader's "calls" (synthesized) and apply gates.
  const sim = useMemo(() => {
    const calls = SIGNALS.map((s, i) => ({
      id: s.id,
      label: s.market,
      edge: s.edgePct,
      conf: s.confidence,
      pl: (Math.sin(i + sel.calib) * 0.06 + sel.roi / 200),
      passes: s.edgePct >= edgeMin && s.confidence >= confMin && (!rulesSafe || s.rulesRisk !== 'High'),
    }));
    const taken = calls.filter((c) => c.passes).slice(0, 12);
    const totalPl = taken.reduce((acc, c) => acc + c.pl, 0);
    const dollars = bankroll * (pct / 100) * totalPl;
    return { calls, taken, totalPl, dollars };
  }, [trader, pct, edgeMin, confMin, rulesSafe, bankroll, sel]);

  return (
    <div className="hairline rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eyebrow>Copy-trade configurator</Eyebrow>
          <span className="chip cerulean">Mirror · paper-track first</span>
        </div>
        <span className="text-[11px] text-slate2">Dry-run uses last 30d</span>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-4">
        {/* Form */}
        <div className="hairline rounded-xl p-4 bg-platinum/30 space-y-3">
          <div>
            <div className="eyebrow mb-1">Operator</div>
            <select value={trader} onChange={(e) => setTrader(e.target.value)} className="w-full bg-white hairline rounded-md text-[13px] px-2 h-9">
              {TRADERS.map((t) => <option key={t.name} value={t.name}>@{t.name} — {t.specialty} · {t.tier}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Bankroll" value={`$${bankroll.toLocaleString()}`}>
              <input type="range" min={500} max={50000} step={500} value={bankroll}
                onChange={(e) => setBnk(parseInt(e.target.value))} className="w-full accent-cerulean" />
            </Field>
            <Field label={`Mirror ${pct}% of bankroll`}>
              <input type="range" min={1} max={50} step={1} value={pct}
                onChange={(e) => setPct(parseInt(e.target.value))} className="w-full accent-cerulean" />
            </Field>
            <Field label={`Min edge ${edgeMin}%`}>
              <input type="range" min={0} max={20} step={0.5} value={edgeMin}
                onChange={(e) => setEdge(parseFloat(e.target.value))} className="w-full accent-cerulean" />
            </Field>
            <Field label={`Min confidence ${confMin}%`}>
              <input type="range" min={50} max={95} step={1} value={confMin}
                onChange={(e) => setConf(parseInt(e.target.value))} className="w-full accent-cerulean" />
            </Field>
            <Field label={`Max ${maxPerSig}% per signal`}>
              <input type="range" min={1} max={20} step={0.5} value={maxPerSig}
                onChange={(e) => setMps(parseFloat(e.target.value))} className="w-full accent-cerulean" />
            </Field>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[12px] text-slate2">Skip rules-risky markets</span>
              <button onClick={() => setRules(!rulesSafe)} className={`w-9 h-5 rounded-full p-0.5 ${rulesSafe ? 'bg-cerulean' : 'bg-haze'}`}>
                <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${rulesSafe ? 'translate-x-4' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button className="btn btn-cerulean btn-sm">Save preset</button>
            <button className="btn btn-primary btn-sm">Activate (paper)</button>
            <button className="btn btn-ghost btn-sm">Reset</button>
          </div>
        </div>

        {/* Dry run */}
        <div className="hairline rounded-xl p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="eyebrow">30-day dry-run</div>
            <span className="chip green">+{(sim.totalPl * 100).toFixed(1)}%</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="font-display text-[34px] tracking-tight tnum text-positive">
              {sim.dollars >= 0 ? '+' : ''}${sim.dollars.toFixed(0)}
            </div>
            <div className="text-[11px] text-slate2">simulated · {sim.taken.length} mirrored</div>
          </div>
          <div className="mt-2"><Sparkline values={sim.calls.map((c, i) => 50 + i * 1.4 + Math.sin(i + sel.calib) * 6)} width={400} height={36} color="#10B981" /></div>

          <div className="mt-3 hairline rounded-md overflow-hidden">
            <table className="w-full text-[11.5px]">
              <thead className="bg-platinum/40"><tr className="text-left text-slate2">
                <th className="py-1.5 px-2">Mirrored</th>
                <th>Edge</th><th>Conf</th><th className="text-right pr-2">P/L</th>
              </tr></thead>
              <tbody>
                {sim.taken.map((c) => (
                  <tr key={c.id} className="border-t border-mist">
                    <td className="py-1 px-2 truncate max-w-[180px]">{c.label}</td>
                    <td className="text-positive tnum">+{c.edge}%</td>
                    <td className="tnum">{c.conf}%</td>
                    <td className={`text-right pr-2 tnum font-semibold ${c.pl >= 0 ? 'text-positive' : 'text-negative'}`}>
                      {c.pl >= 0 ? '+' : ''}{(c.pl * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="hairline rounded-md p-2"><div className="eyebrow">Hit</div><div className="font-semibold tnum">{Math.max(50, sel.hit - 4)}%</div></div>
            <div className="hairline rounded-md p-2"><div className="eyebrow">Brier</div><div className="font-semibold tnum">{sel.brier.toFixed(3)}</div></div>
            <div className="hairline rounded-md p-2"><div className="eyebrow">DD</div><div className="font-semibold tnum">{sel.drawdown}%</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, children }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11.5px]">
        <span className="text-slate2">{label}</span>
        {value && <span className="tnum text-ink font-semibold">{value}</span>}
      </div>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Trader vs trader competition (R2-i6)                                       */
/* -------------------------------------------------------------------------- */

function H2HBracket() {
  const matches = [
    { a: TRADERS[0], b: TRADERS[1], cat: 'Macro',  scoreA: 8.2, scoreB: 6.4, status: 'live' },
    { a: TRADERS[4], b: TRADERS[2], cat: 'Rules · NBA', scoreA: 7.4, scoreB: 7.1, status: 'live' },
    { a: TRADERS[6], b: TRADERS[3], cat: 'Crypto · CPI', scoreA: 9.0, scoreB: 5.8, status: 'final' },
    { a: TRADERS[7], b: TRADERS[5], cat: 'Calibration', scoreA: 6.4, scoreB: 6.6, status: 'live' },
    { a: TRADERS[8], b: TRADERS[9], cat: 'Sports CLV',  scoreA: 8.8, scoreB: 8.6, status: 'final' },
  ];
  const finals = [
    { a: TRADERS[6], b: TRADERS[4], cat: 'Quarter · 14:00 UTC' },
    { a: TRADERS[8], b: TRADERS[0], cat: 'Quarter · 17:00 UTC' },
  ];
  return (
    <div className="hairline rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eyebrow>Trader vs trader · weekly bracket</Eyebrow>
          <span className="chip cerulean">Season 04 · Week 11</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate2">Prize pool</span>
          <span className="font-semibold tnum">$24,800</span>
          <button className="btn btn-cerulean btn-sm">Accept challenge</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-2">
          {matches.map((m, i) => (
            <div key={i} className="hairline rounded-xl bg-platinum/30 p-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <Side trader={m.a} score={m.scoreA} winning={m.scoreA > m.scoreB} />
              <div className="text-center">
                <div className="eyebrow">{m.cat}</div>
                <div className="font-display text-[22px] tnum mt-0.5">vs</div>
                <div className={`text-[10.5px] mt-0.5 ${m.status === 'live' ? 'text-cerulean' : 'text-slate2'}`}>
                  {m.status === 'live' ? <span className="inline-flex items-center gap-1"><PulseDot /> Live</span> : 'Final'}
                </div>
              </div>
              <Side trader={m.b} score={m.scoreB} winning={m.scoreB > m.scoreA} alignRight />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="hairline rounded-xl bg-gradient-to-br from-[#fffaee] to-white p-3 gold-frame">
            <div className="eyebrow text-[#7E5E22]">Quarter-finals · today</div>
            <ul className="mt-2 space-y-1.5">
              {finals.map((f, i) => (
                <li key={i} className="flex items-center justify-between text-[12px]">
                  <span>@{f.a.name} <span className="text-slate2">vs</span> @{f.b.name}</span>
                  <span className="text-[10.5px] text-slate2">{f.cat}</span>
                </li>
              ))}
            </ul>
            <button className="btn btn-gold btn-xs w-full mt-2">Set reminder</button>
          </div>

          <div className="hairline rounded-xl bg-white p-3">
            <div className="eyebrow mb-1.5">Live score · season</div>
            <ul className="text-[12px] space-y-1.5">
              <li className="flex items-center justify-between"><span>@kaldera</span><span className="font-semibold tnum">142</span></li>
              <li className="flex items-center justify-between"><span>@rulesriskQ</span><span className="font-semibold tnum">128</span></li>
              <li className="flex items-center justify-between"><span>@darkpool88</span><span className="font-semibold tnum">119</span></li>
              <li className="flex items-center justify-between"><span>@closing-line</span><span className="font-semibold tnum">114</span></li>
            </ul>
            <Link to="/app/leaderboard" className="text-[12px] text-cerulean font-semibold mt-2 inline-flex items-center gap-1">Full standings <Arrow size={12} /></Link>
          </div>

          <div className="hairline rounded-xl bg-white p-3">
            <div className="eyebrow mb-1.5">Finished rounds · archive</div>
            <ul className="text-[11.5px] space-y-1 text-slate2">
              <li>W10 · @rulesriskQ d. @kaldera (Macro)</li>
              <li>W09 · @oddsoracle d. @darkpool88 (NBA)</li>
              <li>W08 · @closing-line d. @fadeking (CLV)</li>
              <li>W07 · @kaldera d. @gridsearch (CPI)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Side({ trader, score, winning, alignRight }) {
  return (
    <div className={`flex items-center gap-2.5 ${alignRight ? 'flex-row-reverse text-right' : ''}`}>
      <div className="h-9 w-9 rounded-full bg-ink text-white grid place-items-center text-[12px] font-semibold">{trader.name.slice(0,2).toUpperCase()}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-semibold">@{trader.name}</div>
        <div className="text-[10.5px] text-slate2">{trader.specialty}</div>
        <div className={`mt-1 font-display text-[22px] tnum ${winning ? 'text-positive' : 'text-slate2'}`}>{score.toFixed(1)}</div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Roles legend                                                               */
/* -------------------------------------------------------------------------- */

function RolesGrid() {
  const roles = [
    { k: 'Signal Takers',     d: 'Act on Quantzy signals',          n: 4128 },
    { k: 'Curators',          d: 'Build niche watchlists',          n: 612 },
    { k: 'Faders',            d: 'Profit by disagreeing',           n: 284 },
    { k: 'Specialists',       d: 'Master one niche',                n: 412 },
    { k: 'Captains',          d: 'Run squads · publish picks',      n: 84 },
    { k: 'Calibration Kings', d: 'Probabilities you can trust',     n: 36 },
  ];
  return (
    <div className="hairline rounded-2xl bg-white p-4">
      <Eyebrow>Roles</Eyebrow>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
        {roles.map((r) => (
          <div key={r.k} className="hairline rounded-md bg-platinum/30 p-2.5">
            <div className="text-[12.5px] font-semibold">{r.k}</div>
            <div className="text-[11px] text-slate2">{r.d}</div>
            <div className="text-[10.5px] text-cerulean tnum mt-0.5">{r.n.toLocaleString()} active</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function Social() {
  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1600px] mx-auto space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Eyebrow>Social trading hub</Eyebrow>
          <h1 className="font-display text-[32px] leading-tight tracking-tight">Where elite traders sharpen the model.</h1>
          <p className="text-[13px] text-slate2 mt-0.5 max-w-[60ch]">Follow operators with verified calibration. Mirror their picks with risk caps. Compete weekly. Quantzy finds the edge — the community refines it.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/leaderboard" className="btn btn-ghost btn-sm">League standings</Link>
          <Link to="/app/teams" className="btn btn-cerulean btn-sm">Open Teams</Link>
        </div>
      </div>

      <FeaturedRail />
      <TrendingCarousel />
      <CopyTradeConfig />
      <H2HBracket />
      <RolesGrid />
    </div>
  );
}
