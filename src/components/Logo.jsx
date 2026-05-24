import { MascotMark } from './Mascot.jsx';

// "Quant" in clean sans + "zy" in italic serif.
export function Wordmark({ size = 22, color = '#0B0D10', className = '' }) {
  return (
    <span className={`inline-flex items-baseline ${className}`} style={{ color, lineHeight: 1 }}>
      <span style={{ fontSize: size, fontWeight: 600, letterSpacing: '-0.01em' }}>Quant</span>
      <span
        className="italic-q"
        style={{ fontSize: size * 1.04, fontWeight: 500, marginLeft: -1 }}
      >
        zy
      </span>
    </span>
  );
}

export function Logo({ size = 22, color, withMark = true, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {withMark && <MascotMark size={Math.round(size * 1.4)} />}
      <Wordmark size={size} color={color} />
    </span>
  );
}

// A small monogram badge for nav bars / status displays.
export function QBadge({ size = 26, tone = 'gold', className = '' }) {
  const fill = tone === 'gold' ? 'url(#q-gold)' : tone === 'cerulean' ? 'url(#q-blue)' : '#0B0D10';
  const ink  = tone === 'dark' ? '#F4D88A' : '#3B2A07';
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
      <defs>
        <linearGradient id="q-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4D88A" />
          <stop offset="0.6" stopColor="#C9A24B" />
          <stop offset="1" stopColor="#8E6E2A" />
        </linearGradient>
        <linearGradient id="q-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill={fill} stroke="rgba(0,0,0,0.18)" />
      <text
        x="16" y="22" textAnchor="middle"
        fontFamily="Playfair Display, Georgia, serif"
        fontStyle="italic" fontWeight="700"
        fontSize="18" fill={ink}
      >
        Q
      </text>
    </svg>
  );
}
