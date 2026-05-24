// Stylized white fox-dog companion mascot for Quantzy.
// Geometric SVG illustration — not photoreal, but reads as the same character
// as the brand sheet (white body, blue collar, gold Q tag, soft blush ears).

export function Mascot({ size = 220, sit = true, expression = 'alert', className = '' }) {
  return (
    <svg
      viewBox="0 0 320 360"
      width={size}
      height={size * (sit ? 360 / 320 : 280 / 320)}
      className={className}
      role="img"
      aria-label="Quantzy companion"
    >
      <defs>
        <linearGradient id="bodyShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E7ECF3" />
        </linearGradient>
        <linearGradient id="bellyShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F2F4F7" />
        </linearGradient>
        <linearGradient id="collar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
        <radialGradient id="tag" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#F4D88A" />
          <stop offset="0.6" stopColor="#C9A24B" />
          <stop offset="1" stopColor="#8E6E2A" />
        </radialGradient>
        <radialGradient id="eye" cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor="#9CC8FF" />
          <stop offset="0.7" stopColor="#1E40AF" />
          <stop offset="1" stopColor="#0B0D10" />
        </radialGradient>
        <radialGradient id="cheek" cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor="rgba(255,182,193,0.55)" />
          <stop offset="1" stopColor="rgba(255,182,193,0)" />
        </radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>
      </defs>

      {/* Soft shadow under */}
      {sit && (
        <ellipse cx="160" cy="338" rx="92" ry="10" fill="rgba(11,13,16,0.10)" />
      )}

      {/* Tail */}
      <g>
        <path
          d="M232 248
             C 280 240 296 200 280 170
             C 268 148 240 144 224 168
             C 216 180 214 196 220 212
             Z"
          fill="url(#bodyShade)"
          stroke="#0B0D10"
          strokeWidth="1.2"
        />
        <path
          d="M272 178
             C 290 198 286 220 264 232
             C 274 218 276 200 272 178 Z"
          fill="#0B0D10"
          opacity="0.85"
        />
      </g>

      {/* Body */}
      <path
        d="M110 320
           C 92 300 80 270 86 240
           C 92 210 116 192 152 188
           C 200 184 240 200 252 230
           C 262 254 254 286 232 308
           C 220 320 200 326 180 326
           L 130 326
           Z"
        fill="url(#bodyShade)"
        stroke="#0B0D10"
        strokeWidth="1.4"
      />

      {/* Front legs / paws */}
      <g stroke="#0B0D10" strokeWidth="1.2">
        <path d="M150 300 L 144 332 L 168 332 L 170 304 Z" fill="#FFFFFF" />
        <path d="M196 300 L 192 332 L 216 332 L 218 304 Z" fill="#FFFFFF" />
        <path d="M144 332 h 24" stroke="#0B0D10" strokeWidth="1" opacity="0.4" />
        <path d="M192 332 h 24" stroke="#0B0D10" strokeWidth="1" opacity="0.4" />
        {/* Black paw socks */}
        <rect x="142" y="324" width="28" height="10" rx="4" fill="#0B0D10" />
        <rect x="190" y="324" width="28" height="10" rx="4" fill="#0B0D10" />
      </g>

      {/* Belly highlight */}
      <path
        d="M138 244
           C 150 224 196 220 222 240
           C 230 256 226 286 208 304
           C 188 318 152 316 138 296 Z"
        fill="url(#bellyShade)"
        opacity="0.95"
      />

      {/* Head */}
      <g>
        <path
          d="M160 80
             C 110 84 86 124 92 168
             C 96 196 122 218 160 220
             C 198 218 224 196 228 168
             C 234 124 210 84 160 80 Z"
          fill="url(#bodyShade)"
          stroke="#0B0D10"
          strokeWidth="1.4"
        />

        {/* Ears */}
        <path
          d="M104 102
             L 92 50
             L 132 84 Z"
          fill="#FFFFFF"
          stroke="#0B0D10"
          strokeWidth="1.4"
        />
        <path
          d="M104 102
             L 96 64
             L 122 86 Z"
          fill="#0B0D10"
          opacity="0.92"
        />
        {/* Right ear (slightly drooped) */}
        <path
          d="M214 96
             L 244 60
             L 226 110 Z"
          fill="#FFFFFF"
          stroke="#0B0D10"
          strokeWidth="1.4"
        />
        <path
          d="M218 100
             L 238 72
             L 226 104 Z"
          fill="#0B0D10"
          opacity="0.92"
        />

        {/* Black mask accents (subtle on cheekbones) */}
        <path d="M120 154 q 16 -8 28 -2" stroke="#0B0D10" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.18" />
        <path d="M196 152 q -16 -8 -28 -2" stroke="#0B0D10" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.18" />

        {/* Cheeks blush */}
        <ellipse cx="124" cy="174" rx="16" ry="8" fill="url(#cheek)" />
        <ellipse cx="196" cy="174" rx="16" ry="8" fill="url(#cheek)" />

        {/* Eyes — large, blue, with highlight */}
        <g>
          <ellipse cx="136" cy="156" rx="11" ry="13" fill="#FFFFFF" stroke="#0B0D10" strokeWidth="1.2" />
          <ellipse cx="184" cy="156" rx="11" ry="13" fill="#FFFFFF" stroke="#0B0D10" strokeWidth="1.2" />
          <ellipse cx="138" cy="158" rx="7" ry="9" fill="url(#eye)" />
          <ellipse cx="186" cy="158" rx="7" ry="9" fill="url(#eye)" />
          <circle cx="140" cy="155" r="2.2" fill="#FFFFFF" />
          <circle cx="188" cy="155" r="2.2" fill="#FFFFFF" />
          {expression === 'sleepy' && (
            <>
              <path d="M126 152 q 10 6 20 0" stroke="#0B0D10" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <path d="M174 152 q 10 6 20 0" stroke="#0B0D10" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* Nose */}
        <path
          d="M154 184 Q 160 180 166 184 Q 164 192 160 192 Q 156 192 154 184 Z"
          fill="#0B0D10"
        />
        {/* Muzzle line */}
        <path d="M160 192 V 202" stroke="#0B0D10" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M160 202 q -6 6 -12 4" stroke="#0B0D10" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M160 202 q 6 6 12 4"   stroke="#0B0D10" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>

      {/* Collar */}
      <g>
        <path
          d="M118 224
             C 138 240 182 240 202 224
             L 206 236
             C 182 254 138 254 114 236 Z"
          fill="url(#collar)"
          stroke="#0B0D10"
          strokeWidth="1"
        />
        {/* stitches */}
        <path d="M124 232 Q 160 246 196 232" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" strokeDasharray="2 3" />

        {/* Gold Q tag */}
        <g transform="translate(160 248)">
          <circle r="14" fill="url(#tag)" stroke="#7E5E22" strokeWidth="1.2" />
          <circle r="9.5" fill="none" stroke="#7E5E22" strokeWidth="0.8" opacity="0.6" />
          <text
            x="0" y="4.5" textAnchor="middle"
            fontFamily="Playfair Display, Georgia, serif"
            fontStyle="italic" fontWeight="700"
            fontSize="14"
            fill="#3B2A07"
          >Q</text>
        </g>
      </g>
    </svg>
  );
}

// Compact head-only version for nav/avatar use.
export function MascotMark({ size = 28, className = '' }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="mm-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E7ECF3" />
        </linearGradient>
        <linearGradient id="mm-collar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="#0B0D10" opacity="0.04" />
      {/* ears */}
      <path d="M14 22 L10 6 L24 16 Z" fill="#FFFFFF" stroke="#0B0D10" strokeWidth="1" />
      <path d="M50 18 L58 6 L52 24 Z" fill="#FFFFFF" stroke="#0B0D10" strokeWidth="1" />
      <path d="M14 22 L11 12 L20 18 Z" fill="#0B0D10" />
      <path d="M52 22 L56 12 L52 22 Z" fill="#0B0D10" />
      {/* head */}
      <path d="M32 14 C 16 14 10 30 14 42 C 18 52 28 56 32 56 C 36 56 46 52 50 42 C 54 30 48 14 32 14 Z" fill="url(#mm-body)" stroke="#0B0D10" strokeWidth="1.2" />
      {/* eyes */}
      <ellipse cx="24" cy="34" rx="3" ry="3.5" fill="#0B0D10" />
      <ellipse cx="40" cy="34" rx="3" ry="3.5" fill="#0B0D10" />
      <circle cx="25" cy="33" r="0.8" fill="#FFFFFF" />
      <circle cx="41" cy="33" r="0.8" fill="#FFFFFF" />
      {/* nose */}
      <path d="M30 42 Q 32 40 34 42 Q 33 45 32 45 Q 31 45 30 42 Z" fill="#0B0D10" />
      {/* collar hint */}
      <path d="M16 50 C 24 56 40 56 48 50 L 50 56 C 40 60 24 60 14 56 Z" fill="url(#mm-collar)" />
      <circle cx="32" cy="58" r="3" fill="#C9A24B" stroke="#7E5E22" strokeWidth="0.6" />
    </svg>
  );
}
