import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Tabs, Sparkline } from '../components/UI.jsx';
import { TRADERS } from '../data/markets.js';

const MODES = [
  { value: 'all',   label: 'Overall' },
  { value: 'cat',   label: 'By category' },
  { value: 'time',  label: 'By time horizon' },
  { value: 'tier',  label: 'By tier' },
  { value: 'fader', label: 'Faders' },
  { value: 'team',  label: 'Teams' },
];

export function Leaderboard() {
  const [mode, setMode] = useState('all');
  const sorted = [...TRADERS].sort((a, b) => b.roi - a.roi);
  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1600px] mx-auto space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Eyebrow>League · Season 04</Eyebrow>
          <h1 className="font-display text-[32px] tracking-tight leading-tight">Leaderboard.</h1>
          <p className="text-[13px] text-slate2 mt-0.5">Multi-dimensional rank: ROI, calibration, hit rate, sample size, drawdown control, niche specialization.</p>
        </div>
        <Tabs value={mode} onChange={setMode} items={MODES} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sorted.slice(0, 4).map((t, i) => (
          <div key={t.name} className={`hairline rounded-2xl p-4 ${i === 0 ? 'gold-frame bg-gradient-to-br from-[#fffaee] to-white' : 'bg-white'} relative overflow-hidden`}>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: ['#C9A24B', '#9CA3AF', '#B16A2D', '#374151'][i] }} />
            <div className="flex items-center justify-between">
              <span className="chip">{['1st', '2nd', '3rd', '4th'][i]}</span>
              <span className={`chip ${t.tier === 'Apex' ? 'gold' : t.tier === 'Platinum' ? 'cerulean' : ''}`}>{t.tier}</span>
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-full bg-ink text-white grid place-items-center text-[12px] font-semibold">{t.name.slice(0,2).toUpperCase()}</div>
              <div className="min-w-0">
                <div className="font-semibold truncate">@{t.name}</div>
                <div className="text-[10.5px] text-slate2">{t.specialty}</div>
              </div>
            </div>
            <div className="mt-2">
              <Sparkline values={Array.from({ length: 18 }, (_, j) => 50 + j * 1.4 + Math.sin(j + i) * 6)} width={260} height={28} color="#10B981" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-center text-[11px]">
              <div><div className="eyebrow">ROI</div><div className="font-semibold tnum text-positive">+{t.roi}%</div></div>
              <div><div className="eyebrow">Hit</div><div className="font-semibold tnum">{t.hit}%</div></div>
              <div><div className="eyebrow">Cal</div><div className="font-semibold tnum">{t.calib}</div></div>
            </div>
          </div>
        ))}
      </div>

      <div className="hairline rounded-2xl bg-white">
        <table className="w-full text-[12.5px]">
          <thead className="text-slate2">
            <tr><th className="py-2 px-4 text-left">#</th><th className="text-left">Trader</th><th>Specialty</th><th>ROI</th><th>Hit</th><th>Cal</th><th>Brier</th><th>Samples</th><th>Streak</th><th>DD</th><th>Tier</th><th className="pr-4"></th></tr>
          </thead>
          <tbody>
            {sorted.map((t, i) => (
              <tr key={t.name} className="border-t border-mist hover:bg-platinum/40">
                <td className="py-2 px-4 tnum text-slate2">{i + 1}</td>
                <td>
                  <Link to={`/app/trader/${t.name}`} className="font-semibold hover:text-cerulean">@{t.name}</Link>
                </td>
                <td className="text-slate2">{t.specialty}</td>
                <td className="tnum text-positive">+{t.roi}%</td>
                <td className="tnum">{t.hit}%</td>
                <td className="tnum">{t.calib}</td>
                <td className="tnum">{t.brier.toFixed(3)}</td>
                <td className="tnum">{t.samples}</td>
                <td className="font-semibold text-cerulean">{t.streak}</td>
                <td className="tnum">{t.drawdown}%</td>
                <td><span className={`chip ${t.tier === 'Apex' ? 'gold' : t.tier === 'Platinum' ? 'cerulean' : ''}`}>{t.tier}</span></td>
                <td className="pr-4"><button className="btn btn-ghost btn-xs">Follow</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="hairline rounded-2xl bg-white p-5">
        <Eyebrow>Season prizes</Eyebrow>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
          {[
            { k: 'Top 1%', v: 'Free Pro · 6 mo', c: 'text-cerulean' },
            { k: 'Top 10', v: 'Apex trial', c: 'text-[#7E5E22]' },
            { k: 'Niche specialist', v: 'Verified curator', c: 'text-positive' },
            { k: 'Best calibrator', v: 'Featured profile', c: 'text-cerulean' },
          ].map((p) => (
            <div key={p.k} className="hairline rounded-md p-3 bg-platinum/30">
              <div className="eyebrow">{p.k}</div>
              <div className={`font-semibold mt-0.5 ${p.c}`}>{p.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
