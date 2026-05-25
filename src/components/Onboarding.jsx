import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MascotMark } from './Mascot.jsx';

const KEY = 'quantzy_onboarded';

const STEPS = [
  { title: 'The Scanner is the centerpiece.',  body: 'Pick a topic, the mind-map explodes it into branches of opportunity. Click any leaf to inspect.', cta: 'Open Scanner', to: '/app/scanner' },
  { title: 'Calibration is public.',           body: 'Every confidence band is benchmarked against real resolutions. Audit the model before you trust it.', cta: 'See history', to: '/app/historical' },
  { title: 'Follow the calibrators.',          body: 'Top-decile traders by calibration boost composite conviction. Mirror their picks with risk caps.', cta: 'Open Social', to: '/app/social' },
  { title: 'Beat the model.',                  body: 'Submit your own probability on any market. Score on calibration, not raw P&L.', cta: 'Enter arena', to: '/app/challenges' },
];

export function OnboardingHint() {
  const [step, setStep]   = useState(0);
  const [open, setOpen]   = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = window.localStorage.getItem(KEY);
    if (!seen) setOpen(true);
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(KEY, '1');
    setOpen(false);
  };

  if (!open) return null;
  const s = STEPS[step];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onb-title"
      className="fixed bottom-20 lg:bottom-6 right-6 z-30 hairline rounded-2xl bg-carbon shadow-lift p-4 max-w-[340px] animate-[fade_240ms_ease-out]"
    >
      <div className="flex items-start gap-2.5">
        <MascotMark size={32} />
        <div className="min-w-0 flex-1">
          <div className="eyebrow">Step {step + 1} of {STEPS.length}</div>
          <div id="onb-title" className="font-display text-[18px] tracking-tight leading-tight mt-0.5 text-white">{s.title}</div>
          <p className="text-[12px] text-slate1 mt-1">{s.body}</p>
        </div>
        <button onClick={dismiss} aria-label="Skip onboarding" className="text-slate1 hover:text-white text-[16px] leading-none">×</button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Link to={s.to} onClick={dismiss} className="btn btn-cerulean btn-sm">{s.cta}</Link>
        <button onClick={() => step < STEPS.length - 1 ? setStep(step + 1) : dismiss()} className="btn btn-ghost btn-sm">
          {step < STEPS.length - 1 ? 'Next' : 'Done'}
        </button>
        <span className="ml-auto inline-flex gap-1">
          {STEPS.map((_, i) => (
            <span key={i} className={`block h-1.5 w-1.5 rounded-full ${i === step ? 'bg-cerulean' : 'bg-white/10'}`} />
          ))}
        </span>
      </div>
    </div>
  );
}
