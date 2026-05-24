import { Link } from 'react-router-dom';
import { Eyebrow, Sparkline } from '../components/UI.jsx';
import { TOPICS, CATEGORIES } from '../data/markets.js';

const HIDDEN_NICHES = [
  { k: 'Local elections',   d: 'Low competition · clean rules · short windows',  edge: '+9.4%', conf: 71 },
  { k: 'Weather names',     d: 'High inefficiency · early-season catalysts',     edge: '+13.0%', conf: 68 },
  { k: 'Tour announcements', d: 'Booking-pattern leak data',                     edge: '+11.2%', conf: 62 },
  { k: 'Court calendars',   d: 'Procedural delay underpriced',                   edge: '+8.6%',  conf: 64 },
];

export function Explore() {
  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1600px] mx-auto space-y-5">
      <div>
        <Eyebrow>Explore markets</Eyebrow>
        <h1 className="font-display text-[32px] tracking-tight">Browse by topic.</h1>
        <p className="text-[13px] text-slate2 mt-0.5">Don't know what to search? Start here. We push hidden niches with low competition + high inefficiency to the top.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {TOPICS.map((t, i) => {
          const cat = CATEGORIES[i % CATEGORIES.length];
          return (
            <Link to="/app/scanner" key={t.id} className="hairline rounded-2xl bg-white p-4 hover:shadow-lift transition block">
              <div className="flex items-center justify-between">
                <div className="text-[14px] font-semibold">{t.label}</div>
                <span className="chip cerulean">{t.count}</span>
              </div>
              <div className="mt-3"><Sparkline values={Array.from({ length: 18 }, (_, k) => 30 + k * 1.4 + Math.sin(k + i) * 4)} width={300} height={36} color={cat.color} /></div>
              <div className="grid grid-cols-3 gap-2 text-[11px] mt-2">
                <Box k="Edge" v={`+${cat.edge}%`} c="text-positive" />
                <Box k="Hit"  v={`${cat.hit}%`} />
                <Box k="Liq"  v="$3.6M" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="hairline rounded-2xl bg-gradient-to-br from-[#fffaee] to-white p-5 gold-frame">
        <Eyebrow className="text-[#7E5E22]">Hidden niches</Eyebrow>
        <p className="text-[12.5px] text-slate2 mt-1">Where the model finds inefficiency before the crowd. Saturation-aware ranking keeps these uncrowded.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {HIDDEN_NICHES.map((n) => (
            <div key={n.k} className="hairline rounded-md bg-white p-3">
              <div className="font-semibold text-[13.5px]">{n.k}</div>
              <div className="text-[11.5px] text-slate2">{n.d}</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Box k="Edge" v={n.edge} c="text-positive" />
                <Box k="Conf" v={`${n.conf}%`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Box({ k, v, c = 'text-ink' }) {
  return <div className="hairline rounded-md p-1.5 bg-platinum/30 text-center"><div className="eyebrow">{k}</div><div className={`font-semibold tnum ${c}`}>{v}</div></div>;
}
