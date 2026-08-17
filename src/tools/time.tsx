import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Check, X } from 'lucide-react';
import { Stat } from '../tool-ui';
import type { Tool } from '../catalog';

const CITIES = [
  { name: 'New York', tz: 'America/New_York' },
  { name: 'London', tz: 'Europe/London' },
  { name: 'Paris', tz: 'Europe/Paris' },
  { name: 'Dubai', tz: 'Asia/Dubai' },
  { name: 'Mumbai', tz: 'Asia/Kolkata' },
  { name: 'Singapore', tz: 'Asia/Singapore' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'Sydney', tz: 'Australia/Sydney' },
  { name: 'Los Angeles', tz: 'America/Los_Angeles' },
  { name: 'São Paulo', tz: 'America/Sao_Paulo' },
];

export function WorldClock(_: { tool: Tool }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {CITIES.map((c) => {
        const time = now.toLocaleTimeString('en-US', { timeZone: c.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const date = now.toLocaleDateString('en-US', { timeZone: c.tz, weekday: 'short', month: 'short', day: 'numeric' });
        const hour = parseInt(now.toLocaleTimeString('en-US', { timeZone: c.tz, hour: '2-digit', hour12: false }), 10);
        const isDay = hour >= 6 && hour < 18;
        return (
          <div key={c.name} className={`rounded-2xl p-5 ring-1 ${isDay ? 'bg-gradient-to-br from-amber-50 to-orange-50 ring-amber-100' : 'bg-gradient-to-br from-slate-800 to-slate-900 ring-slate-700 text-white'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-display text-lg font-semibold ${isDay ? 'text-slate-800' : 'text-white'}`}>{c.name}</h3>
              <span className="text-xl">{isDay ? '☀' : '☾'}</span>
            </div>
            <p className={`mt-2 font-display text-3xl font-bold tabular-nums ${isDay ? 'text-slate-900' : 'text-white'}`}>{time}</p>
            <p className={`text-xs ${isDay ? 'text-slate-500' : 'text-slate-400'}`}>{date}</p>
          </div>
        );
      })}
    </div>
  );
}

export function Stopwatch(_: { tool: Tool }) {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const ref = useRef<number | null>(null);
  const start = useRef(0);

  useEffect(() => {
    if (!running) return;
    start.current = performance.now() - ms;
    ref.current = window.setInterval(() => setMs(performance.now() - start.current), 10);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const fmt = (t: number) => {
    const m = Math.floor(t / 60000);
    const s = Math.floor((t % 60000) / 1000);
    const cs = Math.floor((t % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 text-center">
      <p className="font-display text-6xl font-bold tabular-nums text-slate-900">{fmt(ms)}</p>
      <div className="flex justify-center gap-2">
        <button onClick={() => setRunning((r) => !r)} className="btn-primary">{running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Start</>}</button>
        <button onClick={() => setLaps((l) => [...l, ms])} disabled={!running} className="btn-secondary">Lap</button>
        <button onClick={() => { setRunning(false); setMs(0); setLaps([]); }} className="btn-secondary"><RotateCcw className="h-4 w-4" /> Reset</button>
      </div>
      {laps.length > 0 && (
        <ul className="mx-auto max-w-md space-y-1 text-left">
          {laps.map((l, i) => (
            <li key={i} className="flex justify-between rounded-lg bg-slate-50 px-4 py-2 font-mono text-sm text-slate-700">
              <span>Lap {i + 1}</span><span>{fmt(l)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Countdown(_: { tool: Tool }) {
  const [target, setTarget] = useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16));
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const t = new Date(target).getTime();
  const diff = Math.max(0, t - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const done = diff === 0;
  return (
    <div className="space-y-6 text-center">
      <div>
        <label className="label text-left">Countdown to</label>
        <input type="datetime-local" className="input" value={target} onChange={(e) => setTarget(e.target.value)} />
      </div>
      {done ? (
        <p className="font-display text-4xl font-bold text-accent-600 animate-pop">Time's up!</p>
      ) : (
        <div className="flex justify-center gap-3">
          {[['Days', days], ['Hours', hours], ['Min', mins], ['Sec', secs]].map(([l, v]) => (
            <div key={l as string} className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 px-4 py-6 text-white min-w-[80px]">
              <p className="font-display text-4xl font-bold tabular-nums">{(v as number).toString().padStart(2, '0')}</p>
              <p className="mt-1 text-xs uppercase tracking-wider opacity-80">{l}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CookingTimer(_: { tool: Tool }) {
  const [target, setTarget] = useState(5 * 60);
  const [remaining, setRemaining] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          setDone(true);
          try { new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=').play(); } catch {}
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const presets = [
    ['Soft egg', 6 * 60], ['Hard egg', 10 * 60], ['Pasta', 8 * 60],
    ['Rice', 18 * 60], ['Tea', 3 * 60], ['Toast', 2 * 60],
  ];

  const setPreset = (s: number) => { setTarget(s); setRemaining(s); setRunning(false); setDone(false); };
  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = (remaining % 60).toString().padStart(2, '0');
  const pct = ((target - remaining) / target) * 100;

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-wrap justify-center gap-2">
        {presets.map(([l, s]) => (
          <button key={l as string} onClick={() => setPreset(s as number)} className="btn-secondary text-sm">{l}</button>
        ))}
      </div>
      <div className="relative mx-auto h-56 w-56">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#f97316" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45 * (1 - pct / 100)}
            className="transition-all duration-500" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-5xl font-bold ${done ? 'text-orange-500 animate-pulse' : 'text-slate-900'}`}>{mm}:{ss}</span>
          <span className="mt-1 text-xs uppercase tracking-wider text-slate-400">{done ? 'Done!' : 'Cooking'}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <input type="number" className="input max-w-[80px] text-center" value={Math.floor(target / 60)} onChange={(e) => { const v = (+e.target.value || 0) * 60; setTarget(v); setRemaining(v); setDone(false); setRunning(false); }} />
        <span className="text-slate-500">min</span>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={() => { setDone(false); setRunning((r) => !r); }} className="btn-primary">{running ? 'Pause' : 'Start'}</button>
        <button onClick={() => { setRunning(false); setRemaining(target); setDone(false); }} className="btn-secondary">Reset</button>
      </div>
    </div>
  );
}

// ============ Calendar Widget ============
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarWidget(_: { tool: Tool }) {
  const today = new Date();
  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today.toISOString().slice(0, 10));

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; current: boolean; date: string }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, current: false, date: new Date(year, month - 1, daysInPrev - i).toISOString().slice(0, 10) });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true, date: new Date(year, month, d).toISOString().slice(0, 10) });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, current: false, date: new Date(year, month + 1, d).toISOString().slice(0, 10) });

  const todayStr = today.toISOString().slice(0, 10);
  const prevMonth = () => setView(new Date(year, month - 1, 1));
  const nextMonth = () => setView(new Date(year, month + 1, 1));
  const goToday = () => { setView(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(todayStr); };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="btn-secondary px-3">‹</button>
        <div className="text-center">
          <p className="font-display text-xl font-bold text-slate-900">{MONTHS[month]} {year}</p>
          <button onClick={goToday} className="text-xs text-brand-600 hover:underline">Today</button>
        </div>
        <button onClick={nextMonth} className="btn-secondary px-3">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DOW.map((d) => <div key={d} className="text-center text-xs font-medium text-slate-400 py-2">{d}</div>)}
        {cells.map((c, i) => {
          const isToday = c.date === todayStr;
          const isSelected = c.date === selected;
          return (
            <button
              key={i}
              onClick={() => setSelected(c.date)}
              className={`aspect-square rounded-lg text-sm font-medium transition ${
                !c.current ? 'text-slate-300' : isToday ? 'bg-brand-600 text-white' : isSelected ? 'bg-brand-100 text-brand-800 ring-1 ring-brand-300' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {c.day}
            </button>
          );
        })}
      </div>
      <div className="rounded-xl bg-slate-50 p-4 text-center ring-1 ring-slate-100">
        <p className="text-xs uppercase tracking-wider text-slate-400">Selected date</p>
        <p className="mt-1 font-display text-lg font-bold text-slate-900">
          {new Date(selected + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}

// ============ To-Do List ============
interface Todo { id: number; text: string; done: boolean; }

export function TodoList(_: { tool: Tool }) {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try { return JSON.parse(localStorage.getItem('todo-list') || '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const nextId = useRef(todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1);

  useEffect(() => { localStorage.setItem('todo-list', JSON.stringify(todos)); }, [todos]);

  const add = () => {
    if (!input.trim()) return;
    setTodos((t) => [...t, { id: nextId.current++, text: input.trim(), done: false }]);
    setInput('');
  };

  const toggle = (id: number) => setTodos((t) => t.map((td) => td.id === id ? { ...td, done: !td.done } : td));
  const remove = (id: number) => setTodos((t) => t.filter((td) => td.id !== id));
  const clearDone = () => setTodos((t) => t.filter((td) => !td.done));

  const filtered = todos.filter((t) => filter === 'all' ? true : filter === 'active' ? !t.done : t.done);
  const activeCount = todos.filter((t) => !t.done).length;

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex gap-2">
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a task…" onKeyDown={(e) => e.key === 'Enter' && add()} />
        <button onClick={add} className="btn-primary shrink-0"><Plus className="h-4 w-4" /> Add</button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(['all', 'active', 'done'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'btn-primary text-xs' : 'btn-secondary text-xs'}>{f[0].toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
        {todos.some((t) => t.done) && <button onClick={clearDone} className="text-xs text-slate-400 hover:text-rose-500">Clear done</button>}
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-8">No tasks here. Add one above!</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((t) => (
            <li key={t.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
              <button onClick={() => toggle(t.id)} className={`flex h-5 w-5 items-center justify-center rounded-md ring-1 transition ${t.done ? 'bg-accent-500 ring-accent-500 text-white' : 'ring-slate-300 hover:ring-brand-400'}`}>
                {t.done && <Check className="h-3 w-3" />}
              </button>
              <span className={`flex-1 text-sm ${t.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{t.text}</span>
              <button onClick={() => remove(t.id)} className="text-slate-300 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-center text-xs text-slate-400">{activeCount} task{activeCount !== 1 ? 's' : ''} remaining</p>
    </div>
  );
}

// ============ Notes App ============
interface Note { id: number; title: string; body: string; updated: string; }

export function NotesApp(_: { tool: Tool }) {
  const [notes, setNotes] = useState<Note[]>(() => {
    try { return JSON.parse(localStorage.getItem('notes-app') || '[]'); } catch { return []; }
  });
  const [activeId, setActiveId] = useState<number | null>(notes.length > 0 ? notes[0].id : null);
  const nextId = useRef(notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1);

  useEffect(() => { localStorage.setItem('notes-app', JSON.stringify(notes)); }, [notes]);

  const active = notes.find((n) => n.id === activeId);

  const create = () => {
    const note: Note = { id: nextId.current++, title: 'Untitled note', body: '', updated: new Date().toLocaleString() };
    setNotes((n) => [note, ...n]);
    setActiveId(note.id);
  };

  const update = (id: number, patch: Partial<Note>) => {
    setNotes((n) => n.map((nd) => nd.id === id ? { ...nd, ...patch, updated: new Date().toLocaleString() } : nd));
  };

  const remove = (id: number) => {
    setNotes((n) => n.filter((nd) => nd.id !== id));
    if (activeId === id) setActiveId(notes.length > 1 ? notes.find((nd) => nd.id !== id)?.id ?? null : null);
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 h-[420px]">
      <div className="md:col-span-1 space-y-2 overflow-auto">
        <button onClick={create} className="btn-primary w-full"><Plus className="h-4 w-4" /> New note</button>
        {notes.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-8">No notes yet.</p>
        ) : (
          notes.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveId(n.id)}
              className={`w-full text-left rounded-xl p-3 ring-1 transition ${activeId === n.id ? 'bg-brand-50 ring-brand-200' : 'bg-slate-50 ring-slate-100 hover:bg-slate-100'}`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm text-slate-800 truncate">{n.title || 'Untitled'}</p>
                <span onClick={(e) => { e.stopPropagation(); remove(n.id); }} className="text-slate-300 hover:text-rose-500"><X className="h-3.5 w-3.5" /></span>
              </div>
              <p className="text-xs text-slate-400 truncate">{n.body.slice(0, 50) || 'No content'}</p>
              <p className="text-[10px] text-slate-300 mt-1">{n.updated}</p>
            </button>
          ))
        )}
      </div>
      <div className="md:col-span-2">
        {active ? (
          <div className="flex h-full flex-col gap-3">
            <input className="input font-semibold" value={active.title} onChange={(e) => update(active.id, { title: e.target.value })} placeholder="Title" />
            <textarea className="input flex-1 min-h-0 font-mono text-sm" value={active.body} onChange={(e) => update(active.id, { body: e.target.value })} placeholder="Write your note…" />
            <p className="text-xs text-slate-400">Last edited: {active.updated}</p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-100">
            <p className="text-sm text-slate-400">Select or create a note to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ Habit Tracker ============
interface Habit { id: number; name: string; color: string; history: Record<string, boolean>; }

const HABIT_COLORS = ['#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#eab308'];

export function HabitTracker(_: { tool: Tool }) {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try { return JSON.parse(localStorage.getItem('habit-tracker') || '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const nextId = useRef(habits.length > 0 ? Math.max(...habits.map((h) => h.id)) + 1 : 1);

  useEffect(() => { localStorage.setItem('habit-tracker', JSON.stringify(habits)); }, [habits]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const add = () => {
    if (!input.trim()) return;
    setHabits((h) => [...h, { id: nextId.current++, name: input.trim(), color: HABIT_COLORS[h.length % HABIT_COLORS.length], history: {} }]);
    setInput('');
  };

  const toggle = (id: number, date: string) => {
    setHabits((h) => h.map((hb) => hb.id === id ? { ...hb, history: { ...hb.history, [date]: !hb.history[date] } } : hb));
  };

  const remove = (id: number) => setHabits((h) => h.filter((hb) => hb.id !== id));

  const streak = (habit: Habit): number => {
    let count = 0;
    let d = new Date();
    while (habit.history[d.toISOString().slice(0, 10)]) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="New habit (e.g. Drink water, Exercise)…" onKeyDown={(e) => e.key === 'Enter' && add()} />
        <button onClick={add} className="btn-primary shrink-0"><Plus className="h-4 w-4" /> Add</button>
      </div>
      {habits.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-8">No habits yet. Add one to start tracking!</p>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_repeat(7,2.5rem)_3rem_2rem] gap-1 items-center text-xs text-slate-400 px-2">
            <span>Habit</span>
            {last7.map((d) => <span key={d} className="text-center">{new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })[0]}</span>)}
            <span className="text-center">Streak</span>
            <span></span>
          </div>
          {habits.map((h) => (
            <div key={h.id} className="grid grid-cols-[1fr_repeat(7,2.5rem)_3rem_2rem] gap-1 items-center rounded-xl bg-slate-50 p-2 ring-1 ring-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: h.color }} />
                <span className="text-sm font-medium text-slate-800 truncate">{h.name}</span>
              </div>
              {last7.map((d) => (
                <button
                  key={d}
                  onClick={() => toggle(h.id, d)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition ${h.history[d] ? 'text-white' : 'bg-white ring-1 ring-slate-200 hover:ring-slate-300'}`}
                  style={h.history[d] ? { backgroundColor: h.color } : {}}
                >
                  {h.history[d] && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
              <span className="text-center text-sm font-bold text-slate-700">{streak(h)}</span>
              <button onClick={() => remove(h.id)} className="text-slate-300 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
