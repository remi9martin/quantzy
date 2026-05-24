import { useState, useEffect } from 'react';
import { useLevel, LEVELS } from './LevelContext.jsx';
import { MascotMark } from './Mascot.jsx';

const FAQ = [
  { q: 'What is this platform?', a: 'Quantzy scans prediction markets (Polymarket, Kalshi, sports books, crypto) and tells you which bets have the best chance of being mispriced. It shows you what the model thinks the real probability is vs what the market says — that gap is called "edge".' },
  { q: 'What is edge?', a: 'Edge is the difference between what the market says and what Quantzy\'s model thinks the truth is. If the market says 51% and the model says 58%, the edge is +7%. The bigger the edge, the better the opportunity might be.' },
  { q: 'What is confidence?', a: 'Confidence is how sure the model is about its own estimate. A high-confidence signal (80%+) means the model has strong data backing the call. Lower confidence means it\'s less certain — could still be right, but treat it with more caution.' },
  { q: 'What is liquidity?', a: 'Liquidity is how much money is available in the market. High liquidity = you can get in and out easily. Low liquidity = your bet might move the price, or be hard to exit. Generally, higher liquidity is safer.' },
  { q: 'What is calibration?', a: 'Calibration measures whether the model is honest about its confidence. If it says "80% likely" on 100 different events, about 80 should actually happen. Quantzy publishes its calibration so you can audit it.' },
  { q: 'What are the complexity levels?', a: `There are 5 levels — you control the pace:\n\n  1. Starter — Simple trending bets, take or skip.\n  2. Explorer — See edge %, confidence, filters.\n  3. Analyst — Mind-map scanner, social trading, alerts.\n  4. Quant — Probability decomposition, copy-trade.\n  5. Operator — Full terminal, everything unlocked.\n\nUse the dot-slider at the top of the screen to switch. Or just tell me "level up" or "too complex" right here.` },
  { q: 'How do I level up?', a: 'Two ways:\n\n1. The dot-slider at the top of the page (5 dots, drag right to increase complexity)\n2. Just type "level up" here and I\'ll bump it for you\n\nNo test, no gate — go at your own speed. I\'d recommend spending a few minutes at each level before stepping up.' },
  { q: 'Is this real money?', a: 'Right now Quantzy is an intelligence layer — it shows you opportunities and lets you paper-track (simulate) your decisions. It does not place bets for you. If you want to trade, you go to the actual venue (Polymarket, Kalshi, etc.) and execute there.' },
  { q: 'What should I do first?', a: 'At Level 1, just browse the feed and see which bets look interesting. Tap "Take" on ones you\'d bet on, "Skip" on ones you wouldn\'t. Over time, Quantzy tracks whether you would have been right. That\'s your first calibration lesson.' },
  { q: 'Who is Remi?', a: 'Remi built Quantzy. If I can\'t answer a question, I\'ll tell you to ask Remi directly. I\'m the AI guide — I know the platform, but Remi knows the vision.' },
  { q: 'What page am I on?', a: 'I can see your complexity level but not which page you\'re looking at. Here\'s a quick tour:\n\n- Dashboard: your home base, top opportunities at a glance\n- Edge Feed: all ranked bets, sortable by edge, confidence, etc.\n- Explore: browse by topic (politics, NBA, crypto, etc.)\n- Scanner (Level 3+): the mind-map that explodes a topic into branches\n- Social (Level 3+): follow top traders, copy their picks\n- Historical (Level 2+): proof that the model\'s confidence is calibrated\n\nAsk about any page and I\'ll explain what it shows.' },
  { q: 'What is the scanner?', a: 'The Scanner is the centerpiece of Quantzy. You pick a topic (like "US Politics" or "NBA Playoffs") and it explodes into a visual mind-map of every related market. Each branch shows the edge, confidence, and liquidity. You click a leaf to inspect the full thesis.\n\nIt unlocks at Level 3 (Analyst). Want me to level you up?' },
  { q: 'What is social trading?', a: 'Social trading means you can follow other users who are good at picking which Quantzy signals to act on. You can see their hit rate, calibration score, and ROI. At Level 4 you can even mirror their picks automatically with the copy-trade configurator.\n\nUnlocks at Level 3.' },
];

const WELCOME = `To Avery & Team:

Welcome to Quantzy. This is a prediction-market intelligence platform — it can get very powerful, but we're starting you at the simplest level so nothing is overwhelming.

There are 5 complexity tiers. Right now you're on Level 1 (Starter) — just trending bets and whether they look good or not.

To level up, use the dot-slider at the top of the screen:
  [ 1 ]---[ 2 ]---[ 3 ]---[ 4 ]---[ 5 ]
  Starter → Explorer → Analyst → Quant → Operator

Each level adds more features and data. You control the pace — no gates, no tests.

Ask me anything below to understand each page and the thought process behind it. If I don't know, I'll tell you to ask Remi.`;

export function GuideBot() {
  const [open, setOpen] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);
  const [msgs, setMsgs] = useState([
    { who: 'bot', text: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const { level, setLevel, levelData } = useLevel();

  // Auto-open on first visit so Avery sees it immediately.
  useEffect(() => {
    if (autoOpened) return;
    const seen = window.localStorage.getItem('quantzy_guide_seen');
    if (!seen) {
      setOpen(true);
      setAutoOpened(true);
      window.localStorage.setItem('quantzy_guide_seen', '1');
    }
  }, [autoOpened]);

  function respond(text) {
    if (!text.trim()) return;
    const userMsg = { who: 'user', text: text.trim() };
    const lower = text.toLowerCase();

    let reply;
    const match = FAQ.find((f) => {
      const words = f.q.toLowerCase().split(' ').filter((w) => w.length > 3);
      return words.some((w) => lower.includes(w));
    });

    if (match) {
      reply = match.a;
    } else if (lower.includes('level up') || lower.includes('next level') || lower.includes('upgrade') || lower.includes('more complex')) {
      if (level < 5) {
        setLevel(level + 1);
        const next = LEVELS[level];
        reply = `Done! You're now on Level ${next.id}: ${next.label} — "${next.tag}".\n\n${next.desc}\n\nLook at the top nav — new pages are now visible. Take a look around and ask me if anything is confusing.`;
      } else {
        reply = 'You\'re already at Level 5 — full Operator mode. Everything is unlocked. You\'re the quant now.';
      }
    } else if (lower.includes('level down') || lower.includes('simpler') || lower.includes('too complex') || lower.includes('too much') || lower.includes('overwhelm')) {
      if (level > 1) {
        setLevel(level - 1);
        const prev = LEVELS[level - 2];
        reply = `Stepped down to Level ${prev.id}: ${prev.label}. Simpler view active. No shame — the platform is designed to scale with you.`;
      } else {
        reply = 'You\'re already at the simplest level. Just browse the bets and see what catches your eye.';
      }
    } else if (lower.includes('remi') || lower.includes('founder') || lower.includes('creator')) {
      reply = 'Remi is the founder and architect of Quantzy. If I can\'t answer your question, you should ask Remi directly — he\'ll know the deeper reasoning behind any design decision.';
    } else if (lower.includes('page') || lower.includes('where am i') || lower.includes('what am i looking')) {
      const faq = FAQ.find((f) => f.q === 'What page am I on?');
      reply = faq ? faq.a : 'Try clicking around the nav — each tab has a label.';
    } else {
      reply = `Good question! I'm not sure about that one specifically. Here's what I'd suggest:\n\n1. Try tapping around the current view — most things have labels.\n2. If it's about the data or model, check the Historical page.\n3. If it's about the platform vision, ask Remi directly.\n\nYou're on Level ${level} (${levelData.label}). Want me to explain what's visible, or level up?`;
    }

    setMsgs((m) => [...m, userMsg, { who: 'bot', text: reply }]);
    setInput('');
  }

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 lg:bottom-6 left-6 z-30 h-14 rounded-full bg-ink text-white shadow-lift flex items-center gap-2 px-4 hover:scale-[1.02] transition"
          aria-label="Open guide"
        >
          <MascotMark size={28} />
          <span className="text-[12px] font-semibold hidden sm:inline">Ask Quantzy</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 lg:bottom-6 left-6 z-40 w-[380px] max-w-[calc(100vw-48px)] max-h-[75vh] hairline rounded-2xl bg-white shadow-lift flex flex-col animate-[fade_200ms_ease-out]">
          {/* Header */}
          <div className="bg-ink text-white rounded-t-2xl px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MascotMark size={26} />
                <div>
                  <div className="text-[13px] font-semibold">Quantzy Guide</div>
                  <div className="text-[10.5px] text-white/60">To Avery & Team</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white text-[18px] leading-none">×</button>
            </div>
            {/* Level indicator */}
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[10px] text-white/50 uppercase tracking-wider2">Level</span>
              <div className="flex gap-1">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => { setLevel(l.id); respond(`Switch to level ${l.id}`); }}
                    title={`${l.label}: ${l.tag}`}
                    className={`h-4 w-4 rounded-full text-[9px] font-bold ${
                      l.id === level
                        ? 'bg-cerulean text-white ring-2 ring-cerulean/50'
                        : l.id < level
                        ? 'bg-white/30 text-white'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {l.id}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-cerulean font-semibold ml-1">{levelData.label}</span>
              <span className="text-[10px] text-white/40 ml-auto">tap to switch</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ minHeight: 180 }}>
            {msgs.map((m, i) =>
              m.who === 'user' ? (
                <div key={i} className="ml-auto max-w-[80%] hairline rounded-2xl rounded-br-sm bg-cerulean/8 px-3 py-2 text-[12.5px]">{m.text}</div>
              ) : (
                <div key={i} className="max-w-[95%] hairline rounded-2xl rounded-bl-sm bg-platinum/40 px-3 py-2 text-[12.5px] whitespace-pre-line leading-relaxed">{m.text}</div>
              )
            )}
          </div>

          {/* Quick actions */}
          <div className="px-3 pb-1 flex flex-wrap gap-1">
            {['What is edge?', 'What is the scanner?', 'Level up', 'What should I do first?', 'Too complex', 'Explain this page'].map((q) => (
              <button key={q} onClick={() => respond(q)} className="chip cerulean text-[10px] cursor-pointer hover:bg-cerulean/15">{q}</button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 pb-3 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && respond(input)}
              placeholder="Ask anything about the platform…"
              className="flex-1 bg-platinum/40 hairline rounded-md px-3 h-9 text-[12.5px] outline-none"
            />
            <button onClick={() => respond(input)} className="btn btn-cerulean btn-xs">Send</button>
          </div>
        </div>
      )}
    </>
  );
}
