import { useState } from 'react';
import { Eyebrow } from '../components/UI.jsx';

export function Settings() {
  const [risk, setRisk] = useState('Bal');
  const [bnk, setBnk]   = useState(5000);
  const [conf, setConf] = useState(65);
  const [pubProf, setPub] = useState(true);

  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1200px] mx-auto space-y-5">
      <div>
        <Eyebrow>Settings · risk profile</Eyebrow>
        <h1 className="font-display text-[32px] tracking-tight">Configure your trading agent.</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Section title="Niches">
          <div className="flex flex-wrap gap-1.5">
            {['NBA Playoffs','US Politics','Crypto','Macro','AI Regulation','Culture','Weather','Sports Props','Geopolitics'].map((n, i) => (
              <span key={n} className={`chip ${i < 4 ? 'cerulean' : ''} cursor-pointer`}>{n}</span>
            ))}
          </div>
          <div className="text-[11.5px] text-slate1 mt-2">Click to toggle. Quantzy adapts the feed to your niches.</div>
        </Section>

        <Section title="Venues">
          <div className="grid grid-cols-2 gap-1.5">
            {['Polymarket','Kalshi','PrizePicks','DraftKings','BetOnline','Deribit'].map((v, i) => (
              <span key={v} className={`chip ${i < 4 ? 'cerulean' : ''}`}>{v}</span>
            ))}
          </div>
        </Section>

        <Section title="Risk mode">
          <div className="inline-flex hairline rounded-md p-0.5 bg-onyx w-full max-w-[400px]">
            {['Cons','Bal','Aggr','Degen','Custom'].map((m) => (
              <button key={m} onClick={() => setRisk(m)}
                className={`flex-1 text-[12px] h-8 rounded ${risk === m ? 'bg-carbon shadow-card text-white font-semibold' : 'text-slate1'}`}>{m}</button>
            ))}
          </div>
          <div className="text-[11.5px] text-slate1 mt-2">Currently: {risk === 'Bal' ? 'Balanced — confidence ≥ 65%, max 4% per signal' : 'Custom config'}</div>
        </Section>

        <Section title="Bankroll & sizing">
          <Field label={`Paper bankroll · $${bnk.toLocaleString()}`}>
            <input type="range" min={500} max={50000} step={500} value={bnk} onChange={(e) => setBnk(parseInt(e.target.value))} className="w-full accent-cerulean" />
          </Field>
          <Field label={`Min confidence · ${conf}%`}>
            <input type="range" min={50} max={95} step={1} value={conf} onChange={(e) => setConf(parseInt(e.target.value))} className="w-full accent-cerulean" />
          </Field>
        </Section>

        <Section title="Social visibility">
          <Toggle on={pubProf} onChange={setPub} label="Public profile" hint="Show your calibration & roster." />
          <Toggle on={true}    onChange={() => {}} label="Allow follow" hint="Other users can subscribe to your activity." />
          <Toggle on={false}   onChange={() => {}} label="Allow copy"   hint="Others can mirror your paper trades." />
        </Section>

        <Section title="Notifications">
          <Toggle on={true}  onChange={() => {}} label="Push alerts"  />
          <Toggle on={true}  onChange={() => {}} label="Email digest"  hint="Daily 18:00 UTC" />
          <Toggle on={false} onChange={() => {}} label="Slack webhook" />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="hairline rounded-2xl bg-carbon p-5">
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}
function Field({ label, children }) {
  return <div><div className="eyebrow mb-1">{label}</div>{children}</div>;
}
function Toggle({ on, onChange, label, hint }) {
  return (
    <button onClick={() => onChange(!on)} className="w-full flex items-center justify-between hairline rounded-md px-3 py-2">
      <span className="text-left">
        <span className="block text-[12.5px] text-white">{label}</span>
        {hint && <span className="block text-[10.5px] text-slate1">{hint}</span>}
      </span>
      <span className={`w-9 h-5 rounded-full p-0.5 ${on ? 'bg-cerulean' : 'bg-white/10'}`}>
        <span className={`block h-4 w-4 rounded-full bg-carbon transition-transform ${on ? 'translate-x-4' : ''}`} />
      </span>
    </button>
  );
}
