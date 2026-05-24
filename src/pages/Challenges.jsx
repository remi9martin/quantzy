import { useState } from 'react';
import { Eyebrow, ConfBand, PulseDot } from '../components/UI.jsx';
import { SIGNALS, TRADERS } from '../data/markets.js';

export function Challenges() {
  const [sig] = useState(SIGNALS[3]);
  const [user, setUser] = useState(15);
  const diff = Math.abs(user - sig.fairPct);
  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1400px] mx-auto space-y-5">
      <div>
        <Eyebrow>Challenge arena · Round 12</Eyebrow>
        <h1 className="font-display text-[32px] tracking-tight">Beat Quantzy.</h1>
        <p className="text-[13px] text-slate2 mt-0.5">Submit your own probability on any active market. Score on calibration, edge captured, timing, and risk-adjusted result. Top weekly performers earn league points.</p>
      </div>

      <div className="hairline rounded-2xl bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11.5px] text-slate2">Active duel · {sig.subtopic}</div>
            <div className="text-[18px] font-semibold mt-0.5">{sig.market}</div>
          </div>
          <span className="chip cerulean"><PulseDot /> Open · {sig.timeLeft}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-3 mt-4 items-start">
          <div className="rounded-xl surface-platinum hairline p-4 text-center">
            <div className="eyebrow">Quantzy</div>
            <div className="font-display text-[42px] mt-1 tnum">{sig.fairPct}%</div>
            <div className="text-[11px] text-slate2">Confidence band {sig.confLow}–{sig.confHigh}</div>
            <div className="mt-3"><ConfBand value={sig.fairPct} /></div>
            <div className="text-[11px] text-slate2 mt-2">Won 4 of last 7</div>
          </div>

          <div className="rounded-xl hairline p-4 bg-gradient-to-br from-white to-[#f6f9ff]">
            <div className="text-center">
              <div className="eyebrow">Your call</div>
              <div className="font-display text-[42px] mt-1 tnum">{user}%</div>
              <div className="text-[11px] text-slate2">Move slider to set probability</div>
            </div>
            <input type="range" min={0} max={100} value={user} onChange={(e) => setUser(parseInt(e.target.value))}
              className="w-full mt-3 accent-cerulean" />
            <div className="grid grid-cols-3 gap-2 text-[11.5px] text-center mt-3">
              <div className="hairline rounded-md p-2"><div className="eyebrow">Δ vs model</div><div className="font-semibold tnum">{diff.toFixed(1)}</div></div>
              <div className="hairline rounded-md p-2"><div className="eyebrow">If lower</div><div className="font-semibold tnum text-positive">+{(diff * 0.6).toFixed(1)}</div></div>
              <div className="hairline rounded-md p-2"><div className="eyebrow">If higher</div><div className="font-semibold tnum text-warn">-{(diff * 0.6).toFixed(1)}</div></div>
            </div>
            <button className="btn btn-cerulean w-full mt-3">Lock my call</button>
          </div>

          <div className="rounded-xl hairline p-4">
            <div className="eyebrow">Crowd · top 5</div>
            <ul className="mt-2 text-[12px] space-y-1.5">
              {TRADERS.slice(0, 5).map((t) => (
                <li key={t.name} className="flex items-center justify-between">
                  <span>@{t.name}</span>
                  <span className="tnum text-ink font-semibold">{15 + (t.calib % 17)}%</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 hairline rounded-md p-2 bg-platinum/30 text-[11.5px]">
              <span className="text-slate2">Crowd median:</span> <span className="tnum font-semibold">22%</span> · <span className="text-slate2">spread:</span> <span className="tnum">14–34</span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          <Stat k="Your weekly score"  v="142"  c="text-cerulean" />
          <Stat k="Wins vs Quantzy"    v="3 of 7" />
          <Stat k="League rank"        v="#412 → #389" c="text-positive" />
        </div>
      </div>

      <div className="hairline rounded-2xl bg-white p-5">
        <Eyebrow>Archive · finished rounds</Eyebrow>
        <table className="w-full text-[12px] mt-2">
          <thead className="text-slate2"><tr><th className="text-left py-1.5">Round</th><th className="text-left">Market</th><th>Quantzy</th><th>You</th><th>Outcome</th><th>Calibrator</th><th>Δ pts</th></tr></thead>
          <tbody>
            {[
              { r: 'W11', m: 'BTC > $100k by Jul 31',     q: 52, u: 41, o: 'Pending', c: '+0', d: 0 },
              { r: 'W10', m: 'OKC G5 winner',             q: 73, u: 68, o: 'Yes',     c: '@oddsoracle', d: 8 },
              { r: 'W09', m: 'CPI < 3.2% (May)',          q: 64, u: 55, o: 'Yes',     c: '@kaldera', d: 11 },
              { r: 'W08', m: 'Fed cut June',              q: 22, u: 30, o: 'No',      c: '@kaldera', d: -4 },
              { r: 'W07', m: 'TikTok divestiture by Sep', q: 18, u: 14, o: 'Pending', c: '+0', d: 0 },
            ].map((r) => (
              <tr key={r.r} className="border-t border-mist">
                <td className="py-1.5 font-semibold">{r.r}</td>
                <td>{r.m}</td>
                <td className="tnum">{r.q}%</td>
                <td className="tnum">{r.u}%</td>
                <td>{r.o === 'Yes' ? <span className="chip green">Yes</span> : r.o === 'No' ? <span className="chip red">No</span> : <span className="chip">Pending</span>}</td>
                <td>{r.c}</td>
                <td className={`tnum font-semibold ${r.d > 0 ? 'text-positive' : r.d < 0 ? 'text-negative' : 'text-slate2'}`}>{r.d > 0 ? '+' : ''}{r.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ k, v, c = 'text-ink' }) {
  return <div className="hairline rounded-md p-3"><div className="eyebrow">{k}</div><div className={`font-semibold tnum ${c}`}>{v}</div></div>;
}
