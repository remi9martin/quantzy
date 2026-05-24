import { NavLink } from 'react-router-dom';

const MOBILE_NAV = [
  { to: '/app',             label: 'Home',     icon: 'home',  end: true },
  { to: '/app/scanner',     label: 'Scanner',  icon: 'orbit' },
  { to: '/app/feed',        label: 'Feed',     icon: 'lightning' },
  { to: '/app/social',      label: 'Social',   icon: 'people' },
  { to: '/app/analyst',     label: 'Ask',      icon: 'spark' },
];

function Icon({ name, active }) {
  const stroke = active ? '#0B0D10' : '#6B7280';
  switch (name) {
    case 'home': return (
      <svg viewBox="0 0 20 20" width="20" height="20"><path d="M3 9.5 10 4l7 5.5V16a1 1 0 0 1-1 1h-3v-5H9v5H4a1 1 0 0 1-1-1V9.5Z" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" /></svg>
    );
    case 'orbit': return (
      <svg viewBox="0 0 20 20" width="20" height="20"><circle cx="10" cy="10" r="3" stroke={stroke} strokeWidth="1.6" fill="none" /><ellipse cx="10" cy="10" rx="7" ry="3" stroke={stroke} strokeWidth="1.6" fill="none" transform="rotate(-30 10 10)" /></svg>
    );
    case 'lightning': return (
      <svg viewBox="0 0 20 20" width="20" height="20"><path d="M11 2 4 12h5l-1 6 7-10h-5l1-6Z" fill={active ? '#2563EB' : 'none'} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" /></svg>
    );
    case 'people': return (
      <svg viewBox="0 0 20 20" width="20" height="20"><circle cx="7" cy="8" r="2.5" stroke={stroke} strokeWidth="1.6" fill="none" /><circle cx="13.5" cy="9" r="2" stroke={stroke} strokeWidth="1.6" fill="none" /><path d="M2.5 16c.5-2.5 2.5-4 4.5-4s3.5 1.5 4 3.5" stroke={stroke} strokeWidth="1.6" fill="none" /><path d="M11.5 16c.5-2 2-3 3.5-3s2.5 1 3 2.5" stroke={stroke} strokeWidth="1.6" fill="none" /></svg>
    );
    case 'spark': return (
      <svg viewBox="0 0 20 20" width="20" height="20"><path d="M10 2v4M10 14v4M2 10h4M14 10h4M5 5l2.5 2.5M12.5 12.5 15 15M5 15l2.5-2.5M12.5 7.5 15 5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" /></svg>
    );
    default: return null;
  }
}

export function MobileBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/92 backdrop-blur-md border-t border-mist" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}>
      <ul className="grid grid-cols-5 h-14">
        {MOBILE_NAV.map((n) => (
          <li key={n.to}>
            <NavLink
              to={n.to}
              end={n.end}
              className="h-full flex flex-col items-center justify-center gap-0.5"
            >
              {({ isActive }) => (
                <>
                  <Icon name={n.icon} active={isActive} />
                  <span className={`text-[10px] tracking-wide ${isActive ? 'text-ink font-semibold' : 'text-slate2'}`}>{n.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* Bottom-sheet drawer for mobile right-inspector / overlays. */
export function Drawer({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="lg:hidden fixed inset-0 z-40">
      <button aria-label="Close" onClick={onClose}
        className="absolute inset-0 bg-ink/40" />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lift max-h-[88vh] overflow-y-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-mist px-4 py-3 flex items-center gap-2">
          <span className="block h-1 w-10 bg-mist rounded-full mx-auto absolute left-1/2 -translate-x-1/2 -top-2" />
          <div className="text-[13px] font-semibold">{title}</div>
          <button onClick={onClose} className="ml-auto btn btn-ghost btn-xs">Close</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
