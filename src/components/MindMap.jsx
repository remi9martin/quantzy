import { useMemo, useState } from 'react';
import { EdgeBar, PulseDot } from './UI.jsx';
import { Lock } from './UI.jsx';

/* -------------------------------------------------------------------------- */
/* Radial intelligence map (R2-i1, R2-i2, R2-i3)                              */
/* -------------------------------------------------------------------------- */
/*
 * The map is a live SVG with three rings of nodes around a center topic.
 *  - center = topic
 *  - ring 1 = subtopics
 *  - ring 2 = market clusters
 *  - leaves = specific markets, rendered as foreignObject HTML cards
 *
 * Visual grammar (per spec):
 *   - branch thickness   = liquidity score (3..7 px)
 *   - glow intensity     = edge magnitude  (filter blur radius)
 *   - color              = confidence tier (slate / cerulean / gold)
 *   - pulse              = freshly moved
 *   - dashed             = weak evidence
 *   - gold ring          = Apex / premium
 *   - red ring           = high rules risk
 *   - green dot          = top traders entered
 *   - blue halo          = previously searched
 *
 * Interactions:
 *   - hover leaf → connector line + pinned hover card with thesis chips
 *   - click leaf → calls onSelect(leaf) so the parent can show the inspector
 */

export const SAMPLE_TREE = {
  id: 'politics',
  label: 'US Politics',
  meta: { markets: 412, liquidity: '$48M', avgEdge: '+6.8%', socialHeat: 'High', confRange: '60–82%' },
  branches: [
    {
      id: 'pres', label: 'Pres winner', edge: 7.0, conf: 76, liq: 92,
      angle: -150, hot: true, watched: true,
      leaves: [
        { id: 'sig-001', label: 'Trump wins 2024', mp: 51, fp: 58, edge: 7.0, conf: 76, liq: '$12.4M', tier: 'std', status: 'NEW',  social: 71,
          factors: [{ k: 'Polling', v: 0.72 }, { k: 'Map', v: 0.62 }, { k: 'Catalyst', v: 0.58 }, { k: 'Rules', v: 0.92 }],
          thesis: 'Stable polling lead + favorable Senate map; debate volatility weighted in.' },
        { id: 'sig-pop', label: 'Popular vote D', mp: 60, fp: 64, edge: 4.0, conf: 65, liq: '$3.2M', tier: 'std', status: 'OPEN', social: 54,
          factors: [{ k: 'Polling', v: 0.66 }, { k: 'Turnout', v: 0.58 }],
          thesis: 'Marginal Dem PV edge structurally consistent across cycles.' },
      ],
    },
    {
      id: 'senate', label: 'Senate', edge: 5.4, conf: 71, liq: 84,
      angle: -90,
      leaves: [
        { id: 'sig-sen', label: 'GOP holds Senate', mp: 56, fp: 62, edge: 6.0, conf: 71, liq: '$3.8M', tier: 'std', status: 'MOVING', social: 64,
          factors: [{ k: 'Map', v: 0.78 }, { k: 'Incumbent', v: 0.62 }, { k: 'Money', v: 0.55 }],
          thesis: 'Class-3 map favorable to GOP. Watch WV / MT / OH.' },
      ],
    },
    {
      id: 'debates', label: 'Debates', edge: 11.0, conf: 64, liq: 38,
      angle: -30, hot: true,
      leaves: [
        { id: 'sig-deb', label: 'Debate before July 1', mp: 41, fp: 52, edge: 11.0, conf: 64, liq: '$1.1M', tier: 'apex', status: 'APEX', social: 60,
          factors: [{ k: 'Calendar', v: 0.78 }, { k: 'Campaign incentive', v: 0.55 }, { k: 'Rules clarity', v: 0.42 }],
          thesis: 'Apex · resolution-rule risk on definition of "debate". Heavy edge if rule clean.' },
      ],
    },
    {
      id: 'court', label: 'Court rulings', edge: 3.2, conf: 58, liq: 66, dashed: true,
      angle: 30,
      leaves: [
        { id: 'sig-008', label: 'TikTok divestiture by Sep', mp: 22, fp: 18, edge: 4.0, conf: 58, liq: '$1.4M', tier: 'std', status: 'FADE', social: 48, fade: true,
          factors: [{ k: 'Legal calendar', v: 0.62 }, { k: 'Injunction risk', v: 0.71 }],
          thesis: 'Fade · procedural delays underpriced.' },
      ],
    },
    {
      id: 'tech', label: 'Tech policy', edge: 4.4, conf: 62, liq: 58,
      angle: 90,
      leaves: [
        { id: 'sig-ai',  label: 'EU AI Act final · Q3', mp: 41, fp: 48, edge: 7.0, conf: 64, liq: '$0.28M', tier: 'apex', status: 'APEX', social: 52, rulesHigh: true,
          factors: [{ k: 'Trilogue', v: 0.62 }, { k: 'Rule risk', v: 0.30 }, { k: 'Lobbying', v: 0.55 }],
          thesis: 'Apex · resolution-language risk -12% confidence applied.' },
      ],
    },
    {
      id: 'states', label: 'State politics', edge: 2.1, conf: 54, liq: 72,
      angle: 150, watched: true,
      leaves: [
        { id: 'sig-st',  label: 'CA-22 special election', mp: 64, fp: 67, edge: 3.0, conf: 60, liq: '$0.6M', tier: 'std', status: 'OPEN', social: 41,
          factors: [{ k: 'Local', v: 0.66 }, { k: 'Turnout', v: 0.51 }],
          thesis: 'Edge thin · low conviction cluster.' },
      ],
    },
  ],
};

export function MindMap({ tree = SAMPLE_TREE, onSelect, selectedId }) {
  const [hoverId, setHoverId] = useState(null);

  const W = 940, H = 620, cx = 470, cy = 310;
  const RING1 = 150;
  const RING2 = 260;

  const polar = (deg, r) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const items = useMemo(() => {
    return tree.branches.map((b) => {
      const a = b.angle;
      const subPos = polar(a, RING1);
      const leafPos = polar(a, RING2);
      const midPos = polar(a, (RING1 + RING2) / 2 - 8);
      return { ...b, subPos, leafPos, midPos };
    });
  }, [tree]);

  const hovered = items.find((b) => b.leaves.some((l) => l.id === hoverId));
  const hoveredLeaf = hovered?.leaves.find((l) => l.id === hoverId);

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" style={{ aspectRatio: `${W}/${H}` }}>
        <defs>
          <radialGradient id="centerOrb" cx="50%" cy="40%" r="60%">
            <stop offset="0" stopColor="#1E40AF" stopOpacity="0.95" />
            <stop offset="1" stopColor="#0B0D10" />
          </radialGradient>
          <radialGradient id="halo" cx="50%" cy="50%" r="60%">
            <stop offset="0" stopColor="rgba(37,99,235,0.30)" />
            <stop offset="1" stopColor="rgba(37,99,235,0)" />
          </radialGradient>
          <radialGradient id="haloGold" cx="50%" cy="50%" r="60%">
            <stop offset="0" stopColor="rgba(201,162,75,0.40)" />
            <stop offset="1" stopColor="rgba(201,162,75,0)" />
          </radialGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="rgba(11,13,16,0.10)" />
          </pattern>
        </defs>

        {/* Background dots + concentric rings */}
        <rect x="0" y="0" width={W} height={H} fill="url(#dots)" />
        {[110, 200, 290].map((rr) => (
          <circle key={rr} cx={cx} cy={cy} r={rr} fill="none" stroke="rgba(11,13,16,0.06)" strokeDasharray="2 6" />
        ))}

        {/* Branches */}
        {items.map((b) => {
          const stroke = b.dashed ? 'rgba(154,163,174,0.6)' : b.hot ? '#2563EB' : '#94A3B8';
          const width = 1 + (b.liq / 100) * 5;
          const apexLeaf = b.leaves.find((l) => l.tier === 'apex');
          const watched = b.watched;
          const d = `M ${cx} ${cy} L ${b.subPos.x} ${b.subPos.y} Q ${b.midPos.x} ${b.midPos.y} ${b.leafPos.x} ${b.leafPos.y}`;
          const len = Math.hypot(b.leafPos.x - cx, b.leafPos.y - cy) * 1.3;
          return (
            <g key={b.id}>
              {/* watched halo on the leaf */}
              {watched && <circle cx={b.leafPos.x} cy={b.leafPos.y} r="58" fill="url(#halo)" />}
              {apexLeaf && <circle cx={b.leafPos.x} cy={b.leafPos.y} r="68" fill="url(#haloGold)" />}

              {/* branch path with draw-in */}
              <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth={width}
                strokeLinecap="round"
                strokeDasharray={b.dashed ? '4 6' : undefined}
                opacity={hoverId && !b.leaves.some((l) => l.id === hoverId) ? 0.45 : 1}
                className="draw"
                style={{ '--len': len, transition: 'opacity 200ms ease', filter: b.hot ? 'url(#glow)' : 'none' }}
              />

              {/* sub-topic node */}
              <g transform={`translate(${b.subPos.x} ${b.subPos.y})`}>
                <circle r="20" fill="#FFFFFF" stroke="rgba(11,13,16,0.16)" />
                <circle r="6" fill={b.hot ? '#2563EB' : '#94A3B8'} />
                {b.hot && <circle r="6" fill="none" stroke="rgba(37,99,235,0.55)" className="animate-pulse-slow" />}
                <text y="36" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0B0D10">{b.label}</text>
                <text y="50" textAnchor="middle" fontSize="9.5" fill="#6B7280">{b.leaves.length} mkts · +{b.edge.toFixed(1)}%</text>
              </g>

              {/* edge midpoint badge */}
              <g transform={`translate(${b.midPos.x} ${b.midPos.y})`}>
                <rect x="-32" y="-10" width="64" height="20" rx="10"
                  fill="#FFFFFF" stroke={b.hot ? 'rgba(37,99,235,0.35)' : 'rgba(11,13,16,0.10)'} />
                <text x="0" y="4" textAnchor="middle" fontSize="10.5" fontWeight="700"
                  fill={b.hot ? '#1E40AF' : '#0B0D10'}>+{b.edge.toFixed(1)}%</text>
              </g>
            </g>
          );
        })}

        {/* Center node */}
        <g>
          <circle cx={cx} cy={cy} r="80" fill="url(#centerOrb)" />
          <circle cx={cx} cy={cy} r="80" fill="none" stroke="rgba(37,99,235,0.30)" strokeWidth="1" />
          {/* slow rotating ring with gold satellite */}
          <g className="spin-slow" style={{ transformOrigin: `${cx}px ${cy}px` }}>
            <circle cx={cx} cy={cy} r="100" fill="none" stroke="rgba(37,99,235,0.30)" strokeDasharray="2 8" />
            <circle cx={cx + 100} cy={cy} r="3" fill="#C9A24B" />
          </g>
          <text x={cx} y={cy - 16} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.55)" letterSpacing="0.18em">TOPIC</text>
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="18" fontWeight="700" fill="#FFFFFF">{tree.label}</text>
          <text x={cx} y={cy + 22} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.66)" letterSpacing="0.06em">{tree.meta.markets} mkts · {tree.meta.liquidity}</text>
          <text x={cx} y={cy + 36} textAnchor="middle" fontSize="9.5" fill="rgba(255,255,255,0.54)" letterSpacing="0.12em">Avg edge {tree.meta.avgEdge} · social {tree.meta.socialHeat}</text>
        </g>

        {/* Connector line for hover */}
        {hoveredLeaf && (
          <line
            x1={hovered.leafPos.x} y1={hovered.leafPos.y}
            x2={hovered.leafPos.x + (hovered.leafPos.x > cx ? 130 : -130)} y2={hovered.leafPos.y - 90}
            stroke="rgba(37,99,235,0.55)" strokeDasharray="3 4"
          />
        )}

        {/* Leaves */}
        {items.map((b) =>
          b.leaves.map((leaf, idx) => {
            const offset = idx * 60;
            const lp = b.leafPos;
            // simple radial offset for multi-leaf branches
            const lx = lp.x + (idx === 0 ? 0 : (b.angle > 0 ? -80 : 80));
            const ly = lp.y + (idx === 0 ? 0 : 80);
            const isSelected = selectedId === leaf.id;
            return (
              <g key={leaf.id}>
                <foreignObject x={lx - 110} y={ly - 40} width="220" height="92">
                  <button
                    onMouseEnter={() => setHoverId(leaf.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onClick={() => onSelect?.(leaf)}
                    className={`node-card text-left w-full hairline rounded-lg bg-white px-3 py-2 ${
                      leaf.tier === 'apex' ? 'gold-frame' : ''
                    } ${leaf.rulesHigh ? 'ring-1 ring-negative/40' : ''} ${
                      isSelected ? 'ring-2 ring-cerulean shadow-glow' : ''
                    }`}
                    style={{ boxShadow: '0 12px 30px -16px rgba(11,13,16,0.20)' }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="eyebrow truncate">{b.label}</div>
                      {leaf.tier === 'apex'
                        ? <span className="chip gold"><Lock /> Apex</span>
                        : leaf.fade ? <span className="chip red">Fade</span>
                        : leaf.status === 'MOVING' ? <span className="chip cerulean"><PulseDot /> Move</span>
                        : <span className="chip green">{leaf.status}</span>}
                    </div>
                    <div className="text-[12.5px] font-semibold text-ink mt-0.5 leading-tight truncate">{leaf.label}</div>
                    <div className="mt-1.5"><EdgeBar market={leaf.mp} fair={leaf.fp} /></div>
                    <div className="flex items-center justify-between text-[10px] mt-1 tnum">
                      <span className="text-slate2">+{leaf.edge.toFixed(1)}%</span>
                      <span className="text-slate2">Conf {leaf.conf}%</span>
                      <span className="text-slate2">Liq {leaf.liq}</span>
                      <span className="text-cerulean font-semibold">soc {leaf.social}%</span>
                    </div>
                  </button>
                </foreignObject>
              </g>
            );
          })
        )}

        {/* Hover thesis card */}
        {hoveredLeaf && (
          <foreignObject
            x={hovered.leafPos.x + (hovered.leafPos.x > cx ? 60 : -300)}
            y={hovered.leafPos.y - 170}
            width="280"
            height="180"
          >
            <div className="hairline rounded-xl bg-white p-3 shadow-lift">
              <div className="flex items-center gap-2">
                <span className="chip cerulean">{hovered.label}</span>
                <span className="text-[10.5px] text-slate2 ml-auto">Conf {hoveredLeaf.confLow || hoveredLeaf.conf - 5}–{hoveredLeaf.confHigh || hoveredLeaf.conf + 5}%</span>
              </div>
              <div className="text-[12.5px] font-semibold mt-1 leading-tight">{hoveredLeaf.label}</div>
              <p className="text-[11.5px] text-slate2 mt-1 leading-snug">{hoveredLeaf.thesis}</p>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {hoveredLeaf.factors.map((f) => (
                  <div key={f.k} className="text-[10px]">
                    <div className="flex items-center justify-between text-slate2">
                      <span>{f.k}</span><span className="tnum text-ink font-semibold">{Math.round(f.v * 100)}%</span>
                    </div>
                    <div className="h-1 bg-mist rounded mt-0.5">
                      <div className="h-1 rounded bg-cerulean" style={{ width: `${f.v * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1">
                <button className="btn btn-ghost btn-xs">Inspect</button>
                <button className="btn btn-cerulean btn-xs">Take</button>
                <button className="btn btn-ghost btn-xs ml-auto">Ask AI</button>
              </div>
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
}
