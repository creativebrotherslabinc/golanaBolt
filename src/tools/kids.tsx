import { useState, useEffect, useRef, useMemo } from 'react';
import { CopyButton, ResultBox, saveBlob } from '../tool-ui';
import { Plus, Trash2, X, Check, Download, Eraser, Star } from 'lucide-react';
import type { Tool } from '../catalog';

function usePersistentState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as T : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* ignore */ }
  }, [key, state]);
  return [state, setState];
}

// ============ Chore Chart Generator ============
interface Chore { id: string; name: string; assignee: string; days: string[]; done: Record<string, boolean>; }

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function ChoreChartGenerator(_: { tool: Tool }) {
  const [chores, setChores] = usePersistentState<Chore[]>('kids-chores', [
    { id: '1', name: 'Make bed', assignee: 'Alex', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], done: {} },
    { id: '2', name: 'Take out trash', assignee: 'Sam', days: ['Wed', 'Sun'], done: {} },
  ]);
  const [name, setName] = useState('');
  const [assignee, setAssignee] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  const addChore = () => {
    if (!name.trim() || selectedDays.length === 0) return;
    setChores([...chores, { id: Date.now().toString(), name: name.trim(), assignee: assignee.trim() || 'Anyone', days: selectedDays, done: {} }]);
    setName(''); setAssignee(''); setSelectedDays([]);
  };
  const removeChore = (id: string) => setChores(chores.filter((c) => c.id !== id));
  const toggleDay = (choreId: string, day: string) => setChores(chores.map((c) => c.id === choreId ? { ...c, done: { ...c.done, [day]: !c.done[day] } } : c));

  const toggleDaySelect = (d: string) => setSelectedDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-2">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Chore name" />
        <input className="input" value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Assign to (optional)" />
      </div>
      <div className="flex flex-wrap gap-2">
        {DAYS.map((d) => (
          <button key={d} onClick={() => toggleDaySelect(d)} className={selectedDays.includes(d) ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>{d}</button>
        ))}
      </div>
      <button onClick={addChore} className="btn-secondary w-full"><Plus className="h-4 w-4" /> Add chore</button>
      <div className="space-y-2">
        {chores.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No chores yet. Add some above.</p>
        ) : chores.map((c) => (
          <div key={c.id} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                <p className="text-xs text-slate-400">Assigned to: {c.assignee}</p>
              </div>
              <button onClick={() => removeChore(c.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map((d) => {
                const isActive = c.days.includes(d);
                const isDone = c.done[d];
                if (!isActive) return <div key={d} className="h-8 w-8 rounded bg-slate-100" />;
                return (
                  <button
                    key={d}
                    onClick={() => toggleDay(c.id, d)}
                    className={`h-8 w-8 rounded text-xs font-bold flex items-center justify-center transition ${isDone ? 'bg-emerald-500 text-white' : 'bg-brand-100 text-brand-700 hover:bg-brand-200'}`}
                  >
                    {isDone ? <Check className="h-3 w-3" /> : d[0]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 text-center">Today is {today}. Tap a day square to mark a chore as done.</p>
    </div>
  );
}

// ============ Reward Points Tracker ============
interface Kid { id: string; name: string; points: number; }
interface Reward { id: string; name: string; cost: number; }

export function RewardPointsTracker(_: { tool: Tool }) {
  const [kids, setKids] = usePersistentState<Kid[]>('kids-rewards-kids', [
    { id: '1', name: 'Alex', points: 45 },
    { id: '2', name: 'Sam', points: 30 },
  ]);
  const [rewards, setRewards] = usePersistentState<Reward[]>('kids-rewards-rewards', [
    { id: '1', name: 'Extra screen time (30 min)', cost: 20 },
    { id: '2', name: 'Ice cream treat', cost: 50 },
    { id: '3', name: 'Small toy', cost: 100 },
  ]);
  const [kidName, setKidName] = useState('');
  const [rewardName, setRewardName] = useState('');
  const [rewardCost, setRewardCost] = useState('');

  const addKid = () => {
    if (!kidName.trim()) return;
    setKids([...kids, { id: Date.now().toString(), name: kidName.trim(), points: 0 }]);
    setKidName('');
  };
  const removeKid = (id: string) => setKids(kids.filter((k) => k.id !== id));
  const addPoints = (id: string, pts: number) => setKids(kids.map((k) => k.id === id ? { ...k, points: Math.max(0, k.points + pts) } : k));
  const redeem = (kidId: string, rewardId: string) => {
    const kid = kids.find((k) => k.id === kidId);
    const reward = rewards.find((r) => r.id === rewardId);
    if (!kid || !reward || kid.points < reward.cost) return;
    setKids(kids.map((k) => k.id === kidId ? { ...k, points: k.points - reward.cost } : k));
  };

  const addReward = () => {
    const cost = parseInt(rewardCost, 10);
    if (!rewardName.trim() || isNaN(cost) || cost <= 0) return;
    setRewards([...rewards, { id: Date.now().toString(), name: rewardName.trim(), cost }]);
    setRewardName(''); setRewardCost('');
  };
  const removeReward = (id: string) => setRewards(rewards.filter((r) => r.id !== id));

  return (
    <div className="space-y-4">
      <div>
        <p className="label">Kids</p>
        <div className="flex gap-2 mb-2">
          <input className="input flex-1" value={kidName} onChange={(e) => setKidName(e.target.value)} placeholder="Kid's name" onKeyDown={(e) => e.key === 'Enter' && addKid()} />
          <button onClick={addKid} className="btn-secondary"><Plus className="h-4 w-4" /></button>
        </div>
        <div className="space-y-2">
          {kids.map((k) => (
            <div key={k.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{k.name}</p>
                <p className="text-xs text-slate-500">{k.points} points</p>
              </div>
              <button onClick={() => addPoints(k.id, 5)} className="h-7 w-7 rounded bg-emerald-100 text-emerald-600 hover:bg-emerald-200 flex items-center justify-center text-sm font-bold">+5</button>
              <button onClick={() => addPoints(k.id, 10)} className="h-7 w-7 rounded bg-emerald-100 text-emerald-600 hover:bg-emerald-200 flex items-center justify-center text-sm font-bold">+10</button>
              <button onClick={() => addPoints(k.id, -5)} className="h-7 w-7 rounded bg-rose-100 text-rose-600 hover:bg-rose-200 flex items-center justify-center text-sm font-bold">−5</button>
              <button onClick={() => removeKid(k.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="label">Rewards</p>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <input className="input col-span-2" value={rewardName} onChange={(e) => setRewardName(e.target.value)} placeholder="Reward name" />
          <div className="flex gap-2">
            <input className="input flex-1" type="number" min={1} value={rewardCost} onChange={(e) => setRewardCost(e.target.value)} placeholder="Cost" />
            <button onClick={addReward} className="btn-secondary"><Plus className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="space-y-1.5">
          {rewards.map((r) => (
            <div key={r.id} className="flex items-center gap-2 rounded-lg bg-white p-2.5 ring-1 ring-slate-100">
              <div className="flex-1">
                <span className="text-sm text-slate-700">{r.name}</span>
                <span className="text-xs text-slate-400 ml-2">· {r.cost} pts</span>
              </div>
              {kids.length > 0 && (
                <select
                  className="input max-w-[120px] text-xs py-1"
                  defaultValue=""
                  onChange={(e) => { if (e.target.value) { redeem(e.target.value, r.id); e.target.value = ''; } }}
                >
                  <option value="" disabled>Redeem…</option>
                  {kids.map((k) => <option key={k.id} value={k.id} disabled={k.points < r.cost}>{k.name} ({k.points}pts)</option>)}
                </select>
              )}
              <button onClick={() => removeReward(r.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ Bedtime Routine Checklist ============
const DEFAULT_ROUTINE = [
  'Brush teeth', 'Put on pajamas', 'Read a book', 'Dim lights', 'Set alarm', 'Lights out',
];

export function BedtimeRoutineChecklist(_: { tool: Tool }) {
  const [routine, setRoutine] = usePersistentState<{ id: string; task: string }[]>('kids-bedtime', DEFAULT_ROUTINE.map((t, i) => ({ id: String(i), task: t })));
  const [newTask, setNewTask] = useState('');
  const [done, setDone] = useState<boolean[]>([]);

  useEffect(() => {
    setDone(new Array(routine.length).fill(false));
  }, [routine.length]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setRoutine([...routine, { id: Date.now().toString(), task: newTask.trim() }]);
    setNewTask('');
  };
  const removeTask = (id: string) => setRoutine(routine.filter((t) => t.id !== id));
  const toggle = (i: number) => setDone(done.map((d, idx) => idx === i ? !d : d));
  const reset = () => setDone(new Array(routine.length).fill(false));

  const completed = done.filter(Boolean).length;
  const allDone = completed === routine.length && routine.length > 0;

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl p-6 text-center shadow-lg transition-colors ${allDone ? 'bg-gradient-to-br from-indigo-500 to-violet-600' : 'bg-slate-100'}`}>
        <p className={`text-sm font-medium ${allDone ? 'text-white/80' : 'text-slate-500'}`}>{allDone ? 'Sweet dreams!' : 'Bedtime routine'}</p>
        <p className={`font-display text-4xl font-bold mt-1 ${allDone ? 'text-white' : 'text-slate-800'}`}>{completed} / {routine.length}</p>
        <p className={`text-xs mt-1 ${allDone ? 'text-white/60' : 'text-slate-400'}`}>tasks complete</p>
      </div>
      <div className="flex gap-2">
        <input className="input flex-1" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add a routine step…" onKeyDown={(e) => e.key === 'Enter' && addTask()} />
        <button onClick={addTask} className="btn-secondary"><Plus className="h-4 w-4" /></button>
      </div>
      <div className="space-y-2">
        {routine.map((t, i) => (
          <div key={t.id} className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${done[i] ? 'bg-indigo-50 ring-indigo-100' : 'bg-slate-50 ring-slate-100'}`}>
            <button onClick={() => toggle(i)} className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${done[i] ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
              {done[i] && <Check className="h-4 w-4 text-white" />}
            </button>
            <span className={`flex-1 text-sm ${done[i] ? 'line-through text-slate-400' : 'text-slate-700'}`}>{t.task}</span>
            <button onClick={() => removeTask(t.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <button onClick={reset} className="btn-secondary text-sm w-full">Reset checklist</button>
    </div>
  );
}

// ============ Homework Planner ============
interface Homework { id: string; subject: string; assignment: string; dueDate: string; done: boolean; }

export function HomeworkPlanner(_: { tool: Tool }) {
  const [items, setItems] = usePersistentState<Homework[]>('kids-homework', [
    { id: '1', subject: 'Math', assignment: 'Worksheet p. 45', dueDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), done: false },
  ]);
  const [subject, setSubject] = useState('');
  const [assignment, setAssignment] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');

  const add = () => {
    if (!subject.trim() || !assignment.trim()) return;
    setItems([...items, { id: Date.now().toString(), subject: subject.trim(), assignment: assignment.trim(), dueDate, done: false }]);
    setSubject(''); setAssignment('');
  };
  const toggle = (id: string) => setItems(items.map((h) => h.id === id ? { ...h, done: !h.done } : h));
  const remove = (id: string) => setItems(items.filter((h) => h.id !== id));

  const filtered = items.filter((h) => filter === 'all' ? true : filter === 'done' ? h.done : !h.done);
  const sorted = [...filtered].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-2">
        <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
        <input className="input" value={assignment} onChange={(e) => setAssignment(e.target.value)} placeholder="Assignment" />
        <div className="flex gap-2">
          <input type="date" className="input flex-1" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <button onClick={add} className="btn-primary"><Plus className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="flex gap-2">
        {(['all', 'pending', 'done'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'btn-primary text-sm capitalize' : 'btn-secondary text-sm capitalize'}>{f}</button>
        ))}
      </div>
      <div className="space-y-2">
        {sorted.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No homework. Add some above.</p>
        ) : sorted.map((h) => {
          const isOverdue = !h.done && h.dueDate < today;
          return (
            <div key={h.id} className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${h.done ? 'bg-emerald-50 ring-emerald-100' : isOverdue ? 'bg-rose-50 ring-rose-100' : 'bg-slate-50 ring-slate-100'}`}>
              <button onClick={() => toggle(h.id)} className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 ${h.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                {h.done && <Check className="h-3 w-3 text-white" />}
              </button>
              <div className="flex-1">
                <p className={`text-sm font-medium ${h.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>{h.subject}: {h.assignment}</p>
                <p className={`text-xs ${isOverdue ? 'text-rose-500 font-medium' : 'text-slate-400'}`}>Due {h.dueDate}{isOverdue ? ' · Overdue' : ''}</p>
              </div>
              <button onClick={() => remove(h.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ Kids Drawing Pad ============
export function KidsDrawingPad(_: { tool: Tool }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#6366f1');
  const [brushSize, setBrushSize] = useState(8);
  const [drawing, setDrawing] = useState(false);

  const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#000000'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stop = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => { if (blob) saveBlob(blob, 'my-drawing.png'); });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full border-2 transition ${color === c ? 'border-slate-800 scale-110' : 'border-white shadow'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Size</label>
          <input type="range" min={2} max={30} value={brushSize} onChange={(e) => setBrushSize(+e.target.value)} className="w-24 accent-brand-600" />
          <span className="text-xs text-slate-400 w-6">{brushSize}</span>
        </div>
        <button onClick={clear} className="btn-secondary text-sm"><Eraser className="h-4 w-4" /> Clear</button>
        <button onClick={download} className="btn-primary text-sm"><Download className="h-4 w-4" /> Save</button>
      </div>
      <div className="rounded-2xl overflow-hidden ring-2 ring-slate-200 shadow-sm">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full touch-none cursor-crosshair bg-white"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={stop}
          onMouseLeave={stop}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={stop}
        />
      </div>
    </div>
  );
}

// ============ Name Coloring Sheet Generator ============
export function NameColoringSheetGenerator(_: { tool: Tool }) {
  const [name, setName] = useState('LILY');
  const [fontSize, setFontSize] = useState(120);
  const [fontFamily, setFontFamily] = useState("'Comic Sans MS', 'Chalkboard SE', cursive");
  const [outlineWidth, setOutlineWidth] = useState(3);

  const download = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
      <rect width="800" height="400" fill="white"/>
      <text x="400" y="220" text-anchor="middle" font-family="${fontFamily}" font-size="${fontSize}" fill="white" stroke="black" stroke-width="${outlineWidth}" font-weight="bold">${name.toUpperCase()}</text>
    </svg>`;
    saveBlob(new Blob([svg], { type: 'image/svg+xml' }), `${name.toLowerCase()}-coloring-sheet.svg`);
  };

  const fonts: { name: string; value: string }[] = [
    { name: 'Comic Sans', value: "'Comic Sans MS', 'Chalkboard SE', cursive" },
    { name: 'Sans Serif', value: "Arial, Helvetica, sans-serif" },
    { name: 'Serif', value: "'Times New Roman', Georgia, serif" },
    { name: 'Rounded', value: "'Trebuchet MS', 'Quicksand', sans-serif" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter a name…" maxLength={15} />
        </div>
        <div>
          <label className="label">Font style</label>
          <select className="input" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            {fonts.map((f) => <option key={f.name} value={f.value}>{f.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Font size: {fontSize}px</label>
          <input type="range" min={40} max={200} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-brand-600" />
        </div>
        <div>
          <label className="label">Outline thickness: {outlineWidth}</label>
          <input type="range" min={1} max={8} value={outlineWidth} onChange={(e) => setOutlineWidth(+e.target.value)} className="w-full accent-brand-600" />
        </div>
      </div>
      <div className="rounded-2xl bg-white p-8 ring-2 ring-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-center min-h-[200px]">
          <span
            style={{ fontFamily, fontSize: `${fontSize}px`, color: 'white', WebkitTextStroke: `${outlineWidth}px black`, fontWeight: 'bold', lineHeight: 1 }}
            className="select-none"
          >
            {name.toUpperCase() || 'YOUR NAME'}
          </span>
        </div>
      </div>
      <button onClick={download} className="btn-primary w-full"><Download className="h-4 w-4" /> Download coloring sheet</button>
      <p className="text-xs text-slate-400 text-center">Download the sheet, print it, and let kids color in the letters with crayons or markers.</p>
    </div>
  );
}
