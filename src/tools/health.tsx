import { useState, useEffect, useRef, useMemo } from 'react';
import { CopyButton, ResultBox } from '../tool-ui';
import { Plus, Trash2, Check, X, Play, Pause, RotateCw, Bell, TrendingUp, Target } from 'lucide-react';
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

// ============ Water Intake Tracker ============
export function WaterIntakeTracker(_: { tool: Tool }) {
  const today = new Date().toISOString().slice(0, 10);
  const [goal, setGoal] = usePersistentState('health-water-goal', 2000);
  const [log, setLog] = usePersistentState<Record<string, number>>('health-water-log', {});
  const consumed = log[today] || 0;
  const pct = Math.min(100, (consumed / goal) * 100);

  const add = (ml: number) => setLog({ ...log, [today]: Math.max(0, consumed + ml) });
  const reset = () => setLog({ ...log, [today]: 0 });

  const week = useMemo(() => {
    const days: { date: string; label: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      days.push({ date: ds, label: d.toLocaleDateString('en', { weekday: 'short' }), amount: log[ds] || 0 });
    }
    return days;
  }, [log]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-6 text-center shadow-lg">
        <p className="text-xs uppercase tracking-wider text-white/60">Today's water intake</p>
        <p className="font-display text-4xl font-bold text-white mt-1">{consumed} <span className="text-lg text-white/60">/ {goal} ml</span></p>
        <div className="mt-3 h-3 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-sm text-white/70 mt-2">{pct.toFixed(0)}% of goal</p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {[250, 500, 750, 1000].map((ml) => (
          <button key={ml} onClick={() => add(ml)} className="btn-secondary text-sm">+{ml} ml</button>
        ))}
        <button onClick={reset} className="btn-secondary text-sm"><RotateCw className="h-4 w-4" /> Reset</button>
      </div>
      <div>
        <label className="label">Daily goal (ml)</label>
        <input type="number" min={500} max={10000} step={250} className="input max-w-[200px]" value={goal} onChange={(e) => setGoal(Math.max(500, +e.target.value || 2000))} />
      </div>
      <div>
        <p className="label">Last 7 days</p>
        <div className="flex items-end justify-between gap-2 h-32">
          {week.map((d) => {
            const h = Math.max(4, (d.amount / goal) * 100);
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400">{d.amount}</span>
                <div className="w-full rounded-t-lg bg-sky-200" style={{ height: `${h}%` }} />
                <span className="text-[10px] text-slate-500">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============ Step Counter ============
export function StepCounter(_: { tool: Tool }) {
  const today = new Date().toISOString().slice(0, 10);
  const [goal, setGoal] = usePersistentState('health-steps-goal', 10000);
  const [log, setLog] = usePersistentState<Record<string, number>>('health-steps-log', {});
  const steps = log[today] || 0;
  const [input, setInput] = useState('');

  const addSteps = () => {
    const n = parseInt(input, 10);
    if (!n || n < 0) return;
    setLog({ ...log, [today]: steps + n });
    setInput('');
  };

  const pct = Math.min(100, (steps / goal) * 100);
  const km = (steps * 0.000762).toFixed(2);
  const calories = Math.round(steps * 0.04);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-center shadow-lg">
        <p className="text-xs uppercase tracking-wider text-white/60">Today's steps</p>
        <p className="font-display text-5xl font-bold text-white mt-1 tabular-nums">{steps.toLocaleString()}</p>
        <div className="mt-3 h-3 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-sm text-white/70 mt-2">{pct.toFixed(0)}% of {goal.toLocaleString()} goal</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-wider text-slate-400">Distance</p>
          <p className="font-display text-xl font-bold text-slate-900">{km} km</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-wider text-slate-400">Calories</p>
          <p className="font-display text-xl font-bold text-slate-900">{calories} kcal</p>
        </div>
      </div>
      <div className="flex gap-2">
        <input className="input" type="number" min={0} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add steps…" onKeyDown={(e) => e.key === 'Enter' && addSteps()} />
        <button onClick={addSteps} className="btn-primary"><Plus className="h-4 w-4" /> Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {[500, 1000, 2500, 5000].map((n) => (
          <button key={n} onClick={() => setLog({ ...log, [today]: steps + n })} className="btn-secondary text-sm">+{n.toLocaleString()}</button>
        ))}
        <button onClick={() => setLog({ ...log, [today]: 0 })} className="btn-secondary text-sm"><RotateCw className="h-4 w-4" /> Reset</button>
      </div>
      <div>
        <label className="label">Daily goal</label>
        <input type="number" min={1000} max={50000} step={500} className="input max-w-[200px]" value={goal} onChange={(e) => setGoal(Math.max(1000, +e.target.value || 10000))} />
      </div>
    </div>
  );
}

// ============ Workout Timer ============
export function WorkoutTimer(_: { tool: Tool }) {
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(15);
  const [rounds, setRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<'work' | 'rest' | 'done'>('work');
  const [remaining, setRemaining] = useState(30);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setRemaining((r) => {
          if (r > 1) return r - 1;
          if (phase === 'work') {
            if (currentRound >= rounds) { setPhase('done'); setRunning(false); return 0; }
            setPhase('rest');
            return restTime;
          } else {
            setCurrentRound((c) => c + 1);
            setPhase('work');
            return workTime;
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, currentRound, rounds, workTime, restTime]);

  const start = () => {
    if (phase === 'done') { reset(); return; }
    setRunning(!running);
  };

  const reset = () => {
    setRunning(false); setPhase('work'); setCurrentRound(1); setRemaining(workTime);
  };

  useEffect(() => { if (!running && phase === 'work' && currentRound === 1) setRemaining(workTime); }, [workTime]);

  const isWork = phase === 'work';
  const totalSec = isWork ? workTime : restTime;
  const progress = totalSec > 0 ? ((totalSec - remaining) / totalSec) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label">Work (sec)</label>
          <input type="number" min={5} max={600} className="input text-center" value={workTime} disabled={running} onChange={(e) => setWorkTime(Math.max(5, +e.target.value || 30))} />
        </div>
        <div>
          <label className="label">Rest (sec)</label>
          <input type="number" min={5} max={600} className="input text-center" value={restTime} disabled={running} onChange={(e) => setRestTime(Math.max(5, +e.target.value || 15))} />
        </div>
        <div>
          <label className="label">Rounds</label>
          <input type="number" min={1} max={50} className="input text-center" value={rounds} disabled={running} onChange={(e) => setRounds(Math.max(1, +e.target.value || 8))} />
        </div>
      </div>
      <div className={`rounded-2xl p-8 text-center shadow-lg transition-colors ${phase === 'done' ? 'bg-emerald-500' : isWork ? 'bg-rose-500' : 'bg-sky-500'}`}>
        <p className="text-xs uppercase tracking-wider text-white/60">
          {phase === 'done' ? 'Complete!' : isWork ? `Work · Round ${currentRound}/${rounds}` : `Rest · Round ${currentRound}/${rounds}`}
        </p>
        <p className="font-display text-6xl font-bold text-white mt-2 tabular-nums">{remaining}</p>
        {phase !== 'done' && (
          <div className="mt-3 h-2 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={start} className="btn-primary">
          {phase === 'done' ? <RotateCw className="h-4 w-4" /> : running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {phase === 'done' ? 'Restart' : running ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} className="btn-secondary"><RotateCw className="h-4 w-4" /> Reset</button>
      </div>
    </div>
  );
}

// ============ Stretch Reminder Tool ============
export function StretchReminder(_: { tool: Tool }) {
  const [interval, setIntervalMin] = useState(30);
  const [enabled, setEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [lastReminder, setLastReminder] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(interval * 60);
  }, [interval]);

  useEffect(() => {
    if (enabled) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setLastReminder(new Date().toLocaleTimeString());
            return interval * 60;
          }
          return t - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [enabled, interval]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const stretches = [
    'Neck rolls: slowly rotate your head in a circle, 5 times each direction.',
    'Shoulder shrugs: raise both shoulders to your ears, hold 5 seconds, repeat 10 times.',
    'Chest opener: clasp hands behind your back, squeeze shoulder blades together, hold 20 seconds.',
    'Seated twist: sit tall, twist torso to one side, hold 15 seconds, switch sides.',
    'Wrist circles: extend arms and rotate wrists 10 times in each direction.',
    'Standing forward fold: reach toward your toes, let your head hang, hold 30 seconds.',
    'Hip flexor stretch: step one foot forward into a lunge, press hips forward, hold 20 seconds per side.',
  ];
  const [currentStretch, setCurrentStretch] = useState(0);

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl p-6 text-center shadow-lg ${enabled ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-slate-100'}`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bell className={`h-5 w-5 ${enabled ? 'text-white' : 'text-slate-400'}`} />
          <p className={`text-sm font-medium ${enabled ? 'text-white/80' : 'text-slate-500'}`}>{enabled ? 'Active' : 'Inactive'}</p>
        </div>
        <p className={`font-display text-5xl font-bold tabular-nums ${enabled ? 'text-white' : 'text-slate-400'}`}>{fmt(timeLeft)}</p>
        <p className={`text-xs mt-2 ${enabled ? 'text-white/60' : 'text-slate-400'}`}>until next stretch reminder</p>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-600">Reminder every</label>
        <input type="number" min={5} max={120} className="input max-w-[80px] text-center" value={interval} disabled={enabled} onChange={(e) => { setIntervalMin(Math.max(5, +e.target.value || 30)); setTimeLeft(Math.max(5, +e.target.value || 30) * 60); }} />
        <span className="text-sm text-slate-600">minutes</span>
        <button onClick={() => { setEnabled(!enabled); if (!enabled) setTimeLeft(interval * 60); }} className={enabled ? 'btn-primary ml-auto' : 'btn-secondary ml-auto'}>
          {enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {enabled ? 'Stop' : 'Start'}
        </button>
      </div>
      {lastReminder && enabled && (
        <div className="rounded-xl bg-violet-50 p-4 ring-1 ring-violet-100">
          <p className="text-xs uppercase tracking-wider text-violet-400 mb-1">Last reminder at {lastReminder}</p>
          <p className="text-sm text-violet-700">{stretches[currentStretch]}</p>
          <button onClick={() => setCurrentStretch((s) => (s + 1) % stretches.length)} className="text-xs text-violet-500 mt-2 font-medium hover:underline">Next stretch →</button>
        </div>
      )}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Suggested stretches</p>
        {stretches.map((s, i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 ring-1 ring-slate-100">
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Meal Planner ============
interface MealPlan {
  [date: string]: { breakfast: string; lunch: string; dinner: string; snack: string };
}

export function MealPlanner(_: { tool: Tool }) {
  const [plans, setPlans] = usePersistentState<MealPlan>('health-meal-plans', {});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const day = plans[selectedDate] || { breakfast: '', lunch: '', dinner: '', snack: '' };

  const update = (meal: keyof typeof day, value: string) => {
    setPlans({ ...plans, [selectedDate]: { ...day, [meal]: value } });
  };

  const week = useMemo(() => {
    const days: { date: string; label: string; hasPlan: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const ds = d.toISOString().slice(0, 10);
      days.push({ date: ds, label: d.toLocaleDateString('en', { weekday: 'short', day: 'numeric' }), hasPlan: !!(plans[ds] && (plans[ds].breakfast || plans[ds].lunch || plans[ds].dinner)) });
    }
    return days;
  }, [plans]);

  const meals: { key: keyof typeof day; label: string; icon: string }[] = [
    { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', icon: '☀️' },
    { key: 'dinner', label: 'Dinner', icon: '🌙' },
    { key: 'snack', label: 'Snack', icon: '🍎' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {week.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium transition ${selectedDate === d.date ? 'bg-brand-500 text-white' : d.hasPlan ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-50 text-slate-500 ring-1 ring-slate-100'}`}
          >
            {d.label}
            {d.hasPlan && selectedDate !== d.date && <span className="ml-1 text-emerald-500">●</span>}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {meals.map((m) => (
          <div key={m.key}>
            <label className="label">{m.icon} {m.label}</label>
            <textarea
              className="input min-h-[60px]"
              value={day[m.key]}
              onChange={(e) => update(m.key, e.target.value)}
              placeholder={`What's for ${m.label.toLowerCase()}?`}
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => { setPlans({ ...plans, [selectedDate]: { breakfast: '', lunch: '', dinner: '', snack: '' } }); }}
        className="btn-secondary text-sm"
      ><Trash2 className="h-4 w-4" /> Clear day</button>
    </div>
  );
}

// ============ Calorie Counter ============
interface CalorieEntry { id: string; name: string; calories: number; }

export function CalorieCounter(_: { tool: Tool }) {
  const today = new Date().toISOString().slice(0, 10);
  const [goal, setGoal] = usePersistentState('health-cal-goal', 2000);
  const [log, setLog] = usePersistentState<Record<string, CalorieEntry[]>>('health-cal-log', {});
  const [name, setName] = useState('');
  const [cal, setCal] = useState('');

  const entries = log[today] || [];
  const total = entries.reduce((s, e) => s + e.calories, 0);
  const remaining = goal - total;
  const pct = Math.min(100, (total / goal) * 100);

  const add = () => {
    const n = parseInt(cal, 10);
    if (!name.trim() || !n || n < 0) return;
    setLog({ ...log, [today]: [...entries, { id: Date.now().toString(), name: name.trim(), calories: n }] });
    setName(''); setCal('');
  };

  const remove = (id: string) => setLog({ ...log, [today]: entries.filter((e) => e.id !== id) });

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl p-6 text-center shadow-lg ${remaining < 0 ? 'bg-gradient-to-br from-rose-500 to-red-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>
        <p className="text-xs uppercase tracking-wider text-white/60">Calories today</p>
        <p className="font-display text-5xl font-bold text-white mt-1 tabular-nums">{total}</p>
        <p className="text-sm text-white/70 mt-1">{remaining >= 0 ? `${remaining} kcal remaining` : `${Math.abs(remaining)} kcal over goal`}</p>
        <div className="mt-3 h-3 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="flex gap-2">
        <input className="input flex-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Food name" onKeyDown={(e) => e.key === 'Enter' && add()} />
        <input className="input w-28 text-center" type="number" min={0} value={cal} onChange={(e) => setCal(e.target.value)} placeholder="kcal" onKeyDown={(e) => e.key === 'Enter' && add()} />
        <button onClick={add} className="btn-primary"><Plus className="h-4 w-4" /></button>
      </div>
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No entries yet. Add what you ate above.</p>
        ) : entries.map((e) => (
          <div key={e.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <span className="text-sm font-medium text-slate-700">{e.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{e.calories} kcal</span>
              <button onClick={() => remove(e.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <label className="label">Daily calorie goal</label>
        <input type="number" min={500} max={10000} step={50} className="input max-w-[200px]" value={goal} onChange={(e) => setGoal(Math.max(500, +e.target.value || 2000))} />
      </div>
    </div>
  );
}
