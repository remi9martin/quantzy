import { createContext, useContext, useState, useEffect } from 'react';

/* -------------------------------------------------------------------------- */
/* 5 complexity levels — each controls what UI elements are visible           */
/* -------------------------------------------------------------------------- */

export const LEVELS = [
  {
    id: 1,
    label: 'Starter',
    tag: 'Just the bets',
    desc: 'Simple view. See trending markets, what the model recommends, and whether it looks good or bad. No jargon.',
    features: ['trending', 'simple-cards', 'take-skip'],
  },
  {
    id: 2,
    label: 'Explorer',
    tag: 'Edge + confidence',
    desc: 'See how much edge a bet has, how confident the model is, and filter by topic. Start learning the language.',
    features: ['edge', 'confidence', 'filters', 'sparklines', 'topics'],
  },
  {
    id: 3,
    label: 'Analyst',
    tag: 'Full scanner + social',
    desc: 'Unlock the mind-map scanner, follow traders, see who is taking or fading each bet, and track your calibration.',
    features: ['scanner', 'social', 'calibration', 'alerts', 'catalyst', 'missed-wins'],
  },
  {
    id: 4,
    label: 'Quant',
    tag: 'Probability decomposition',
    desc: 'See every factor that goes into the model, probability waterfall, Brier scores, copy-trade configurator, and the challenge arena.',
    features: ['decomposition', 'brier', 'copy-trade', 'challenges', 'teams', 'vault'],
  },
  {
    id: 5,
    label: 'Operator',
    tag: 'Full terminal',
    desc: 'Everything unlocked. Multiple map views, constellation, radar, heatmap. AI Analyst. Apex tier signals. You are the quant.',
    features: ['all'],
  },
];

const KEY = 'quantzy_level';

const LevelContext = createContext({
  level: 1,
  setLevel: () => {},
  hasFeature: () => false,
  levelData: LEVELS[0],
});

export function LevelProvider({ children }) {
  const [level, setLevelRaw] = useState(() => {
    if (typeof window === 'undefined') return 1;
    const saved = parseInt(window.localStorage.getItem(KEY) || '1', 10);
    return saved >= 1 && saved <= 5 ? saved : 1;
  });

  useEffect(() => {
    window.localStorage.setItem(KEY, String(level));
  }, [level]);

  const setLevel = (v) => setLevelRaw(Math.max(1, Math.min(5, v)));

  const levelData = LEVELS[level - 1];

  const hasFeature = (feat) => {
    if (level >= 5) return true;
    for (let i = 0; i < level; i++) {
      if (LEVELS[i].features.includes(feat) || LEVELS[i].features.includes('all')) return true;
    }
    return false;
  };

  return (
    <LevelContext.Provider value={{ level, setLevel, hasFeature, levelData }}>
      {children}
    </LevelContext.Provider>
  );
}

export function useLevel() {
  return useContext(LevelContext);
}
