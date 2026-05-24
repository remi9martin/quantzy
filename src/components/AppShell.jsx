import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Logo, QBadge } from './Logo.jsx';
import { Chip, PulseDot } from './UI.jsx';
import { MobileBottomNav, Drawer } from './MobileNav.jsx';
import { OnboardingHint } from './Onboarding.jsx';
import { LevelSelector } from './LevelSelector.jsx';
import { GuideBot } from './GuideBot.jsx';
import { useLevel } from './LevelContext.jsx';

const APP_NAV = [
  { to: '/app',              label: 'Dashboard',   end: true, minLevel: 1 },
  { to: '/app/scanner',      label: 'Scanner',     minLevel: 3 },
  { to: '/app/explore',      label: 'Explore',     minLevel: 1 },
  { to: '/app/feed',         label: 'Edge Feed',   minLevel: 1 },
  { to: '/app/historical',   label: 'Historical',  minLevel: 2 },
  { to: '/app/missed',       label: 'Missed',      minLevel: 3 },
  { to: '/app/social',       label: 'Social',      minLevel: 3 },
  { to: '/app/leaderboard',  label: 'League',      minLevel: 3 },
  { to: '/app/challenges',   label: 'Challenges',  minLevel: 4 },
  { to: '/app/calibration',  label: 'Calibration', minLevel: 3 },
  { to: '/app/alerts',       label: 'Alerts',      minLevel: 3 },
  { to: '/app/vault',        label: 'Vault',       minLevel: 4 },
  { to: '/app/analyst',      label: 'AI Analyst',  minLevel: 5 },
];

function StatusBar() {
  return (
    <div className="hidden md:flex items-center gap-5 px-4 h-8 text-[10.5px] tracking-wider2 uppercase text-slate2 surface-platinum hairline border-x-0 border-t-0">
      <span className="inline-flex items-center gap-2">
        <PulseDot tone="green" />
        <span>Markets sync · live</span>
      </span>
      <span>Active edge <span className="text-positive font-semibold tnum">+7.38%</span></span>
      <span>Hit rate <span className="text-ink font-semibold tnum">78.3%</span></span>
      <span>Open opps <span className="text-ink font-semibold tnum">23</span></span>
      <span>Markets <span className="text-ink font-semibold tnum">2,841</span></span>
      <span>Missed wins <span className="text-warn font-semibold tnum">6</span></span>
      <span className="ml-auto inline-flex items-center gap-2">
        <span>League rank</span>
        <span className="chip cerulean">Silver II · #412</span>
        <span className="text-slate2">Followed traders</span>
        <span className="font-semibold text-ink tnum">8 active</span>
      </span>
    </div>
  );
}

function TopNav({ onOpenMenu }) {
  const { level } = useLevel();
  const visibleNav = APP_NAV.filter((n) => n.minLevel <= level);
  return (
    <header className="sticky top-0 z-30 surface-paper border-b border-mist">
      <div className="flex items-center gap-3 px-4 h-14">
        <button
          onClick={onOpenMenu}
          className="lg:hidden h-9 w-9 -ml-1 rounded-md hairline bg-white inline-flex items-center justify-center"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
        <Link to="/app" className="flex items-center gap-2.5">
          <Logo size={20} />
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5 ml-3">
          {visibleNav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `px-2.5 h-8 inline-flex items-center text-[12px] font-medium rounded-md ${
                  isActive
                    ? 'bg-ink text-white'
                    : 'text-slate2 hover:text-ink hover:bg-mist'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <LevelSelector className="hidden lg:block" />
          <div className="hidden md:flex items-center h-9 px-3 rounded-md bg-platinum hairline text-[12px] text-slate2 w-60">
            <svg viewBox="0 0 16 16" width="14" height="14" className="text-slate1 mr-2"><path d="M11 11l3 3m-2-7a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
            <span>Search…</span>
            <span className="ml-auto text-[10px] tracking-wider2 uppercase text-slate1">⌘K</span>
          </div>
          <Link to="/app/tiers" className="btn btn-gold btn-sm hidden md:inline-flex">
            Upgrade
          </Link>
          <button className="h-9 w-9 rounded-md hairline bg-white inline-flex items-center justify-center" aria-label="Notifications">
            <svg viewBox="0 0 16 16" width="15" height="15"><path d="M8 1.5a4 4 0 0 0-4 4v3.4l-1.3 1.7a.5.5 0 0 0 .4.8h9.8a.5.5 0 0 0 .4-.8L12 8.9V5.5a4 4 0 0 0-4-4ZM6.5 13a1.5 1.5 0 0 0 3 0h-3Z" fill="currentColor" /></svg>
          </button>
          <Link to="/app/settings" className="h-9 w-9 rounded-full bg-ink text-white inline-flex items-center justify-center text-[11px] font-semibold relative">
            RM
            <span className="absolute -bottom-0.5 -right-0.5 chip gold !h-3.5 !px-1 !text-[8px]">S2</span>
          </Link>
        </div>
      </div>
      <StatusBar />
    </header>
  );
}

function LeftRail() {
  const niches = [
    { label: 'NBA Playoffs', count: 24, hot: true },
    { label: 'US Politics',  count: 41 },
    { label: 'AI Regulation', count: 12, hot: true },
    { label: 'Bitcoin & ETFs', count: 18 },
    { label: 'Fed Rates',     count: 9 },
    { label: 'Macro Prints',  count: 14 },
    { label: 'Culture',       count: 7 },
  ];
  const traders = [
    { name: 'kaldera',   tier: 'Apex',     pl: '+18.4%' },
    { name: 'fadeking',  tier: 'Platinum', pl: '+11.2%' },
    { name: 'oddsoracle', tier: 'Gold',    pl: '+9.8%'  },
    { name: 'macroprint', tier: 'Platinum', pl: '+7.1%' },
  ];
  return (
    <aside className="hidden xl:block w-60 shrink-0 border-r border-mist bg-white/40 backdrop-blur-sm">
      <div className="px-4 py-4 space-y-5 sticky top-[88px]">
        <div>
          <div className="eyebrow mb-2">My Niches</div>
          <ul className="space-y-1">
            {niches.map((n) => (
              <li key={n.label} className="flex items-center justify-between text-[12px]">
                <span className="inline-flex items-center gap-2">
                  {n.hot && <span className="pulse-dot" />}
                  <span className="text-ink">{n.label}</span>
                </span>
                <span className="tnum text-slate2">{n.count}</span>
              </li>
            ))}
          </ul>
          <button className="btn btn-ghost btn-xs w-full mt-3">+ Add niche</button>
        </div>

        <div>
          <div className="eyebrow mb-2">Saved Scans</div>
          <ul className="space-y-1.5 text-[12px]">
            <li className="flex items-center justify-between"><span>NBA · totals · &lt; 24h</span><span className="text-positive tnum">+8.2%</span></li>
            <li className="flex items-center justify-between"><span>Politics · clean rules</span><span className="text-positive tnum">+5.4%</span></li>
            <li className="flex items-center justify-between"><span>AI · catalyst &lt; 7d</span><span className="text-positive tnum">+11.1%</span></li>
            <li className="flex items-center justify-between"><span>Macro · CPI window</span><span className="text-slate2 tnum">+0.8%</span></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-2">Followed traders</div>
          <ul className="space-y-1.5 text-[12px]">
            {traders.map((t) => (
              <li key={t.name} className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-mist text-[9px] inline-flex items-center justify-center font-semibold uppercase">{t.name.slice(0,2)}</span>
                  <span>@{t.name}</span>
                </span>
                <span className="text-positive tnum text-[11px]">{t.pl}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-2">Risk Mode</div>
          <div className="inline-flex hairline rounded-md p-0.5 bg-platinum w-full">
            {['Cons.','Bal.','Aggr.','Degen'].map((m, i) => (
              <button key={m} className={`flex-1 text-[11px] h-7 rounded ${i === 1 ? 'bg-white shadow-card text-ink font-semibold' : 'text-slate2'}`}>{m}</button>
            ))}
          </div>
          <div className="mt-2 flex gap-1.5">
            <Chip tone="cerulean">Polymarket</Chip>
            <Chip tone="cerulean">Kalshi</Chip>
            <Chip>Sports</Chip>
            <Chip>Crypto</Chip>
          </div>
        </div>

        <div className="rounded-lg gold-frame bg-gradient-to-br from-[#fff8e8] to-[#fff] p-3">
          <div className="flex items-center gap-2">
            <QBadge size={20} />
            <div className="eyebrow text-[#7E5E22]">Apex tier</div>
          </div>
          <p className="text-[11.5px] mt-1 text-ink leading-snug">
            3 hidden premium branches in your niches today.
          </p>
          <Link to="/app/tiers" className="btn btn-gold btn-xs mt-2 w-full">Unlock</Link>
        </div>
      </div>
    </aside>
  );
}

export function AppShell() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { level } = useLevel();
  // Scanner page uses its own rail layout, so we suppress the LeftRail there.
  const fullBleed = location.pathname.startsWith('/app/scanner');
  return (
    <div className="min-h-screen flex flex-col surface-paper">
      <TopNav onOpenMenu={() => setMenuOpen(true)} />
      <div className="flex-1 flex">
        {!fullBleed && <LeftRail />}
        <main id="main" className="flex-1 min-w-0 pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
      <GuideBot />
      <OnboardingHint />
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu">
        <div className="mb-3 lg:hidden"><LevelSelector /></div>
        <ul className="grid grid-cols-2 gap-2">
          {APP_NAV.filter((n) => n.minLevel <= level).map((n) => (
            <li key={n.to}>
              <NavLink
                to={n.to}
                end={n.end}
                onClick={() => setMenuOpen(false)}
                className="block hairline rounded-md px-3 py-2.5 text-[13px] font-medium hover:bg-platinum"
              >
                {n.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to="/app/tiers" onClick={() => setMenuOpen(false)} className="btn btn-gold btn-sm">Upgrade · Apex</Link>
          <Link to="/app/settings" onClick={() => setMenuOpen(false)} className="btn btn-ghost btn-sm">Settings</Link>
        </div>
      </Drawer>
    </div>
  );
}
