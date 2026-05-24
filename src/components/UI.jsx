import { Link } from 'react-router-dom';

/* -----------------------------------------------------------------
   Generic primitives — kept tiny on purpose. Shared by every page.
   ----------------------------------------------------------------- */

export function Eyebrow({ children, className = '' }) {
  return <div className={`eyebrow ${className}`}>{children}</div>;
}

export function Card({ children, className = '', as: As = 'div', ...rest }) {
  return (
    <As className={`bg-white hairline rounded-xl shadow-card ${className}`} {...rest}>
      {children}
    </As>
  );
}

export function Panel({ children, className = '', dense = false, label = null, action = null }) {
  return (
    <div className={`bg-white hairline rounded-xl ${dense ? 'p-3' : 'p-5'} ${className}`}>
      {(label || action) && (
        <div className="flex items-center justify-between mb-3">
          {label && <Eyebrow>{label}</Eyebrow>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Stat({ label, value, delta, tone = 'ink', sub = null, mono = true }) {
  const toneClass =
    tone === 'positive' ? 'text-positive' :
    tone === 'negative' ? 'text-negative' :
    tone === 'cerulean' ? 'text-cerulean' :
    tone === 'gold'     ? 'text-gold' : 'text-ink';
  return (
    <div>
      <div className="eyebrow">{label}</div>
      <div className={`mt-1 flex items-baseline gap-2 ${mono ? 'tnum' : ''}`}>
        <span className={`text-xl font-semibold tracking-tight ${toneClass}`}>{value}</span>
        {delta && (
          <span className={`text-[11px] font-medium ${delta.startsWith('-') ? 'text-negative' : 'text-positive'}`}>
            {delta}
          </span>
        )}
      </div>
      {sub && <div className="text-[11px] text-slate2 mt-0.5">{sub}</div>}
    </div>
  );
}

export function Chip({ tone = 'default', children, className = '' }) {
  return <span className={`chip ${tone} ${className}`}>{children}</span>;
}

export function PulseDot({ tone = 'cerulean', className = '' }) {
  return <span className={`pulse-dot ${tone} ${className}`} />;
}

export function ConfBand({ value, className = '' }) {
  // Probability band visualization with tick at value (0..100).
  return (
    <div className={`relative w-full h-1.5 rounded-full bg-mist ${className}`}>
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width: `${value}%`,
          background: 'linear-gradient(90deg, #1E40AF 0%, #2563EB 60%, #00BFA6 100%)',
        }}
      />
      <div
        className="absolute -top-1 w-px h-3.5 bg-ink"
        style={{ left: `${value}%` }}
      />
    </div>
  );
}

export function EdgeBar({ market, fair, className = '' }) {
  // Two-bar visualization comparing market price vs Quantzy fair probability.
  const lo = Math.min(market, fair);
  const hi = Math.max(market, fair);
  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-4 bg-mist rounded">
        <div
          className="absolute inset-y-0 rounded"
          style={{
            left: `${lo}%`,
            width: `${hi - lo}%`,
            background: market < fair
              ? 'linear-gradient(90deg, rgba(16,185,129,0.18), rgba(16,185,129,0.55))'
              : 'linear-gradient(90deg, rgba(226,74,74,0.18), rgba(226,74,74,0.55))',
          }}
        />
        <div className="absolute inset-y-0 w-[2px] bg-ink" style={{ left: `${market}%` }} />
        <div className="absolute inset-y-0 w-[2px] bg-cerulean" style={{ left: `${fair}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-slate2 mt-1 tnum">
        <span>Mkt {market}%</span>
        <span className="text-cerulean">Fair {fair}%</span>
      </div>
    </div>
  );
}

export function Sparkbar({ values = [], color = 'currentColor', className = '' }) {
  const max = Math.max(...values, 1);
  return (
    <span className={`sparkbar ${className}`} style={{ color }}>
      {values.map((v, i) => (
        <span key={i} style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </span>
  );
}

export function Sparkline({ values = [], width = 120, height = 28, color = '#2563EB', fill = true, className = '' }) {
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1 || 1);
  const points = values.map((v, i) => [i * step, height - ((v - min) / range) * height]);
  const d = points.map((p, i) => (i ? `L${p[0]},${p[1]}` : `M${p[0]},${p[1]}`)).join(' ');
  const fillD = `${d} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} className={className}>
      {fill && (
        <path d={fillD} fill={color} opacity="0.10" />
      )}
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MiniGauge({ value, label, className = '' }) {
  // Half-circle gauge from 0..100.
  const r = 28;
  const c = Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  const off = c - (c * v) / 100;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="74" height="44" viewBox="0 0 74 44">
        <path d={`M 8 38 A ${r} ${r} 0 0 1 66 38`} stroke="#E6EAF0" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path
          d={`M 8 38 A ${r} ${r} 0 0 1 66 38`}
          stroke="#2563EB"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <div>
        <div className="text-base font-semibold tnum">{v.toFixed(1)}%</div>
        <div className="eyebrow">{label}</div>
      </div>
    </div>
  );
}

export function Divider({ label, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px bg-mist" />
      {label && <span className="eyebrow">{label}</span>}
      <div className="flex-1 h-px bg-mist" />
    </div>
  );
}

export function Tabs({ value, onChange, items = [], className = '' }) {
  return (
    <div className={`inline-flex hairline rounded-lg p-0.5 bg-platinum ${className}`}>
      {items.map((it) => (
        <button
          key={it.value}
          onClick={() => onChange?.(it.value)}
          className={`text-[11.5px] font-semibold px-2.5 h-7 rounded-md tracking-wide ${
            value === it.value ? 'bg-white shadow-card text-ink' : 'text-slate2 hover:text-ink'
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export function Lock({ className = '' }) {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" className={className} aria-hidden="true">
      <path d="M4 7V5a4 4 0 1 1 8 0v2h.5A1.5 1.5 0 0 1 14 8.5v5A1.5 1.5 0 0 1 12.5 15h-9A1.5 1.5 0 0 1 2 13.5v-5A1.5 1.5 0 0 1 3.5 7H4Zm1.5 0h5V5a2.5 2.5 0 0 0-5 0v2Z" fill="currentColor" />
    </svg>
  );
}

export function Arrow({ dir = 'right', size = 14, className = '' }) {
  const r = { right: 0, up: -90, down: 90, left: 180 };
  return (
    <svg viewBox="0 0 14 14" width={size} height={size} className={className} style={{ transform: `rotate(${r[dir] || 0}deg)` }} aria-hidden="true">
      <path d="M2 7h9M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CTA({ to, children, variant = 'cerulean', className = '', size = '' }) {
  const cls = `btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`;
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <button className={cls}>{children}</button>;
}
