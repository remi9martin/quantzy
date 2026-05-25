import { useLevel, LEVELS } from './LevelContext.jsx';

export function LevelSelector({ className = '' }) {
  const { level, setLevel } = useLevel();

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-[10.5px] tracking-wider2 uppercase text-slate1 font-semibold whitespace-nowrap">
          Complexity
        </span>
        <div className="relative flex items-center gap-0 w-full max-w-[260px]">
          {/* track */}
          <div className="absolute inset-y-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-white/10 rounded-full" />
          <div
            className="absolute inset-y-1/2 -translate-y-1/2 left-0 h-1 rounded-full transition-all"
            style={{
              width: `${((level - 1) / 4) * 100}%`,
              background: 'linear-gradient(90deg, #10B981, #2563EB, #C9A24B)',
            }}
          />
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              title={`${l.label} — ${l.tag}`}
              className="relative z-10 flex-1 flex items-center justify-center"
            >
              <span
                className={`block h-5 w-5 rounded-full border-2 transition-all ${
                  l.id === level
                    ? 'bg-cerulean border-cerulean scale-110 shadow-glow'
                    : l.id < level
                    ? 'bg-cerulean/60 border-cerulean/60'
                    : 'bg-graphite border-white/10 hover:border-slate1'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      {/* Labels */}
      <div className="flex max-w-[260px] ml-auto">
        {LEVELS.map((l) => (
          <div key={l.id} className="flex-1 text-center">
            <span className={`text-[9px] tracking-wider2 uppercase ${l.id === level ? 'text-cerulean font-bold' : 'text-slate1'}`}>
              {l.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LevelBadge({ className = '' }) {
  const { levelData } = useLevel();
  return (
    <span className={`chip cerulean ${className}`}>
      Lvl {levelData.id} · {levelData.label}
    </span>
  );
}
