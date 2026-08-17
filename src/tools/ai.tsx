import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { CopyButton, ResultBox } from '../tool-ui';
import type { Tool } from '../catalog';

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function capitalize(s: string) { return s[0].toUpperCase() + s.slice(1); }

function summarize(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  if (sentences.length <= 3) return text.trim();
  const freq: Record<string, number> = {};
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const stop = new Set(['the','a','an','and','or','but','of','to','in','on','for','is','are','was','were','be','been','it','this','that','with','as','at','by','from','i','you','he','she','they','we']);
  words.forEach((w) => { if (!stop.has(w) && w.length > 3) freq[w] = (freq[w] || 0) + 1; });
  const scored = sentences.map((s) => {
    const sw = s.toLowerCase().match(/\b\w+\b/g) || [];
    return { s, score: sw.reduce((a, w) => a + (freq[w] || 0), 0) / Math.sqrt(sw.length || 1) };
  });
  const top = scored.sort((a, b) => b.score - a.score).slice(0, Math.max(3, Math.ceil(sentences.length * 0.3)));
  return top.sort((a, b) => sentences.indexOf(a.s) - sentences.indexOf(b.s)).map((t) => t.s.trim()).join(' ');
}

export function TextSummarizer(_: { tool: Tool }) {
  const [text, setText] = useState('');
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);
  const run = () => {
    setBusy(true);
    setTimeout(() => {
      setOut(summarize(text));
      setBusy(false);
    }, 500);
  };
  return (
    <div className="space-y-4">
      <textarea className="input min-h-[160px]" placeholder="Paste the text you want to summarize…" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={run} disabled={!text.trim() || busy} className="btn-primary">
        {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Summarizing…</> : <><Sparkles className="h-4 w-4" /> Summarize</>}
      </button>
      {out && <ResultBox><p className="text-sm text-slate-700 whitespace-pre-wrap">{out}</p></ResultBox>}
      {out && <div className="flex justify-end"><CopyButton text={out} /></div>}
    </div>
  );
}

function paraphrase(text: string): string {
  const syn: Record<string, string[]> = {
    happy: ['joyful','content','delighted'], sad: ['unhappy','down','sorrowful'], big: ['large','huge','enormous'],
    small: ['tiny','compact','little'], good: ['great','excellent','fine'], bad: ['poor','unfavorable','negative'],
    important: ['crucial','essential','significant'], said: ['stated','mentioned','noted'], make: ['create','produce','build'],
    use: ['utilize','employ','apply'], help: ['assist','aid','support'], show: ['display','reveal','present'],
    think: ['believe','consider','suppose'], want: ['desire','wish for','need'], fast: ['quick','rapid','speedy'],
    easy: ['simple','effortless','straightforward'], hard: ['difficult','challenging','tough'],
  };
  return text.replace(/\b(\w+)\b/gi, (w) => {
    const low = w.toLowerCase();
    if (syn[low]) {
      const pick = syn[low][Math.floor(Math.random() * syn[low].length)];
      return w[0] === w[0].toUpperCase() ? pick[0].toUpperCase() + pick.slice(1) : pick;
    }
    return w;
  });
}

export function Paraphraser(_: { tool: Tool }) {
  const [text, setText] = useState('');
  const [out, setOut] = useState('');
  return (
    <div className="space-y-4">
      <textarea className="input min-h-[140px]" placeholder="Enter a sentence to reword…" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => setOut(paraphrase(text))} disabled={!text.trim()} className="btn-primary"><Sparkles className="h-4 w-4" /> Paraphrase</button>
      {out && <ResultBox><p className="text-sm text-slate-700 whitespace-pre-wrap">{out}</p></ResultBox>}
      {out && <div className="flex justify-end"><CopyButton text={out} /></div>}
    </div>
  );
}

const firstNames = ['Alex','Sam','Jordan','Taylor','Casey','Riley','Morgan','Quinn','Avery','Blake','Drew','Reese','Skyler','Cameron','Parker','Rowan','Sage','Emerson','Finley','Hayden'];
const lastNames = ['Carter','Bennett','Hughes','Foster','Reed','Hayes','Brooks','Cole','Dixon','Ellis','Ford','Grant','Hart','Irwin','Jones','Knox','Lane','Maddox','Nash','Pike'];

export function NameGenerator(_: { tool: Tool }) {
  const [kind, setKind] = useState<'person' | 'brand' | 'fantasy'>('person');
  const [results, setResults] = useState<string[]>([]);
  const gen = () => {
    const out: string[] = [];
    for (let i = 0; i < 10; i++) {
      if (kind === 'person') out.push(`${pick(firstNames)} ${pick(lastNames)}`);
      else if (kind === 'brand') out.push(makeBrand());
      else out.push(makeFantasy());
    }
    setResults(out);
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['person','brand','fantasy'] as const).map((k) => (
          <button key={k} onClick={() => setKind(k)} className={kind === k ? 'btn-primary' : 'btn-secondary'}>{k[0].toUpperCase()+k.slice(1)}</button>
        ))}
      </div>
      <button onClick={gen} className="btn-primary"><Sparkles className="h-4 w-4" /> Generate 10 names</button>
      {results.length > 0 && (
        <ul className="grid sm:grid-cols-2 gap-2">
          {results.map((n, i) => (
            <li key={i} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 ring-1 ring-slate-100">
              <span className="text-sm font-medium text-slate-800">{n}</span>
              <CopyButton text={n} label="" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function makeBrand(): string {
  const pre = ['Nex','Lum','Ver','Zen','Aer','Sol','Or','Nova','Pulse','Echo'];
  const suf = ['ify','ly','io','a','ix','us','ent','ara','ova','igo'];
  return pick(pre) + pick(suf);
}
function makeFantasy(): string {
  const a = ['ae','bra','cal','dra','el','fa','gyr','hal','il','jor'];
  const b = ['dor','wyn','thas','mir','rik','vane','dil','ros','wyn','thar'];
  return capitalize(pick(a) + pick(b));
}

export function ResumeBullets(_: { tool: Tool }) {
  const [role, setRole] = useState('Software Engineer');
  const [company, setCompany] = useState('Tech Corp');
  const [out, setOut] = useState<string[]>([]);
  const verbs = ['Led','Spearheaded','Built','Optimized','Designed','Streamlined','Launched','Drove','Improved','Delivered'];
  const impacts = ['reducing costs by 25%','improving efficiency by 30%','saving 10 hours weekly','increasing user engagement 40%','cutting load times in half','boosting retention by 20%'];
  const gen = () => {
    const bullets = [];
    for (let i = 0; i < 5; i++) {
      bullets.push(`${pick(verbs)} ${role.toLowerCase()} initiatives at ${company}, ${pick(impacts)} through cross-functional collaboration.`);
    }
    setOut(bullets);
  };
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label">Your role</label><input className="input" value={role} onChange={(e) => setRole(e.target.value)} /></div>
        <div><label className="label">Company</label><input className="input" value={company} onChange={(e) => setCompany(e.target.value)} /></div>
      </div>
      <button onClick={gen} className="btn-primary"><Sparkles className="h-4 w-4" /> Generate bullets</button>
      {out.length > 0 && (
        <ul className="space-y-2">
          {out.map((b, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500" />
              <span className="text-sm text-slate-700 flex-1">{b}</span>
              <CopyButton text={b} label="" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const jokes = [
  "Why don't programmers like nature? It has too many bugs.",
  "I told my computer I needed a break, and it said 'No problem — I'll go to sleep.'",
  "Why did the developer go broke? Because he used up all his cache.",
  "There are 10 kinds of people in the world: those who understand binary and those who don't.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "I would tell you a UDP joke, but you might not get it.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "Why was the JavaScript developer sad? Because they didn't Node how to Express themselves.",
  "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
  "Debugging: being the detective in a crime movie where you are also the murderer.",
];

export function JokeGenerator(_: { tool: Tool }) {
  const [joke, setJoke] = useState(jokes[0]);
  return (
    <div className="space-y-4 text-center">
      <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-8 text-white min-h-[140px] flex items-center justify-center">
        <p className="font-display text-xl font-semibold">{joke}</p>
      </div>
      <button onClick={() => setJoke(pick(jokes))} className="btn-primary">Tell me another</button>
    </div>
  );
}

export function StoryGenerator(_: { tool: Tool }) {
  const [topic, setTopic] = useState('a lonely lighthouse');
  const [genre, setGenre] = useState('adventure');
  const [story, setStory] = useState('');
  const gen = () => {
    const settings = ['in the dead of night','on a windswept cliff','beneath a blood-red moon','in a forgotten kingdom','across the endless dunes'];
    const heroes = ['a reluctant hero','a curious child','an old sailor','a mysterious stranger','a clever inventor'];
    const conflicts = ['discovered a hidden door','heard a voice no one else could','found an ancient map','stumbled upon a secret','received an impossible letter'];
    const resolutions = ['and nothing was ever the same again.','but that, dear reader, is a story for another time.','and the world exhaled in relief.','though the cost was greater than anyone knew.','and so a new legend was born.'];
    const s = `Once, ${pick(settings)}, ${topic} drew the attention of ${pick(heroes)}. They ${pick(conflicts)}. The path forward was fraught with peril and wonder, each step revealing ${genre === 'horror' ? 'something darker than the last' : 'a new marvel'}. In the end, ${pick(resolutions)}`;
    setStory(s);
  };
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label">Subject</label><input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} /></div>
        <div>
          <label className="label">Genre</label>
          <select className="input" value={genre} onChange={(e) => setGenre(e.target.value)}>
            {['adventure','mystery','fantasy','horror','romance'].map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
      </div>
      <button onClick={gen} className="btn-primary"><Sparkles className="h-4 w-4" /> Generate story</button>
      {story && <ResultBox><p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{story}</p></ResultBox>}
      {story && <div className="flex justify-end"><CopyButton text={story} /></div>}
    </div>
  );
}

// ============ Love Calculator ============
export function LoveCalculator(_: { tool: Tool }) {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<{ score: number; message: string } | null>(null);

  const calc = () => {
    if (!name1.trim() || !name2.trim()) return;
    const combined = (name1 + name2).toLowerCase().replace(/\s+/g, '');
    let hash = 0;
    for (let i = 0; i < combined.length; i++) hash = ((hash << 5) - hash + combined.charCodeAt(i)) | 0;
    const score = Math.abs(hash) % 101;
    const msg = score >= 90 ? 'A match made in heaven!' : score >= 75 ? 'There is real chemistry here!' : score >= 50 ? 'There is potential — give it a try!' : score >= 25 ? 'It might be complicated…' : 'Better as friends.';
    setResult({ score, message: msg });
  };

  return (
    <div className="space-y-5 max-w-md mx-auto text-center">
      <div className="grid grid-cols-2 gap-3">
        <input className="input text-center" placeholder="Your name" value={name1} onChange={(e) => setName1(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && calc()} />
        <input className="input text-center" placeholder="Their name" value={name2} onChange={(e) => setName2(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && calc()} />
      </div>
      <button onClick={calc} disabled={!name1.trim() || !name2.trim()} className="btn-primary"><Sparkles className="h-4 w-4" /> Calculate love</button>
      {result && (
        <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-8 text-white">
          <p className="font-display text-6xl font-bold">{result.score}%</p>
          <p className="mt-2 text-lg font-medium">{result.message}</p>
        </div>
      )}
    </div>
  );
}

// ============ Horoscope Generator ============
const ZODIAC = [
  { sign: 'Aries', emoji: '♈', range: 'Mar 21 – Apr 19' },
  { sign: 'Taurus', emoji: '♉', range: 'Apr 20 – May 20' },
  { sign: 'Gemini', emoji: '♊', range: 'May 21 – Jun 20' },
  { sign: 'Cancer', emoji: '♋', range: 'Jun 21 – Jul 22' },
  { sign: 'Leo', emoji: '♌', range: 'Jul 23 – Aug 22' },
  { sign: 'Virgo', emoji: '♍', range: 'Aug 23 – Sep 22' },
  { sign: 'Libra', emoji: '♎', range: 'Sep 23 – Oct 22' },
  { sign: 'Scorpio', emoji: '♏', range: 'Oct 23 – Nov 21' },
  { sign: 'Sagittarius', emoji: '♐', range: 'Nov 22 – Dec 21' },
  { sign: 'Capricorn', emoji: '♑', range: 'Dec 22 – Jan 19' },
  { sign: 'Aquarius', emoji: '♒', range: 'Jan 20 – Feb 18' },
  { sign: 'Pisces', emoji: '♓', range: 'Feb 19 – Mar 20' },
];

const HOROSCOPE_MOTIFS = [
  'the stars are aligning in your favor', 'Mercury retrograde may cause delays', 'a surprising opportunity awaits',
  'trust your intuition today', 'an old friend will reach out', 'financial gains are on the horizon',
  'take time for self-care', 'a creative spark will ignite', 'patience will be rewarded',
  'an unexpected conversation changes everything', 'luck favors the bold this week', 'let go of what no longer serves you',
];

export function HoroscopeGenerator(_: { tool: Tool }) {
  const [sign, setSign] = useState('Aries');
  const [reading, setReading] = useState('');

  const gen = () => {
    setReading(`${ZODIAC.find((z) => z.sign === sign)?.emoji} ${sign}: Today, ${pick(HOROSCOPE_MOTIFS)}. ${capitalize(pick(HOROSCOPE_MOTIFS))}. Remember: ${pick(HOROSCOPE_MOTIFS)}.`);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto text-center">
      <div>
        <label className="label">Your sign</label>
        <select className="input" value={sign} onChange={(e) => setSign(e.target.value)}>
          {ZODIAC.map((z) => <option key={z.sign} value={z.sign}>{z.emoji} {z.sign} ({z.range})</option>)}
        </select>
      </div>
      <button onClick={gen} className="btn-primary"><Sparkles className="h-4 w-4" /> Read my horoscope</button>
      {reading && (
        <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 p-6 text-white">
          <p className="text-lg leading-relaxed">{reading}</p>
        </div>
      )}
    </div>
  );
}

// ============ Fortune Cookie Generator ============
const FORTUNES = [
  'A pleasant surprise is in store for you.', 'Your hard work will soon pay off.', 'Good things come to those who wait — but don\'t wait too long.',
  'You will find happiness in unexpected places.', 'A new opportunity will present itself soon.', 'Trust your gut — it knows the way.',
  'Someone is thinking of you right now.', 'Your creativity will solve a lingering problem.', 'A journey of a thousand miles begins with a single step.',
  'Today is the day to take that leap.', 'Kindness returned will come back tenfold.', 'The best is yet to come.',
  'You will soon receive news that changes everything.', 'Fortune favors the brave — be brave today.', 'A smile is your passport to the world.',
  'Listen carefully — the answer is closer than you think.', 'Your patience will be tested, but the reward is great.', 'An old dream will find new life.',
  'You are stronger than you think.', 'Something you lost will return in a new form.',
];

export function FortuneCookie(_: { tool: Tool }) {
  const [fortune, setFortune] = useState('');
  const [opened, setOpened] = useState(false);

  const crack = () => {
    setFortune(pick(FORTUNES));
    setOpened(true);
  };

  return (
    <div className="space-y-5 max-w-sm mx-auto text-center">
      <div className={`text-7xl transition-all duration-500 ${opened ? 'scale-100' : 'scale-90 opacity-70'}`}>🥠</div>
      {opened ? (
        <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white">
          <p className="font-display text-lg font-semibold leading-relaxed">"{fortune}"</p>
        </div>
      ) : (
        <p className="text-sm text-slate-500">Crack the cookie to reveal your fortune…</p>
      )}
      <button onClick={crack} className="btn-primary"><Sparkles className="h-4 w-4" /> {opened ? 'Another one' : 'Crack cookie'}</button>
    </div>
  );
}

// ============ Would You Rather Generator ============
const WYR = [
  { a: 'have the ability to fly', b: 'be invisible at will' },
  { a: 'always be 10 minutes late', b: 'always be 20 minutes early' },
  { a: 'have unlimited sushi for life', b: 'have unlimited tacos for life' },
  { a: 'never use social media again', b: 'never watch TV again' },
  { a: 'be the funniest person in the room', b: 'be the smartest person in the room' },
  { a: 'live without music', b: 'live without movies' },
  { a: 'have a rewind button for life', b: 'have a pause button for life' },
  { a: 'be able to talk to animals', b: 'speak every human language' },
  { a: 'always have to say everything on your mind', b: 'never be able to speak again' },
  { a: 'have a personal chef', b: 'have a personal driver' },
  { a: 'never feel cold', b: 'never feel hot' },
  { a: 'explore deep space', b: 'explore the deep ocean' },
  { a: 'be famous on the internet', b: 'be rich but unknown' },
  { a: 'have a third arm', b: 'have a third eye' },
  { a: 'only be able to whisper', b: 'only be able to shout' },
];

export function WouldYouRather(_: { tool: Tool }) {
  const [pair, setPair] = useState<{ a: string; b: string } | null>(null);
  const [choice, setChoice] = useState<'a' | 'b' | null>(null);

  const gen = () => { setPair(pick(WYR)); setChoice(null); };

  return (
    <div className="space-y-5 max-w-lg mx-auto text-center">
      {pair ? (
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setChoice('a')} className={`rounded-2xl p-6 text-white font-display text-lg font-semibold transition-all ${choice === 'a' ? 'bg-gradient-to-br from-brand-600 to-accent-600 scale-105 ring-2 ring-brand-400' : 'bg-gradient-to-br from-brand-500 to-brand-700 hover:scale-105'}`}>
            {pair.a}
          </button>
          <button onClick={() => setChoice('b')} className={`rounded-2xl p-6 text-white font-display text-lg font-semibold transition-all ${choice === 'b' ? 'bg-gradient-to-br from-rose-500 to-pink-600 scale-105 ring-2 ring-rose-400' : 'bg-gradient-to-br from-rose-500 to-rose-700 hover:scale-105'}`}>
            {pair.b}
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-500 py-8">Generate a dilemma to ponder…</p>
      )}
      {choice && <p className="text-sm font-medium text-slate-600">You chose: {choice === 'a' ? pair!.a : pair!.b}</p>}
      <button onClick={gen} className="btn-primary"><Sparkles className="h-4 w-4" /> New question</button>
    </div>
  );
}

// ============ Truth or Dare Generator ============
const TRUTHS = [
  'What is your biggest fear?', 'Who was your first crush?', 'What is the most embarrassing thing you have done?',
  'What is a secret you have never told anyone?', 'What is your worst habit?', 'When did you last lie and what was it?',
  'What is the strangest thing you have ever eaten?', 'Who do you admire the most and why?', 'What is your biggest regret?',
  'If you could change one thing about yourself, what would it be?', 'What is the most childish thing you still do?',
  'Have you ever pretended to be sick to get out of something?',
];

const DARES = [
  'Sing the chorus of your favorite song out loud.', 'Do 10 jumping jacks right now.', 'Speak in an accent for the next 3 rounds.',
  'Let someone in the group text a contact of their choice on your phone.', 'Do your best impression of someone in the room.',
  'Eat a spoonful of something with your eyes closed.', 'Balance a spoon on your nose for 10 seconds.', 'Do an interpretive dance for 30 seconds.',
  'Talk in rhymes for the next 3 rounds.', 'Let the group choose your next profile picture.', 'Wear your shirt inside out for the next 5 minutes.',
  'Call a friend and sing happy birthday to them regardless of the date.',
];

export function TruthOrDare(_: { tool: Tool }) {
  const [mode, setMode] = useState<'truth' | 'dare'>('truth');
  const [prompt, setPrompt] = useState('');

  const gen = () => {
    setPrompt(mode === 'truth' ? pick(TRUTHS) : pick(DARES));
  };

  return (
    <div className="space-y-5 max-w-md mx-auto text-center">
      <div className="flex justify-center gap-2">
        <button onClick={() => { setMode('truth'); setPrompt(''); }} className={mode === 'truth' ? 'btn-primary' : 'btn-secondary'}>Truth</button>
        <button onClick={() => { setMode('dare'); setPrompt(''); }} className={mode === 'dare' ? 'btn-primary' : 'btn-secondary'}>Dare</button>
      </div>
      {prompt ? (
        <div className={`rounded-2xl p-8 text-white ${mode === 'truth' ? 'bg-gradient-to-br from-sky-500 to-blue-700' : 'bg-gradient-to-br from-rose-500 to-red-700'}`}>
          <p className="font-display text-xl font-semibold leading-relaxed">{prompt}</p>
        </div>
      ) : (
        <p className="text-sm text-slate-500 py-8">Pick truth or dare, then generate!</p>
      )}
      <button onClick={gen} className="btn-primary"><Sparkles className="h-4 w-4" /> Generate {mode === 'truth' ? 'truth' : 'dare'}</button>
    </div>
  );
}

// ============ Business Name Generator ============
const BIZ_PREFIXES = ['Bright','Swift','Prime','Bold','Pure','Peak','Nova','Lumen','Vertex','Apex','Zenith','Forge','Catalyst','Iron','Golden','Silver','Coral','Onyx','Cedar','Maple'];
const BIZ_SUFFIXES = ['Lab','Works','Hub','Co','Group','Studio','Systems','Solutions','Collective','Partners','Dynamics','Ventures','Industries','Technologies','Craft','House','Foundry','Agency','Network','Alliance'];
const BIZ_DOMAINS = ['Tech','Digital','Cloud','Data','Smart','Green','Urban','Global','Future','Next','Pro','Edge','Core','Spark','Flow','Link','Bridge','Pulse','Shift','Rise'];

export function BusinessNameGenerator(_: { tool: Tool }) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const gen = () => {
    const out: string[] = [];
    const kw = keyword.trim() || pick(BIZ_DOMAINS);
    for (let i = 0; i < 10; i++) {
      const style = Math.floor(Math.random() * 3);
      if (style === 0) out.push(`${pick(BIZ_PREFIXES)}${capitalize(kw)}`);
      else if (style === 1) out.push(`${kw} ${pick(BIZ_SUFFIXES)}`);
      else out.push(`${pick(BIZ_PREFIXES)} ${kw} ${pick(BIZ_SUFFIXES)}`);
    }
    setResults([...new Set(out)].slice(0, 10));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Keyword or industry (optional)</label>
        <input className="input" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. Tech, Coffee, Fitness" onKeyDown={(e) => e.key === 'Enter' && gen()} />
      </div>
      <button onClick={gen} className="btn-primary"><Sparkles className="h-4 w-4" /> Generate 10 names</button>
      {results.length > 0 && (
        <ul className="grid sm:grid-cols-2 gap-2">
          {results.map((n, i) => (
            <li key={i} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 ring-1 ring-slate-100">
              <span className="text-sm font-medium text-slate-800">{n}</span>
              <CopyButton text={n} label="" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============ Tagline Generator ============
const TAGLINE_ADJ = ['bold','smart','simple','fast','reliable','innovative','effortless','powerful','fresh','seamless','limitless','essential'];
const TAGLINE_NOUN = ['solutions','results','experiences','performance','growth','value','ideas','impact','possibilities','connections','moments','journeys'];
const TAGLINE_VERB = ['Build','Create','Discover','Unlock','Elevate','Transform','Reimagine','Power','Fuel','Spark','Drive','Deliver'];

export function TaglineGenerator(_: { tool: Tool }) {
  const [brand, setBrand] = useState('');
  const [taglines, setTaglines] = useState<string[]>([]);

  const gen = () => {
    const b = brand.trim() || 'Your Brand';
    const out: string[] = [];
    for (let i = 0; i < 8; i++) {
      const style = Math.floor(Math.random() * 4);
      if (style === 0) out.push(`${b}: ${pick(TAGLINE_VERB)} ${pick(TAGLINE_ADJ)} ${pick(TAGLINE_NOUN)}.`);
      else if (style === 1) out.push(`${b}. Where ${pick(TAGLINE_NOUN)} begin.`);
      else if (style === 2) out.push(`${pick(TAGLINE_VERB)} ${pick(TAGLINE_NOUN)} with ${b}.`);
      else out.push(`${b} — ${capitalize(pick(TAGLINE_ADJ))} by design.`);
    }
    setTaglines([...new Set(out)].slice(0, 8));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Brand or product name</label>
        <input className="input" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Acme, Luma, Vertex" onKeyDown={(e) => e.key === 'Enter' && gen()} />
      </div>
      <button onClick={gen} className="btn-primary"><Sparkles className="h-4 w-4" /> Generate taglines</button>
      {taglines.length > 0 && (
        <ul className="space-y-2">
          {taglines.map((t, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500" />
              <span className="text-sm font-medium text-slate-800 flex-1">{t}</span>
              <CopyButton text={t} label="" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
