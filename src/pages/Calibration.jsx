import { useState } from 'react';
import { Eyebrow, ConfBand, MiniGauge } from '../components/UI.jsx';
import { SIGNALS } from '../data/markets.js';

export function Calibration() {
  const [picks, setPicks] = useState({});
  const set = (id, v) => setPicks((p) => ({ ...p, [id]: v }));
  const submitted = Object.keys(picks).length;
  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1600px] mx-auto space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Eyebrow>Calibration arena</Eyebrow>
          <h1 className="font-display text-[32px] tracking-tight">Train your probabilistic intuition.</h1>
          <p className="text-[13px] text-slate1 mt-0.5 max-w-[60ch]">Submit probabilities on unresolved markets. After resolution, you get a Brier score, accuracy by bucket, and a bias diagnosis.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip cerulean">Streak · 6W</span>
          <span className="chip">Submitted · {submitted}</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="hairline rounded-2xl bg-carbon p-4">
          <Eyebrow>Your calibration</Eyebrow>
          <MiniGauge value={92} label="Score" />
          <div className="text-[11px] text-slate1 mt-1">Top 14% of users</div>
        </div>
        <div className="hairline rounded-2xl bg-carbon p-4">
          <Eyebrow>Brier · last 90d</Eyebrow>
          <div className="text-[24px] font-display tnum mt-1">0.158</div>
          <div className="text-[11px] text-slate1">Lower = better</div>
        </div>
        <div className="hairline rounded-2xl bg-carbon p-4">
          <Eyebrow>Bucket where you are best</Eyebrow>
          <div className="text-[16px] font-semibold mt-1">70–80%</div>
          <div className="text-[11px] text-slate1">vs Quantzy: even</div>
        </div>
        <div className="hairline rounded-2xl bg-gradient-to-br from-[#2A2418] to-carbon p-4 gold-frame">
          <Eyebrow className="text-[#7E5E22]">Weekly bracket</Eyebrow>
          <div className="text-[16px] font-semibold mt-1">Round of 16 · 3 wins</div>
          <div className="text-[11px] text-slate1">Next match: @kaldera · 14:00 UTC</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        {SIGNALS.slice(0, 6).map((s) => {
          const v = picks[s.id] ?? 50;
          const diff = Math.abs(v - s.fairPct);
          return (
            <div key={s.id} className="hairline rounded-2xl bg-carbon p-4">
              <div className="flex items-center justify-between">
                <span className="chip">{s.subtopic}</span>
                <span className="text-[10.5px] text-slate1">{s.timeLeft}</span>
              </div>
              <div className="text-[14px] font-semibold mt-1.5 leading-tight">{s.market}</div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div><div className="eyebrow">Quantzy</div><div className="font-semibold tnum">{s.fairPct}%</div></div>
                <div><div className="eyebrow">Crowd</div><div className="font-semibold tnum">{s.marketPct}%</div></div>
                <div><div className="eyebrow">You</div><div className="font-semibold tnum text-cerulean">{v}%</div></div>
              </div>
              <input type="range" min={0} max={100} value={v} onChange={(e) => set(s.id, parseInt(e.target.value))}
                className="w-full mt-3 accent-cerulean" />
              <div className="mt-1"><ConfBand value={v} /></div>
              <div className="mt-2 flex items-center gap-1.5">
                <button className="btn btn-cerulean btn-xs">Lock</button>
                <button className="btn btn-ghost btn-xs">Skip</button>
                <span className="ml-auto text-[10.5px] text-slate1">Δ vs model {diff.toFixed(1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
