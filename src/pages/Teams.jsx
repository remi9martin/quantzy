import { Eyebrow, Sparkline } from '../components/UI.jsx';
import { TEAMS } from '../data/markets.js';

export function Teams() {
  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1600px] mx-auto space-y-5">
      <div>
        <Eyebrow>Squads</Eyebrow>
        <h1 className="font-display text-[32px] tracking-tight">Teams.</h1>
        <p className="text-[13px] text-slate2 mt-0.5 max-w-[60ch]">Captains run squads. Squads publish curated picks, earn revenue share, and compete seasonally.</p>
      </div>
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {TEAMS.map((t) => (
          <div key={t.name} className="hairline rounded-2xl bg-white p-4">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-md bg-cerulean/10 grid place-items-center text-cerulean text-[14px] font-bold">{t.name.split(' ').map(w => w[0]).join('').slice(0,2)}</div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{t.name}</div>
                <div className="text-[10.5px] text-slate2">Captain @{t.captain} · {t.members} members</div>
              </div>
              <button className="btn btn-cerulean btn-xs">Apply</button>
            </div>
            <div className="text-[11.5px] text-slate2 mt-2">{t.focus}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="hairline rounded-md p-2"><div className="eyebrow">Hit</div><div className="font-semibold tnum">{t.hit}%</div></div>
              <div className="hairline rounded-md p-2"><div className="eyebrow">ROI</div><div className="font-semibold tnum text-positive">+{t.roi}%</div></div>
              <div className="hairline rounded-md p-2"><div className="eyebrow">Open</div><div className="font-semibold tnum">{6 + t.members % 8}</div></div>
            </div>
            <div className="mt-3"><Sparkline values={Array.from({ length: 18 }, (_, i) => 50 + i * 1.4 + Math.sin(i + t.members) * 5)} width={300} height={32} color="#2563EB" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
