import { Link } from 'react-router-dom';
import { Eyebrow, EdgeBar, Sparkline, Lock } from '../components/UI.jsx';
import { MISSED } from '../data/markets.js';

function Card({ m }) {
  const stripeColor = m.tier === 'apex' ? '#C9A24B' : '#F59E0B';
  return (
    <div className={`hairline rounded-2xl bg-carbon p-4 relative overflow-hidden ${m.tier === 'apex' ? 'gold-frame' : ''}`}>
      <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.14), transparent 70%)' }} />
      <div className="flex items-center justify-between">
        <span className="chip">Missed · {m.interactedOn}</span>
        {m.tier === 'apex' ? <span className="chip gold"><Lock /> Apex-locked</span> : <span className="chip cerulean">Standard</span>}
      </div>
      <h3 className="text-[15px] font-semibold mt-2 leading-tight">{m.market}</h3>
      <div className="text-[11.5px] text-slate1">You: <span className="text-white font-medium">{m.action}</span> · reason: <span className="text-warn">{m.reason}</span></div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Box k="Edge then" v={`+${m.edgeAtTime}%`} c="text-white" />
        <Box k="Move" v={`+${m.moveCents}¢`} c="text-warn" />
        <Box k="Potential" v={m.potentialProfit} c="text-positive" />
      </div>

      <div className="mt-3">
        <div className="eyebrow mb-1">Ghost trajectory</div>
        <Sparkline values={Array.from({ length: 16 }, (_, i) => 30 + i * 1.6 + Math.sin(i / 2) * 3)} width={400} height={32} color="#F59E0B" />
        <div className="flex items-center justify-between text-[10.5px] text-slate1 mt-1">
          <span>You searched here</span>
          <span style={{ color: stripeColor }}>Market moved →</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <button className="btn btn-ghost btn-xs">Set this alert</button>
        <button className="btn btn-ghost btn-xs">Follow niche</button>
        <button className="btn btn-ghost btn-xs">Lower conf floor</button>
        {m.tier === 'apex' && <Link to="/app/tiers" className="btn btn-gold btn-xs">Unlock Apex</Link>}
      </div>
    </div>
  );
}

function Box({ k, v, c }) {
  return <div className="hairline rounded-md p-2 bg-white/5"><div className="eyebrow">{k}</div><div className={`font-semibold tnum ${c}`}>{v}</div></div>;
}

export function Missed() {
  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1600px] mx-auto space-y-5">
      <div>
        <Eyebrow>Missed wins · 30d ledger</Eyebrow>
        <h1 className="font-display text-[32px] tracking-tight leading-tight">You almost had this.</h1>
      </div>

      <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Big k="Total missed edge" v="$5,492" c="text-positive" />
        <Big k="Largest" v="$1,840" />
        <Big k="Markets searched" v="142" />
        <Big k="That later moved" v="38" c="text-warn" />
        <Big k="Apex-locked misses" v="6" c="text-[#7E5E22]" />
        <Big k="Patterns flagged" v="3" />
      </div>

      <div className="hairline rounded-2xl bg-gradient-to-br from-[#2A2418] via-carbon to-carbon p-5">
        <Eyebrow>Pattern diagnosis</Eyebrow>
        <div className="grid lg:grid-cols-3 gap-3 mt-3">
          {[
            'You skip 60–70% confidence even when edge is high.',
            'You miss low-liquidity early opportunities that later become liquid.',
            'You search politics but rarely set alerts.',
          ].map((d, i) => (
            <div key={i} className="hairline rounded-md p-3 bg-carbon">
              <div className="text-[12.5px] text-white">{d}</div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <button className="btn btn-ghost btn-xs">Adjust</button>
                <button className="btn btn-cerulean btn-xs">Suggested alert</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        {MISSED.map((m) => <Card key={m.id} m={m} />)}
      </div>

      <div className="hairline rounded-2xl bg-carbon p-5">
        <Eyebrow>Public missed feed</Eyebrow>
        <ul className="mt-3 space-y-2">
          <li className="text-[12.5px]"><span className="text-slate1">A user searched</span> <span className="font-semibold">"AI regulation"</span> <span className="text-slate1">9 days before it moved</span> <span className="text-positive font-semibold">+31¢</span>.</li>
          <li className="text-[12.5px]"><span className="text-slate1">Quantzy flagged</span> <span className="font-semibold">"BTC spot ETF"</span> <span className="text-slate1">before the crowd by 4 days.</span></li>
          <li className="text-[12.5px]"><span className="text-slate1">Apex users captured</span> <span className="font-semibold">$24k</span> <span className="text-slate1">on the missed Q1 macro print.</span></li>
        </ul>
      </div>
    </div>
  );
}

function Big({ k, v, c = 'text-white' }) {
  return (
    <div className="hairline rounded-xl bg-carbon p-3">
      <div className="eyebrow">{k}</div>
      <div className={`mt-1 text-[20px] font-display tnum ${c}`}>{v}</div>
    </div>
  );
}
