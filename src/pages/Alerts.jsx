import { useState } from 'react';
import { Eyebrow } from '../components/UI.jsx';

const RULES = [
  { id: 1, name: 'NBA edge ≥ 8%, liq ≥ $100k, conf ≥ 70', hits: 4, on: true },
  { id: 2, name: 'Apex branch unlock · my niches',          hits: 2, on: true },
  { id: 3, name: 'Top trader entered · followed list',      hits: 11, on: true },
  { id: 4, name: 'Catalyst window < 48h · macro',           hits: 6, on: false },
];

export function Alerts() {
  const [topic, setTopic] = useState('NBA');
  const [edge, setEdge] = useState(8);
  const [conf, setConf] = useState(70);
  const [liq, setLiq]   = useState(100);
  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1400px] mx-auto space-y-5">
      <div>
        <Eyebrow>Alerts center</Eyebrow>
        <h1 className="font-display text-[32px] tracking-tight">Automate the watch.</h1>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="hairline rounded-2xl bg-white p-5">
          <Eyebrow>Rule builder</Eyebrow>
          <div className="mt-3 hairline rounded-md bg-platinum/30 p-4 text-[13px] leading-relaxed">
            <span className="text-slate2">IF</span> topic = <span className="chip cerulean">{topic}</span>
            <span className="text-slate2"> AND </span> edge ≥ <span className="chip">{edge}%</span>
            <span className="text-slate2"> AND </span> liquidity ≥ <span className="chip">${liq}k</span>
            <span className="text-slate2"> AND </span> confidence ≥ <span className="chip">{conf}%</span>
            <span className="text-slate2"> THEN </span> <span className="chip green">Notify · push + email</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <Field label="Topic">
              <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-white hairline rounded-md text-[13px] px-2 h-9">
                <option>NBA</option><option>Politics</option><option>Crypto</option><option>Macro</option><option>AI</option><option>Sports</option>
              </select>
            </Field>
            <Slider label={`Edge ≥ ${edge}%`}    v={edge} onChange={setEdge} min={0} max={20} />
            <Slider label={`Confidence ≥ ${conf}%`} v={conf} onChange={setConf} min={50} max={95} />
            <Slider label={`Liquidity ≥ $${liq}k`} v={liq} onChange={setLiq} min={10} max={2000} step={10} />
          </div>
          <div className="mt-3 hairline rounded-md p-3 bg-cerulean/5 text-[12.5px]">
            <span className="text-cerulean font-semibold">Backtest:</span> this alert would have caught <span className="text-ink font-semibold">12</span> wins last month with avg captured edge <span className="text-positive font-semibold">+9.4%</span>.
          </div>
          <div className="mt-3 flex gap-1.5">
            <button className="btn btn-cerulean btn-sm">Save alert</button>
            <button className="btn btn-ghost btn-sm">Test now</button>
          </div>
        </div>

        <div className="hairline rounded-2xl bg-white p-5">
          <Eyebrow>Active alerts</Eyebrow>
          <ul className="mt-2 space-y-2">
            {RULES.map((r) => (
              <li key={r.id} className="hairline rounded-md p-3 flex items-center gap-2">
                <span className={`pulse-dot ${r.on ? 'green' : ''}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold">{r.name}</div>
                  <div className="text-[10.5px] text-slate2">{r.hits} hits · last 30d</div>
                </div>
                <button className={`w-9 h-5 rounded-full p-0.5 ${r.on ? 'bg-cerulean' : 'bg-haze'}`}>
                  <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${r.on ? 'translate-x-4' : ''}`} />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 hairline rounded-md p-3 bg-platinum/30 text-[12px]">
            <div className="text-slate2">Suggested:</div>
            <div className="mt-1">You often search <span className="font-semibold">AI regulation</span> — add an alert for edge ≥ 6% there?</div>
            <button className="btn btn-ghost btn-xs mt-2">Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div><div className="eyebrow mb-1">{label}</div>{children}</div>;
}
function Slider({ label, v, onChange, min = 0, max = 100, step = 1 }) {
  return (
    <div>
      <div className="eyebrow mb-1">{label}</div>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-cerulean" />
    </div>
  );
}
