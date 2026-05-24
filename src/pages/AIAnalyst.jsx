import { useState } from 'react';
import { Eyebrow, EdgeBar, Sparkline } from '../components/UI.jsx';
import { MascotMark } from '../components/Mascot.jsx';
import { SIGNALS } from '../data/markets.js';

const PROMPTS = [
  'Find the best politics market under 30 days with clean rules',
  'Why is Quantzy confident here?',
  'What am I missing in this market?',
  'Show high-edge bets in my niches that are not crowded',
  'Which markets did I miss this week?',
  'Compare my performance to top traders',
  'Where do I overestimate confidence?',
];

export function AIAnalyst() {
  const [chat, setChat] = useState([
    { who: 'q', text: 'Good afternoon, Rémi. Your watchlist shows 4 markets above 8% edge. Two have sufficient liquidity. Want a ranked review?' },
  ]);
  const [input, setInput] = useState('');

  function send(text) {
    if (!text) return;
    const user = { who: 'u', text };
    const reply = { who: 'q', text: 'Best opportunity right now: OKC G5 winner. Edge +9%, confidence 81%, liquidity $1.8M. Top traders 18 in / 1 fade. Catalyst tip-off in 6h.', card: SIGNALS[1] };
    setChat([...chat, user, reply]);
    setInput('');
  }

  return (
    <div className="px-4 lg:px-6 py-5 max-w-[1400px] mx-auto space-y-5">
      <div>
        <Eyebrow>AI Analyst</Eyebrow>
        <h1 className="font-display text-[32px] tracking-tight">Quantzy, in your words.</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-5">
        <div className="hairline rounded-2xl bg-white flex flex-col" style={{ minHeight: '60vh' }}>
          <div className="p-3 border-b border-mist flex items-center gap-2">
            <MascotMark size={26} />
            <div>
              <div className="text-[13px] font-semibold">Quantzy Analyst</div>
              <div className="text-[10.5px] text-slate2">model q-04.7-c · live data</div>
            </div>
            <span className="ml-auto chip cerulean">Online</span>
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-auto">
            {chat.map((m, i) => m.who === 'u' ? (
              <div key={i} className="ml-auto max-w-[70%] hairline rounded-2xl rounded-br-sm bg-cerulean/8 px-3 py-2 text-[13px]">{m.text}</div>
            ) : (
              <div key={i} className="max-w-[80%]">
                <div className="hairline rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-[13px] shadow-card">{m.text}</div>
                {m.card && (
                  <div className="hairline rounded-xl bg-white p-3 mt-2 max-w-[440px]">
                    <div className="flex items-center justify-between"><span className="chip">{m.card.venue}</span><span className="chip cerulean">+{m.card.edgePct}% edge</span></div>
                    <div className="text-[13px] font-semibold mt-1">{m.card.market}</div>
                    <div className="mt-2"><EdgeBar market={m.card.marketPct} fair={m.card.fairPct} /></div>
                    <div className="mt-2"><Sparkline values={m.card.spark} width={400} height={28} color="#2563EB" /></div>
                    <div className="mt-2 flex gap-1.5"><button className="btn btn-cerulean btn-xs">Open</button><button className="btn btn-ghost btn-xs">Take</button><button className="btn btn-ghost btn-xs">Set alert</button></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-mist flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder="Ask Quantzy…"
              className="flex-1 bg-platinum/40 hairline rounded-md px-3 h-10 text-[13px] outline-none"
            />
            <button onClick={() => send(input)} className="btn btn-cerulean btn-sm">Send</button>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="hairline rounded-2xl bg-white p-4">
            <Eyebrow>Try asking</Eyebrow>
            <ul className="mt-2 space-y-1">
              {PROMPTS.map((p) => (
                <li key={p}>
                  <button onClick={() => send(p)} className="w-full text-left hairline rounded-md px-2.5 py-1.5 text-[12px] hover:bg-platinum/40">{p}</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="hairline rounded-2xl bg-platinum/40 p-4">
            <Eyebrow>Personalization</Eyebrow>
            <ul className="text-[12px] mt-2 space-y-1 text-slate2">
              <li>Niches: NBA, Politics, AI, Crypto</li>
              <li>Risk: Balanced</li>
              <li>Conf floor: 65%</li>
              <li>Bankroll: $5,000 (paper)</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
