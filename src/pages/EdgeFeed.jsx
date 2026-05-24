import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Chip, PulseDot, Sparkline, EdgeBar, Tabs, Lock } from '../components/UI.jsx';
import { EmptyState, FeedSkeleton } from '../components/States.jsx';
import { SIGNALS, TOPICS } from '../data/markets.js';

const SORTS = [
  { value: 'edge', label: 'Highest Edge' },
  { value: 'conf', label: 'Confidence' },
  { value: 'liq',  label: 'Liquidity' },
  { value: 'soon', label: 'Ending Soon' },
  { value: 'soc',  label: 'Socially Confirmed' },
  { value: 'cont', label: 'Contrarian' },
  { value: 'fol',  label: 'Followed Traders' },
  { value: 'apex', label: 'Apex Only' },
];

export function EdgeFeed() {
  const [sort, setSort] = useState('edge');
  const [topic, setTopic] = useState('all');
  const [pulseId, setPulseId] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let arr = [...SIGNALS];
    if (topic !== 'all') arr = arr.filter((s) => s.topic === topic);
    if (sort === 'edge') arr.sort((a, b) => b.edgePct - a.edgePct);
    if (sort === 'conf') arr.sort((a, b) => b.confidence - a.confidence);
    if (sort === 'liq')  arr.sort((a, b) => b.liquidityScore - a.liquidityScore);
    if (sort === 'soon') arr.sort((a, b) => parseInt(a.timeLeft) - parseInt(b.timeLeft));
    if (sort === 'soc')  arr.sort((a, b) => b.socialConv - a.socialConv);
    if (sort === 'cont') arr = arr.filter((s) => s.fade);
    if (sort === 'apex') arr = arr.filter((s) => s.tier === 'apex');
    return arr;
  }, [sort, topic]);

  useEffect(() => {
    const id = setInterval(() => {
      const pick = SIGNALS[Math.floor(Math.random() * SIGNALS.length)];
      setPulseId(pick.id);
      setToast({ id: pick.id, label: pick.market, edge: pick.edgePct });
      setTimeout(() => setPulseId(null), 1500);
      setTimeout(() => setToast(null), 3500);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1600px] mx-auto space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Eyebrow>Edge feed</Eyebrow>
          <h1 className="font-display text-[28px] tracking-tight">Live opportunities, ranked.</h1>
        </div>
        <div className="flex items-center gap-2">
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-white hairline rounded-md text-[12.5px] px-2 h-9">
            <option value="all">All topics</option>
            {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <Tabs value={sort} onChange={setSort} items={SORTS} />
        </div>
      </div>

      {loading && <FeedSkeleton count={6} />}
      {!loading && filtered.length === 0 && (
        <EmptyState
          title="No edges in this slice."
          description="Loosen the filters or pick a different topic. The model is still scanning 2,841 markets in the background."
          action={<button onClick={() => { setSort('edge'); setTopic('all'); }} className="btn btn-cerulean btn-sm">Reset filters</button>}
        />
      )}
      {!loading && filtered.length > 0 && (
      <ul className="grid lg:grid-cols-2 gap-3">
        {filtered.map((s) => (
          <li key={s.id} className={`hairline rounded-xl bg-white p-4 transition ${pulseId === s.id ? 'ring-2 ring-cerulean shadow-glow' : ''} ${s.tier === 'apex' ? 'gold-frame' : ''}`}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="chip">{s.venue}</span>
              <span className="chip cerulean">{s.subtopic}</span>
              {s.tier === 'apex' && <span className="chip gold"><Lock /> Apex</span>}
              {s.fade && <span className="chip red">Fade</span>}
              <span className="ml-auto text-[10.5px] tracking-wider2 uppercase text-slate2">{s.status}</span>
            </div>
            <Link to={`/app/signal/${s.id}`} className="block text-[14px] font-semibold mt-2 leading-tight hover:text-cerulean">{s.market}</Link>
            <div className="grid grid-cols-[1fr_minmax(140px,160px)] gap-3 mt-3 items-center">
              <EdgeBar market={s.marketPct} fair={s.fairPct} />
              <Sparkline values={s.spark} width={150} height={28} color="#2563EB" />
            </div>
            <div className="mt-2 grid grid-cols-6 gap-2 text-[11px]">
              <Stat k="Edge"   v={`+${s.edgePct}%`} c="text-positive" />
              <Stat k="Conf"   v={`${s.confidence}%`} />
              <Stat k="Liq"    v={s.liquidity} />
              <Stat k="Social" v={`${s.socialConv}%`} c="text-cerulean" />
              <Stat k="Rules"  v={s.rulesRisk} />
              <Stat k="In"     v={s.timeLeft} />
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10.5px] text-slate2">
              <span>{s.traders.taking} taking · {s.traders.skipping} skip · {s.traders.fading} fade</span>
              <span className="ml-auto inline-flex gap-1">
                <button className="btn btn-ghost btn-xs">Watch</button>
                <button className="btn btn-ghost btn-xs">Simulate</button>
                <button className="btn btn-cerulean btn-xs">Take</button>
              </span>
            </div>
          </li>
        ))}
      </ul>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 hairline rounded-xl bg-white shadow-lift p-3 flex items-center gap-2 z-40">
          <PulseDot tone="green" />
          <div>
            <div className="text-[12px] font-semibold">Edge moved</div>
            <div className="text-[11px] text-slate2 truncate max-w-[260px]">{toast.label} · +{toast.edge}%</div>
          </div>
          <Link to={`/app/signal/${toast.id}`} className="btn btn-cerulean btn-xs ml-2">Open</Link>
        </div>
      )}
    </div>
  );
}

function Stat({ k, v, c = 'text-ink' }) {
  return (
    <div>
      <div className="eyebrow">{k}</div>
      <div className={`font-semibold tnum ${c}`}>{v}</div>
    </div>
  );
}
