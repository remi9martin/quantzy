import { useParams, Link } from 'react-router-dom';
import { Eyebrow, Sparkline, MiniGauge } from '../components/UI.jsx';
import { TRADERS, SIGNALS } from '../data/markets.js';

export function TraderProfile() {
  const { name } = useParams();
  const t = TRADERS.find((x) => x.name === name) || TRADERS[0];
  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1400px] mx-auto space-y-5">
      <div className="hairline rounded-2xl bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-ink text-white grid place-items-center text-[18px] font-semibold">{t.name.slice(0,2).toUpperCase()}</div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[28px] tracking-tight">@{t.name}</h1>
            <div className="text-[12px] text-slate2">{t.specialty} · {t.followers.toLocaleString()} followers · {t.tier}</div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-cerulean btn-sm">Follow</button>
            <button className="btn btn-primary btn-sm">Copy %</button>
            <Link to="/app/challenges" className="btn btn-ghost btn-sm">Challenge</Link>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          <Tile k="ROI · 90d" v={`+${t.roi}%`} c="text-positive" />
          <Tile k="Hit rate" v={`${t.hit}%`} />
          <Tile k="Calibration" v={t.calib} c="text-cerulean" />
          <Tile k="Brier" v={t.brier.toFixed(3)} />
          <Tile k="Streak" v={t.streak} c="text-positive" />
          <Tile k="Drawdown" v={`${t.drawdown}%`} />
        </div>
        <div className="mt-4">
          <Sparkline values={Array.from({ length: 30 }, (_, i) => 50 + i * 1.1 + Math.sin(i / 1.4 + t.calib) * 8)} width={1000} height={56} color="#2563EB" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="hairline rounded-2xl bg-white p-5">
          <Eyebrow>Recent calls</Eyebrow>
          <table className="w-full mt-2 text-[12px]">
            <thead className="text-slate2"><tr><th className="text-left py-1.5">Market</th><th>Stance</th><th>Edge</th><th>Conf</th><th>Outcome</th><th>P/L</th></tr></thead>
            <tbody>
              {SIGNALS.map((s, i) => (
                <tr key={s.id} className="border-t border-mist">
                  <td className="py-1 truncate max-w-[260px]">{s.market}</td>
                  <td>{i % 3 === 0 ? <span className="chip red">Fade</span> : <span className="chip green">Take</span>}</td>
                  <td className="tnum text-positive">+{s.edgePct}%</td>
                  <td className="tnum">{s.confidence}%</td>
                  <td>{i % 4 === 3 ? <span className="chip">Open</span> : <span className="chip green">Won</span>}</td>
                  <td className="tnum text-positive">+{(s.edgePct * 0.7).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <div className="hairline rounded-2xl bg-white p-5">
            <Eyebrow>Calibration profile</Eyebrow>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <MiniGauge value={t.calib} label="Calibration" />
              <MiniGauge value={t.hit}   label="Hit rate" />
            </div>
          </div>
          <div className="hairline rounded-2xl bg-white p-5">
            <Eyebrow>Niche performance</Eyebrow>
            <ul className="mt-2 text-[12px] space-y-1.5">
              {['Macro','NBA','Crypto','AI','Politics'].map((c, i) => (
                <li key={c} className="grid grid-cols-[80px_minmax(0,1fr)_60px] gap-2 items-center">
                  <span>{c}</span>
                  <div className="h-1.5 bg-mist rounded">
                    <div className="h-1.5 rounded bg-cerulean" style={{ width: `${40 + i * 12}%` }} />
                  </div>
                  <span className="tnum text-slate2 text-right">+{(4 + i * 1.6).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="hairline rounded-2xl bg-white p-5">
            <Eyebrow>Badges</Eyebrow>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['Well Calibrated','Niche Specialist','Apex Verified','Quantzy Beater','Low Drawdown','Early Spotter'].map((b) => (
                <span key={b} className="chip cerulean">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tile({ k, v, c = 'text-ink' }) {
  return (
    <div className="hairline rounded-md bg-platinum/40 p-2.5">
      <div className="eyebrow">{k}</div>
      <div className={`font-semibold tnum text-[18px] ${c}`}>{v}</div>
    </div>
  );
}
