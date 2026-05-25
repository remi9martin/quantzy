import { useState, useEffect, useRef } from 'react';
import { useLevel, LEVELS } from './LevelContext.jsx';
import { MascotMark } from './Mascot.jsx';

const STOP = new Set(['what','this','that','does','have','with','from','about','there','which','when','where','they','them','their','your','will','would','could','should','been','being','were','more','some','into','over','also','than','then','just','very','like','know','think','want','need','tell','show','make','take','give','look','find','here','come','each','well','back','only','much','most','many','such','even','both','same','another','other']);

const FAQ = [
  { q: 'What is this platform?', k: ['platform','quantzy','about','app','purpose','tool','product'], a: 'Quantzy scans prediction markets (Polymarket, Kalshi, sports books, crypto) and tells you which bets have the best chance of being mispriced. It shows you what the model thinks the real probability is vs what the market says — that gap is called "edge".' },
  { q: 'What is edge?', k: ['edge','mispriced','gap','difference','alpha'], a: 'Edge is the difference between what the market says and what Quantzy\'s model thinks the truth is. If the market says 51% and the model says 58%, the edge is +7%. The bigger the edge, the better the opportunity might be.' },
  { q: 'What is confidence?', k: ['confidence','confident','sure','certain','accuracy'], a: 'Confidence is how sure the model is about its own estimate. A high-confidence signal (80%+) means the model has strong data backing the call. Lower confidence means it\'s less certain — could still be right, but treat it with more caution.' },
  { q: 'What is liquidity?', k: ['liquidity','liquid','volume','money available','thin market'], a: 'Liquidity is how much money is available in the market. High liquidity = you can get in and out easily. Low liquidity = your bet might move the price, or be hard to exit. Generally, higher liquidity is safer.' },
  { q: 'What is calibration?', k: ['calibration','calibrate','calibrated','honest','accurate','brier'], a: 'Calibration measures whether the model is honest about its confidence. If it says "80% likely" on 100 different events, about 80 should actually happen. Quantzy publishes its calibration so you can audit it.' },
  { q: 'What are the complexity levels?', k: ['complexity','levels','tiers','stages','unlock','progressive'], a: `There are 5 levels — you control the pace:\n\n  1. Starter — Simple trending bets, take or skip.\n  2. Explorer — See edge %, confidence, filters.\n  3. Analyst — Mind-map scanner, social trading, alerts.\n  4. Quant — Probability decomposition, copy-trade.\n  5. Operator — Full terminal, everything unlocked.\n\nUse the dot-slider at the top of the screen to switch. Or just tell me "level up" or "too complex" right here.` },
  { q: 'How do I level up?', k: ['how level','change level','switch level','dots','slider'], a: 'Two ways:\n\n1. The dot-slider at the top of the page (5 dots, drag right to increase complexity)\n2. Just type "level up" here and I\'ll bump it for you\n\nNo test, no gate — go at your own speed. I\'d recommend spending a few minutes at each level before stepping up.' },
  { q: 'Is this real money?', k: ['real money','bet','bets','betting','place bet','wager','gamble','trade','actual money','deposit','withdraw','place bets'], a: 'Right now Quantzy is an intelligence layer — it shows you opportunities and lets you paper-track (simulate) your decisions. It does not place bets for you. If you want to trade, you go to the actual venue (Polymarket, Kalshi, etc.) and execute there.' },
  { q: 'What should I do first?', k: ['first','start','begin','getting started','new here','beginner','how to use','do first'], a: 'At Level 1, just browse the feed and see which bets look interesting. Tap "Take" on ones you\'d bet on, "Skip" on ones you wouldn\'t. Over time, Quantzy tracks whether you would have been right. That\'s your first calibration lesson.' },
  { q: 'Who is Remi?', k: ['remi','founder','creator','built','who made','who created'], a: 'Remi built Quantzy. If I can\'t answer a question, I\'ll tell you to ask Remi directly. I\'m the AI guide — I know the platform, but Remi knows the vision.' },
  { q: 'What page am I on?', k: ['page','pages','tour','navigate','navigation','sections','where am i'], a: 'I can see your complexity level but not which page you\'re looking at. Here\'s a quick tour:\n\n- Dashboard: your home base, top opportunities at a glance\n- Edge Feed: all ranked bets, sortable by edge, confidence, etc.\n- Explore: browse by topic (politics, NBA, crypto, etc.)\n- Scanner (Level 3+): the mind-map that explodes a topic into branches\n- Social (Level 3+): follow top traders, copy their picks\n- Historical (Level 2+): proof that the model\'s confidence is calibrated\n\nAsk about any page and I\'ll explain what it shows.' },
  { q: 'What is the scanner?', k: ['scanner','mind map','mindmap','mind-map','scan','branches','explode'], a: 'The Scanner is the centerpiece of Quantzy. You pick a topic (like "US Politics" or "NBA Playoffs") and it explodes into a visual mind-map of every related market. Each branch shows the edge, confidence, and liquidity. You click a leaf to inspect the full thesis.\n\nIt unlocks at Level 3 (Analyst). Want me to level you up?' },
  { q: 'What is social trading?', k: ['social','social trading','follow','copy','copy-trade','copytrade','leaderboard','traders'], a: 'Social trading means you can follow other users who are good at picking which Quantzy signals to act on. You can see their hit rate, calibration score, and ROI. At Level 4 you can even mirror their picks automatically with the copy-trade configurator.\n\nUnlocks at Level 3.' },
  { q: 'What is the dashboard?', k: ['dashboard','home','main page','overview'], a: 'The Dashboard is your home base. It shows top opportunities ranked by edge, your active positions, recent hits/misses, and a quick snapshot of your performance. Think of it as the morning briefing.' },
  { q: 'What is the feed?', k: ['feed','edge feed','all signals','all bets','ranked'], a: 'The Edge Feed shows every signal Quantzy has found, ranked by edge strength. You can sort by edge %, confidence, liquidity, or recency. Filter by category (politics, sports, crypto, etc.) to narrow down.' },
  { q: 'How does the model work?', k: ['model','algorithm','how does it work','prediction','predict','methodology','method'], a: 'Quantzy\'s model combines multiple data sources — polls, news sentiment, historical base rates, market microstructure — to estimate the "true" probability of an event. It then compares that estimate to the current market price to find the edge. The Methodology page has the full breakdown.' },
];

const WELCOME = `To Avery & Team:

Welcome to Quantzy. This is a prediction-market intelligence platform — it can get very powerful, but we're starting you at the simplest level so nothing is overwhelming.

There are 5 complexity tiers. Right now you're on Level 1 (Starter) — just trending bets and whether they look good or not.

To level up, use the dot-slider at the top of the screen:
  [ 1 ]---[ 2 ]---[ 3 ]---[ 4 ]---[ 5 ]
  Starter → Explorer → Analyst → Quant → Operator

Each level adds more features and data. You control the pace — no gates, no tests.

Ask me anything below to understand each page and the thought process behind it. If I don't know, I'll tell you to ask Remi.

Pro tip: paste an OpenRouter API key here to upgrade me to GPT-4o mini for smarter answers.`;

const SYSTEM_PROMPT = `You are Quantzy Guide, the AI assistant built into the Quantzy prediction-market intelligence platform. You speak to "Avery & Team" — investors evaluating the platform.

Key facts:
- Quantzy scans prediction markets (Polymarket, Kalshi, sports, crypto, macro) for mispriced bets
- "Edge" = model probability minus market price. Positive edge = potential opportunity
- "Confidence" = how sure the model is. "Liquidity" = how much money in the market
- "Calibration" = does the model's 80% actually happen 80% of the time?
- There are 5 complexity levels: Starter → Explorer → Analyst → Quant → Operator
- The platform does NOT place bets — it's an intelligence layer. Users trade on the actual venues
- The Scanner (Level 3+) explodes topics into visual mind-maps of related markets
- Social trading (Level 3+) lets users follow top traders and copy picks
- Remi is the founder. If you don't know, say "ask Remi"

Be concise, direct, and helpful. Max 3-4 sentences unless explaining a concept. No corporate fluff.`;

function bestFaqMatch(input) {
  const lower = input.toLowerCase();
  const words = lower.split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  let best = null;
  let bestScore = 0;
  for (const faq of FAQ) {
    let score = 0;
    for (const keyword of faq.k) {
      if (keyword.includes(' ')) {
        if (lower.includes(keyword)) score += 3;
      } else {
        if (words.includes(keyword)) score += 2;
        else if (lower.includes(keyword)) score += 1;
      }
    }
    if (score > bestScore) { bestScore = score; best = faq; }
  }
  return bestScore >= 2 ? best : null;
}

export function GuideBot() {
  const [open, setOpen] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);
  const [msgs, setMsgs] = useState([
    { who: 'bot', text: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('quantzy_openrouter_key') || '');
  const { level, setLevel, levelData } = useLevel();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  useEffect(() => {
    if (autoOpened) return;
    const seen = window.localStorage.getItem('quantzy_guide_seen');
    if (!seen) {
      setOpen(true);
      setAutoOpened(true);
      window.localStorage.setItem('quantzy_guide_seen', '1');
    }
  }, [autoOpened]);

  async function callLLM(userText) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...msgs.filter((m) => m.who !== 'bot' || msgs.indexOf(m) > 0).slice(-8).map((m) => ({
              role: m.who === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
            { role: 'user', content: userText },
          ],
          max_tokens: 300,
        }),
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content || null;
    } catch { return null; }
  }

  async function respond(text) {
    if (!text.trim()) return;
    const userMsg = { who: 'user', text: text.trim() };
    const lower = text.toLowerCase();
    setInput('');

    if (lower.startsWith('sk-or-') || lower.startsWith('sk-')) {
      const key = text.trim();
      setApiKey(key);
      localStorage.setItem('quantzy_openrouter_key', key);
      setMsgs((m) => [...m, userMsg, { who: 'bot', text: 'API key saved. I\'m now powered by GPT-4o mini. Ask me anything.' }]);
      return;
    }

    let reply;

    if (lower.includes('level up') || lower.includes('next level') || lower.includes('upgrade') || lower.includes('more complex')) {
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
    }

    if (reply) {
      setMsgs((m) => [...m, userMsg, { who: 'bot', text: reply }]);
      return;
    }

    if (apiKey) {
      setMsgs((m) => [...m, userMsg, { who: 'bot', text: '...' }]);
      setLoading(true);
      const llmReply = await callLLM(text.trim());
      setLoading(false);
      if (llmReply) {
        setMsgs((m) => [...m.slice(0, -1), { who: 'bot', text: llmReply }]);
        return;
      }
    }

    const match = bestFaqMatch(lower);
    if (match) {
      reply = match.a;
    } else {
      reply = `Good question! I'm not sure about that one specifically. Here's what I'd suggest:\n\n1. Try tapping around the current view — most things have labels.\n2. If it's about the data or model, check the Historical page.\n3. If it's about the platform vision, ask Remi directly.\n\nYou're on Level ${level} (${levelData.label}). Want me to explain what's visible, or level up?`;
    }

    setMsgs((m) => [...m, userMsg, { who: 'bot', text: reply }]);
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
        <div className="fixed bottom-20 lg:bottom-6 left-6 z-40 w-[380px] max-w-[calc(100vw-48px)] max-h-[75vh] hairline rounded-2xl bg-carbon shadow-lift flex flex-col animate-[fade_200ms_ease-out]">
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
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2" style={{ minHeight: 180 }}>
            {msgs.map((m, i) =>
              m.who === 'user' ? (
                <div key={i} className="ml-auto max-w-[80%] hairline rounded-2xl rounded-br-sm bg-cerulean/15 px-3 py-2 text-[12.5px] text-white">{m.text}</div>
              ) : (
                <div key={i} className="max-w-[95%] hairline rounded-2xl rounded-bl-sm bg-white/5 px-3 py-2 text-[12.5px] text-platinum whitespace-pre-line leading-relaxed">{m.text}</div>
              )
            )}
          </div>

          {/* AI badge */}
          {apiKey && (
            <div className="px-3 pt-1">
              <span className="chip cerulean text-[9px]">GPT-4o mini active</span>
            </div>
          )}

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
              className="flex-1 bg-white/5 hairline rounded-md px-3 h-9 text-[12.5px] text-white outline-none placeholder:text-slate1"
            />
            <button onClick={() => respond(input)} className="btn btn-cerulean btn-xs">Send</button>
          </div>
        </div>
      )}
    </>
  );
}
