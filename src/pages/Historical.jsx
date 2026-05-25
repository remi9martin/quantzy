import { Eyebrow, Sparkline } from '../components/UI.jsx';
import { CALIB, CATEGORIES, SIGNALS } from '../data/markets.js';

function CalibrationDiagram({ data }) {
  const W = 640, H = 320, P = 40;
  const x = (v) => P + ((v - 50) / 50) * (W - P - 16);
  const y = (v) => H - P - ((v - 50) / 50) * (H - P - 12);
  const path = data.map((d, i) => (i ? `L ${x(d.predicted)} ${y(d.actual)}` : `M ${x(d.predicted)} ${y(d.actual)}`)).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[60, 70, 80, 90].map((g) => (
        <g key={g}>
          <line x1={x(g)} x2={x(g)} y1={20} y2={H - P} stroke="rgba(255,255,255,0.05)" />
          <line y1={y(g)} y2={y(g)} x1={P} x2={W - 16} stroke="rgba(255,255,255,0.05)" />
          <text x={x(g)} y={H - 18} textAnchor="middle" fontSize="9.5" fill="#9AA3AE">{g}%</text>
          <text x={28} y={y(g) + 3} textAnchor="end" fontSize="9.5" fill="#9AA3AE">{g}</text>
        </g>
      ))}
      <line x1={x(50)} y1={y(50)} x2={x(100)} y2={y(100)} stroke="rgba(37,99,235,0.30)" strokeDasharray="4 4" />
      <path d={path} fill="none" stroke="#2563EB" strokeWidth="2.5" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(d.predicted)} cy={y(d.actual)} r="6" fill="#1A1D24" stroke="#2563EB" strokeWidth="2.5" />
          <text x={x(d.predicted)} y={y(d.actual) - 12} textAnchor="middle" fontSize="9.5" fill="#FFFFFF" fontWeight="600">n={d.n}</text>
        </g>
      ))}
      <text x={W - 24} y={28} fontSize="10.5" textAnchor="end" fill="#6B7280">Predicted % →</text>
      <text x={36} y={26} fontSize="10.5" fill="#6B7280">↑ Actual %</text>
    </svg>
  );
}

export function Historical() {
  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1600px] mx-auto space-y-5">
      <div>
        <Eyebrow>Historical performance</Eyebrow>
        <h1 className="font-display text-[32px] tracking-tight leading-tight">Confidence you can audit.</h1>
        <p className="text-[13px] text-slate1 mt-0.5 max-w-[60ch]">Every confidence band is benchmarked against the actual resolution rate of every signal in that band. We publish the math and let it stand on its own.</p>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <div className="hairline rounded-2xl bg-carbon p-5">
          <div className="flex items-center justify-between mb-2">
            <Eyebrow>Reliability diagram · 3,082 resolved</Eyebrow>
            <span className="chip cerulean">Brier 0.146 · Slope 0.98</span>
          </div>
          <CalibrationDiagram data={CALIB} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Tile k="Resolved" v="3,082" />
          <Tile k="Hit rate" v="78.3%" c="text-positive" />
          <Tile k="Avg edge captured" v="+7.4%" c="text-cerulean" />
          <Tile k="ROI · paper" v="+48.2%" c="text-positive" />
          <Tile k="Brier" v="0.146" />
          <Tile k="Log loss" v="0.412" />
          <Tile k="Best cat" v="Macro" />
          <Tile k="Weakest" v="Culture" />
        </div>
      </div>

      <div className="hairline rounded-2xl bg-carbon">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Eyebrow>Confidence-band table</Eyebrow>
          <span className="text-[11px] text-slate1">Last refresh · 2h ago</span>
        </div>
        <table className="w-full text-[12px]">
          <thead className="text-slate1">
            <tr><th className="py-2 px-4 text-left">Bucket</th><th>n</th><th>Expected</th><th>Actual</th><th>Diff</th><th>ROI</th><th>Avg liq</th><th>Brier</th><th className="pr-4">Reliability</th></tr>
          </thead>
          <tbody>
            {CALIB.map((r) => (
              <tr key={r.bucket} className="border-t border-white/10">
                <td className="py-2 px-4 font-semibold">{r.bucket}</td>
                <td className="tnum">{r.n}</td>
                <td className="tnum">{r.predicted.toFixed(1)}%</td>
                <td className="tnum text-positive">{r.actual.toFixed(1)}%</td>
                <td className={`tnum ${(r.actual - r.predicted) >= 0 ? 'text-positive' : 'text-warn'}`}>
                  {(r.actual - r.predicted).toFixed(1)} pp
                </td>
                <td className="tnum text-positive">+{(r.predicted - 50 + r.actual / 5).toFixed(1)}%</td>
                <td className="tnum">$1.4M</td>
                <td className="tnum">{(0.20 - r.actual / 800).toFixed(3)}</td>
                <td className="pr-4"><span className="chip green">A+</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="hairline rounded-2xl bg-carbon p-5">
          <Eyebrow>Category performance</Eyebrow>
          <ul className="mt-3 space-y-2">
            {CATEGORIES.map((c) => (
              <li key={c.topic} className="grid grid-cols-[140px_minmax(0,1fr)_120px] items-center gap-3 text-[12px]">
                <span className="font-medium">{c.topic}</span>
                <div className="h-1.5 bg-white/10 rounded">
                  <div className="h-1.5 rounded" style={{ width: `${c.hit}%`, background: c.color }} />
                </div>
                <span className="tnum text-slate1 text-right">+{c.edge}% edge · {c.hit}% hit · {c.samples}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hairline rounded-2xl bg-carbon p-5">
          <Eyebrow>Social amplification</Eyebrow>
          <ul className="mt-3 text-[12.5px] space-y-2">
            <li className="grid grid-cols-[1fr_auto] gap-2"><span>Quantzy raw</span><span className="font-semibold tnum">74.8%</span></li>
            <li className="grid grid-cols-[1fr_auto] gap-2"><span>+ broad consensus</span><span className="font-semibold tnum">76.2%</span></li>
            <li className="grid grid-cols-[1fr_auto] gap-2"><span>+ top-decile traders</span><span className="font-semibold tnum text-positive">82.6%</span></li>
            <li className="grid grid-cols-[1fr_auto] gap-2"><span>Quantzy contrarian to crowd</span><span className="font-semibold tnum text-cerulean">71.4%</span></li>
            <li className="grid grid-cols-[1fr_auto] gap-2"><span>Top traders fade Quantzy</span><span className="font-semibold tnum text-warn">58.9%</span></li>
          </ul>
          <div className="mt-3 hairline rounded-md p-3 bg-white/5 text-[12px]">
            Signals with top-decile trader confirmation outperform raw Quantzy by <span className="text-positive font-semibold">+7.8 pp</span> over 1,204 resolved samples.
          </div>
        </div>
      </div>

      <div className="hairline rounded-2xl bg-carbon">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Eyebrow>Signal archive</Eyebrow>
          <span className="text-[11px] text-slate1">Showing last 12</span>
        </div>
        <table className="w-full text-[11.5px]">
          <thead className="text-slate1">
            <tr><th className="py-2 px-4 text-left">Date</th><th className="text-left">Market</th><th>Venue</th><th>Conf</th><th>Mkt</th><th>Fair</th><th>Edge</th><th>Outcome</th><th className="pr-4">P/L</th></tr>
          </thead>
          <tbody>
            {SIGNALS.map((s, i) => (
              <tr key={s.id} className="border-t border-white/10">
                <td className="py-1.5 px-4 tnum text-slate1">2026-04-{(i + 12).toString().padStart(2, '0')}</td>
                <td className="truncate max-w-[260px]">{s.market}</td>
                <td>{s.venue}</td>
                <td className="tnum">{s.confidence}%</td>
                <td className="tnum">{s.marketPct}¢</td>
                <td className="tnum">{s.fairPct}¢</td>
                <td className="tnum text-positive">+{s.edgePct}%</td>
                <td>{i % 4 === 3 ? <span className="chip red">No</span> : <span className="chip green">Yes</span>}</td>
                <td className={`tnum pr-4 ${i % 4 === 3 ? 'text-negative' : 'text-positive'}`}>
                  {i % 4 === 3 ? '-2.4%' : `+${(s.edgePct * 0.7).toFixed(1)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Tile({ k, v, c = 'text-white' }) {
  return (
    <div className="hairline rounded-xl bg-carbon p-3.5">
      <div className="eyebrow">{k}</div>
      <div className={`mt-1 text-[20px] font-semibold tnum ${c}`}>{v}</div>
    </div>
  );
}
