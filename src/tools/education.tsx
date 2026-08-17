import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CopyButton, ResultBox, saveBlob } from '../tool-ui';
import { Plus, Trash2, Check, X, ChevronLeft, ChevronRight, RotateCw, Shuffle, ArrowRight, ArrowLeft, Timer } from 'lucide-react';
import type { Tool } from '../catalog';

// ============ localStorage hook ============
function usePersistentState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as T : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* ignore */ }
  }, [key, state]);
  return [state, setState];
}

// ============ Flashcard Creator ============
interface Flashcard { id: string; front: string; back: string; }

export function FlashcardCreator(_: { tool: Tool }) {
  const [decks, setDecks] = usePersistentState<Record<string, Flashcard[]>>('edu-flashcards', {
    'Default Deck': [
      { id: '1', front: 'What is the capital of France?', back: 'Paris' },
      { id: '2', front: 'What is 7 × 8?', back: '56' },
    ],
  });
  const [activeDeck, setActiveDeck] = useState(Object.keys(decks)[0] || 'Default Deck');
  const [newDeckName, setNewDeckName] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [studyMode, setStudyMode] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = decks[activeDeck] || [];

  const addCard = () => {
    if (!front.trim() || !back.trim()) return;
    const card: Flashcard = { id: Date.now().toString(), front: front.trim(), back: back.trim() };
    setDecks({ ...decks, [activeDeck]: [...cards, card] });
    setFront(''); setBack('');
  };

  const removeCard = (id: string) => setDecks({ ...decks, [activeDeck]: cards.filter((c) => c.id !== id) });

  const addDeck = () => {
    const name = newDeckName.trim();
    if (!name || decks[name]) return;
    setDecks({ ...decks, [name]: [] });
    setActiveDeck(name);
    setNewDeckName('');
  };

  const removeDeck = () => {
    const next = { ...decks };
    delete next[activeDeck];
    setDecks(next);
    setActiveDeck(Object.keys(next)[0] || '');
  };

  if (studyMode && cards.length > 0) {
    const card = cards[cardIdx];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setStudyMode(false)} className="btn-secondary text-sm">Exit study</button>
          <p className="text-sm text-slate-500">Card {cardIdx + 1} of {cards.length}</p>
        </div>
        <div
          onClick={() => setFlipped(!flipped)}
          className="cursor-pointer select-none rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 min-h-[280px] flex items-center justify-center p-8 text-center shadow-lg transition-transform hover:scale-[1.01]"
        >
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60 mb-3">{flipped ? 'Answer' : 'Question'}</p>
            <p className="text-2xl font-display font-bold text-white">{flipped ? card.back : card.front}</p>
            <p className="text-xs text-white/50 mt-4">Click to flip</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setFlipped(false); setCardIdx((i) => (i - 1 + cards.length) % cards.length); }}
            className="btn-secondary"
          ><ChevronLeft className="h-4 w-4" /> Prev</button>
          <button
            onClick={() => { setFlipped(false); setCardIdx((i) => (i + 1) % cards.length); }}
            className="btn-secondary"
          >Next <ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <select className="input max-w-[200px]" value={activeDeck} onChange={(e) => setActiveDeck(e.target.value)}>
          {Object.keys(decks).map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <button onClick={removeDeck} className="btn-secondary text-sm"><Trash2 className="h-4 w-4" /> Delete deck</button>
        <button onClick={() => { setStudyMode(true); setCardIdx(0); setFlipped(false); }} disabled={cards.length === 0} className="btn-primary text-sm">
          Start studying
        </button>
      </div>
      <div className="flex gap-2">
        <input className="input" value={newDeckName} onChange={(e) => setNewDeckName(e.target.value)} placeholder="New deck name…" onKeyDown={(e) => e.key === 'Enter' && addDeck()} />
        <button onClick={addDeck} className="btn-secondary"><Plus className="h-4 w-4" /> Add deck</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="input" value={front} onChange={(e) => setFront(e.target.value)} placeholder="Front (question)" />
        <input className="input" value={back} onChange={(e) => setBack(e.target.value)} placeholder="Back (answer)" />
      </div>
      <button onClick={addCard} className="btn-secondary w-full"><Plus className="h-4 w-4" /> Add card to "{activeDeck}"</button>
      <div className="space-y-2">
        {cards.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No cards yet. Add some above.</p>
        ) : cards.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">{c.front}</p>
              <p className="text-xs text-slate-400 mt-0.5">{c.back}</p>
            </div>
            <button onClick={() => removeCard(c.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Study Planner ============
interface StudyTask { id: string; subject: string; topic: string; date: string; done: boolean; }

export function StudyPlanner(_: { tool: Tool }) {
  const [tasks, setTasks] = usePersistentState<StudyTask[]>('edu-study-planner', [
    { id: '1', subject: 'Math', topic: 'Algebra review', date: new Date().toISOString().slice(0, 10), done: false },
  ]);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');

  const addTask = () => {
    if (!subject.trim() || !topic.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), subject: subject.trim(), topic: topic.trim(), date, done: false }]);
    setSubject(''); setTopic('');
  };

  const toggle = (id: string) => setTasks(tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const removeTask = (id: string) => setTasks(tasks.filter((t) => t.id !== id));

  const filtered = tasks.filter((t) => filter === 'all' ? true : filter === 'done' ? t.done : !t.done);
  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-4 gap-2">
        <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
        <input className="input sm:col-span-2" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <button onClick={addTask} className="btn-secondary w-full"><Plus className="h-4 w-4" /> Add study task</button>
      <div className="flex gap-2">
        {(['all', 'pending', 'done'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'btn-primary text-sm capitalize' : 'btn-secondary text-sm capitalize'}>{f}</button>
        ))}
      </div>
      <div className="space-y-2">
        {sorted.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No tasks. Add one above.</p>
        ) : sorted.map((t) => (
          <div key={t.id} className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${t.done ? 'bg-emerald-50 ring-emerald-100' : 'bg-slate-50 ring-slate-100'}`}>
            <button onClick={() => toggle(t.id)} className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 ${t.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
              {t.done && <Check className="h-3 w-3 text-white" />}
            </button>
            <div className="flex-1">
              <p className={`text-sm font-medium ${t.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>{t.subject}: {t.topic}</p>
              <p className="text-xs text-slate-400">{t.date}</p>
            </div>
            <button onClick={() => removeTask(t.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Reading Timer ============
export function ReadingTimer(_: { tool: Tool }) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [pages, setPages] = useState(0);
  const [pagesRead, setPagesRead] = useState(0);
  const [sessions, setSessions] = usePersistentState<{ date: string; seconds: number; pages: number }[]>('edu-reading-sessions', []);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const fmt = (s: number) => `${Math.floor(s / 3600).toString().padStart(2, '0')}:${Math.floor((s % 3600) / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const saveSession = () => {
    if (elapsed === 0) return;
    setSessions([...sessions, { date: new Date().toISOString().slice(0, 10), seconds: elapsed, pages: pagesRead }]);
    setElapsed(0); setPagesRead(0); setRunning(false);
  };

  const totalSeconds = sessions.reduce((s, sess) => s + sess.seconds, 0);
  const totalPages = sessions.reduce((s, sess) => s + sess.pages, 0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 p-8 text-center shadow-lg">
        <p className="font-display text-5xl font-bold text-white tabular-nums">{fmt(elapsed)}</p>
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={() => setRunning(!running)} className="rounded-lg bg-white/20 px-6 py-2 text-sm font-semibold text-white hover:bg-white/30 transition">
            {running ? 'Pause' : 'Start'}
          </button>
          <button onClick={() => { setElapsed(0); setRunning(false); }} className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition">
            <RotateCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-600">Pages read this session:</label>
        <input type="number" min={0} className="input max-w-[100px] text-center" value={pagesRead} onChange={(e) => setPagesRead(Math.max(0, +e.target.value || 0))} />
        <button onClick={saveSession} className="btn-primary text-sm">Save session</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 text-center">
          <p className="text-xs uppercase tracking-wider text-slate-400">Total time</p>
          <p className="font-display text-2xl font-bold text-slate-900">{fmt(totalSeconds)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 text-center">
          <p className="text-xs uppercase tracking-wider text-slate-400">Total pages</p>
          <p className="font-display text-2xl font-bold text-slate-900">{totalPages}</p>
        </div>
      </div>
      {sessions.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Recent sessions</p>
          {sessions.slice(-5).reverse().map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm ring-1 ring-slate-100">
              <span className="text-slate-600">{s.date}</span>
              <span className="text-slate-500">{fmt(s.seconds)}</span>
              <span className="text-slate-400">{s.pages} pages</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Math Worksheet Generator ============
export function MathWorksheetGenerator(_: { tool: Tool }) {
  const [op, setOp] = useState<'add' | 'sub' | 'mul' | 'div' | 'mixed'>('add');
  const [minNum, setMinNum] = useState(1);
  const [maxNum, setMaxNum] = useState(12);
  const [count, setCount] = useState(20);
  const [seed, setSeed] = useState(0);

  const problems = useMemo(() => {
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const ops: ('add' | 'sub' | 'mul' | 'div')[] = op === 'mixed' ? ['add', 'sub', 'mul', 'div'] : [op];
    const sym: Record<string, string> = { add: '+', sub: '−', mul: '×', div: '÷' };
    return Array.from({ length: count }, () => {
      const o = ops[Math.floor(Math.random() * ops.length)];
      let a = rand(minNum, maxNum);
      let b = rand(minNum, maxNum);
      if (o === 'sub' && b > a) [a, b] = [b, a];
      if (o === 'div') { b = b || 1; a = a * b; }
      const answer = o === 'add' ? a + b : o === 'sub' ? a - b : o === 'mul' ? a * b : a / b;
      return { text: `${a} ${sym[o]} ${b} =`, answer };
    });
  }, [op, minNum, maxNum, count, seed]);

  const downloadPdf = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Math Worksheet</title><style>
      body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 20px; }
      h1 { text-align: center; font-size: 1.5rem; margin-bottom: 2rem; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 2rem; }
      .item { border-bottom: 1px solid #ccc; padding: 0.75rem 0; font-size: 1.25rem; }
      .num { font-weight: bold; margin-right: 0.5rem; }
      .line { display: inline-block; min-width: 60px; border-bottom: 1px solid #333; }
    </style></head><body>
    <h1>Math Worksheet</h1>
    <div class="grid">
    ${problems.map((p, i) => `<div class="item"><span class="num">${i + 1}.</span> ${p.text} <span class="line">&nbsp;</span></div>`).join('')}
    </div>
    </body></html>`;
    saveBlob(new Blob([html], { type: 'text/html' }), 'math-worksheet.html');
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-4 gap-3">
        <div>
          <label className="label">Operation</label>
          <select className="input" value={op} onChange={(e) => setOp(e.target.value as 'add' | 'sub' | 'mul' | 'div' | 'mixed')}>
            <option value="add">Addition</option>
            <option value="sub">Subtraction</option>
            <option value="mul">Multiplication</option>
            <option value="div">Division</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <div>
          <label className="label">Min number</label>
          <input type="number" min={0} className="input" value={minNum} onChange={(e) => setMinNum(Math.max(0, +e.target.value || 0))} />
        </div>
        <div>
          <label className="label">Max number</label>
          <input type="number" min={1} className="input" value={maxNum} onChange={(e) => setMaxNum(Math.max(minNum + 1, +e.target.value || 12))} />
        </div>
        <div>
          <label className="label">Number of problems</label>
          <input type="number" min={1} max={50} className="input" value={count} onChange={(e) => setCount(Math.min(50, Math.max(1, +e.target.value || 20)))} />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setSeed((s) => s + 1)} className="btn-secondary text-sm"><Shuffle className="h-4 w-4" /> New set</button>
        <button onClick={downloadPdf} className="btn-primary text-sm">Download worksheet</button>
      </div>
      <ResultBox>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
          {problems.map((p, i) => (
            <div key={i} className="flex items-baseline gap-1.5 text-sm font-mono text-slate-700 border-b border-slate-200 py-1.5">
              <span className="text-slate-400 font-sans">{i + 1}.</span>
              <span>{p.text}</span>
              <span className="flex-1 border-b border-slate-400">&nbsp;</span>
            </div>
          ))}
        </div>
      </ResultBox>
    </div>
  );
}

// ============ Vocabulary Trainer ============
interface VocabWord { id: string; word: string; meaning: string; known: boolean; }

export function VocabularyTrainer(_: { tool: Tool }) {
  const [words, setWords] = usePersistentState<VocabWord[]>('edu-vocab', [
    { id: '1', word: 'ephemeral', meaning: 'lasting for a very short time', known: false },
    { id: '2', word: 'ubiquitous', meaning: 'present everywhere', known: false },
    { id: '3', word: 'pragmatic', meaning: 'practical rather than idealistic', known: false },
  ]);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [quizOrder, setQuizOrder] = useState<string[]>([]);

  const unknown = words.filter((w) => !w.known);

  const addWord = () => {
    if (!word.trim() || !meaning.trim()) return;
    setWords([...words, { id: Date.now().toString(), word: word.trim(), meaning: meaning.trim(), known: false }]);
    setWord(''); setMeaning('');
  };

  const markKnown = (id: string) => setWords(words.map((w) => w.id === id ? { ...w, known: true } : w));
  const removeWord = (id: string) => setWords(words.filter((w) => w.id !== id));

  const startQuiz = () => {
    const pool = unknown.length > 0 ? unknown : words;
    if (pool.length === 0) return;
    setQuizOrder(pool.map((w) => w.id));
    setQuizIdx(0); setRevealed(false); setScore(0);
    setQuizMode(true);
  };

  const nextCard = () => {
    if (quizIdx + 1 >= quizOrder.length) {
      setQuizMode(false);
      return;
    }
    setQuizIdx(quizIdx + 1); setRevealed(false);
  };

  const markCorrect = () => {
    const w = words.find((w) => w.id === quizOrder[quizIdx]);
    if (w) markKnown(w.id);
    setScore(score + 1);
    nextCard();
  };

  if (quizMode && quizOrder.length > 0) {
    const w = words.find((w) => w.id === quizOrder[quizIdx]);
    if (!w) { setQuizMode(false); return null; }
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setQuizMode(false)} className="btn-secondary text-sm">Exit quiz</button>
          <p className="text-sm text-slate-500">Score: {score} · Card {quizIdx + 1} of {quizOrder.length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-accent-500 to-brand-500 min-h-[220px] flex items-center justify-center p-8 text-center shadow-lg">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60 mb-3">{revealed ? 'Meaning' : 'Word'}</p>
            <p className="text-2xl font-display font-bold text-white">{revealed ? w.meaning : w.word}</p>
          </div>
        </div>
        {!revealed ? (
          <button onClick={() => setRevealed(true)} className="btn-primary w-full">Reveal meaning</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={nextCard} className="btn-secondary flex-1"><X className="h-4 w-4" /> Don't know</button>
            <button onClick={markCorrect} className="btn-primary flex-1"><Check className="h-4 w-4" /> Got it</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{words.length} words · {unknown.length} to learn</p>
        <button onClick={startQuiz} disabled={words.length === 0} className="btn-primary text-sm">Start quiz</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="input" value={word} onChange={(e) => setWord(e.target.value)} placeholder="Word" />
        <input className="input" value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="Meaning" />
      </div>
      <button onClick={addWord} className="btn-secondary w-full"><Plus className="h-4 w-4" /> Add word</button>
      <div className="space-y-2">
        {words.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No words yet. Add some above.</p>
        ) : words.map((w) => (
          <div key={w.id} className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${w.known ? 'bg-emerald-50 ring-emerald-100' : 'bg-slate-50 ring-slate-100'}`}>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">{w.word}</p>
              <p className="text-xs text-slate-500 mt-0.5">{w.meaning}</p>
            </div>
            {!w.known && <button onClick={() => markKnown(w.id)} className="text-emerald-500 hover:text-emerald-600" title="Mark as known"><Check className="h-4 w-4" /></button>}
            <button onClick={() => removeWord(w.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Typing Practice Tool ============
const SAMPLE_TEXTS = [
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!',
  'Programming is the art of telling another human being what one wants the computer to do. The best code is no code at all.',
  'Learning never exhausts the mind. The only way to do great work is to love what you do. Stay hungry, stay foolish.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts. The journey of a thousand miles begins with a single step.',
];

export function TypingPractice(_: { tool: Tool }) {
  const [text] = useState(() => SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]);
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (val: string) => {
    if (finished) return;
    if (startTime === null && val.length > 0) setStartTime(Date.now());
    setTyped(val);
    if (val === text) setFinished(true);
  };

  const elapsedMin = startTime ? (Date.now() - startTime) / 60000 : 0;
  const wordsTyped = typed.trim().split(/\s+/).filter(Boolean).length;
  const wpm = elapsedMin > 0 ? Math.round(wordsTyped / elapsedMin) : 0;
  const errors = useMemo(() => {
    let e = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] !== text[i]) e++;
    return e;
  }, [typed, text]);

  const reset = () => { setTyped(''); setStartTime(null); setFinished(false); inputRef.current?.focus(); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-wider text-slate-400">WPM</p>
          <p className="font-display text-2xl font-bold text-slate-900">{wpm}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-wider text-slate-400">Errors</p>
          <p className="font-display text-2xl font-bold text-slate-900">{errors}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-wider text-slate-400">Progress</p>
          <p className="font-display text-2xl font-bold text-slate-900">{Math.round((typed.length / text.length) * 100)}%</p>
        </div>
      </div>
      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <p className="text-sm leading-relaxed font-mono">
          {text.split('').map((ch, i) => {
            let cls = 'text-slate-300';
            if (i < typed.length) cls = typed[i] === ch ? 'text-emerald-600' : 'text-rose-500 bg-rose-100 rounded';
            else if (i === typed.length) cls = 'text-slate-800 border-b-2 border-brand-500';
            return <span key={i} className={cls}>{ch}</span>;
          })}
        </p>
      </div>
      <textarea
        ref={inputRef}
        className="input min-h-[100px] font-mono text-sm"
        value={typed}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Start typing here…"
        autoFocus
      />
      <div className="flex justify-between items-center">
        <button onClick={reset} className="btn-secondary text-sm"><RotateCw className="h-4 w-4" /> Reset</button>
        {finished && <p className="text-sm font-semibold text-emerald-600">Complete! {wpm} WPM with {errors} errors.</p>}
      </div>
    </div>
  );
}

// ============ Exam Countdown Tool ============
interface Exam { id: string; name: string; date: string; }

export function ExamCountdown(_: { tool: Tool }) {
  const [exams, setExams] = usePersistentState<Exam[]>('edu-exams', [
    { id: '1', name: 'Final Exam', date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10) },
  ]);
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const addExam = () => {
    if (!name.trim()) return;
    setExams([...exams, { id: Date.now().toString(), name: name.trim(), date }]);
    setName('');
  };
  const removeExam = (id: string) => setExams(exams.filter((e) => e.id !== id));

  const sorted = [...exams].sort((a, b) => a.date.localeCompare(b.date));
  const now = new Date(); now.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-2">
        <input className="input sm:col-span-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Exam name" onKeyDown={(e) => e.key === 'Enter' && addExam()} />
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <button onClick={addExam} className="btn-secondary w-full"><Plus className="h-4 w-4" /> Add exam</button>
      <div className="space-y-3">
        {sorted.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No exams yet. Add one above.</p>
        ) : sorted.map((e) => {
          const examDate = new Date(e.date + 'T00:00:00');
          const days = Math.ceil((examDate.getTime() - now.getTime()) / 86400000);
          const isPast = days < 0;
          const isToday = days === 0;
          return (
            <div key={e.id} className={`rounded-2xl p-5 ring-1 ${isToday ? 'bg-rose-50 ring-rose-200' : isPast ? 'bg-slate-50 ring-slate-100' : days <= 7 ? 'bg-amber-50 ring-amber-200' : 'bg-white ring-slate-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-lg font-bold text-slate-900">{e.name}</p>
                  <p className="text-sm text-slate-500">{e.date}</p>
                </div>
                <div className="text-right">
                  {isPast ? (
                    <p className="text-sm font-medium text-slate-400">{Math.abs(days)} days ago</p>
                  ) : isToday ? (
                    <p className="font-display text-2xl font-bold text-rose-600">Today!</p>
                  ) : (
                    <p className="font-display text-3xl font-bold text-slate-900">{days}<span className="text-sm font-medium text-slate-400 ml-1">days left</span></p>
                  )}
                </div>
                <button onClick={() => removeExam(e.id)} className="text-slate-300 hover:text-rose-500 ml-4"><X className="h-4 w-4" /></button>
              </div>
              {!isPast && (
                <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${isToday ? 'bg-rose-500' : days <= 7 ? 'bg-amber-500' : 'bg-brand-500'}`} style={{ width: `${Math.max(5, Math.min(100, 100 - days * 2))}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
