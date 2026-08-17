import { useState } from 'react';
import { CopyButton, ResultBox, Field, Stat, saveBlob } from '../tool-ui';
import { Download, Plus, X } from 'lucide-react';
import type { Tool } from '../catalog';

// ============ Shift Schedule Generator ============
export function ShiftSchedule(_: { tool: Tool }) {
  const [employees, setEmployees] = useState('Alice\nBob\nCarol\nDave\nEve');
  const [shifts, setShifts] = useState('Morning (6-14)\nAfternoon (14-22)\nNight (22-6)');
  const [days, setDays] = useState(7);
  const [schedule, setSchedule] = useState<string[][]>([]);

  const generate = () => {
    const emps = employees.split('\n').filter(Boolean);
    const shfts = shifts.split('\n').filter(Boolean);
    const grid: string[][] = [];
    for (let d = 0; d < days; d++) {
      const day: string[] = [];
      for (let s = 0; s < shfts.length; s++) {
        const emp = emps[(d * shfts.length + s) % emps.length];
        day.push(emp);
      }
      grid.push(day);
    }
    setSchedule(grid);
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Employees (one per line)"><textarea className="input min-h-[100px]" value={employees} onChange={(e) => setEmployees(e.target.value)} /></Field>
        <Field label="Shifts (one per line)"><textarea className="input min-h-[100px]" value={shifts} onChange={(e) => setShifts(e.target.value)} /></Field>
      </div>
      <Field label="Number of days"><input type="number" className="input max-w-[120px]" value={days} onChange={(e) => setDays(+e.target.value || 1)} /></Field>
      <button onClick={generate} className="btn-primary">Generate schedule</button>
      {schedule.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-100"><th className="p-2 text-left">Day</th>{shifts.split('\n').filter(Boolean).map((s, i) => <th key={i} className="p-2 text-left">{s}</th>)}</tr></thead>
            <tbody>
              {schedule.map((day, d) => (
                <tr key={d} className="border-b border-slate-100"><td className="p-2 font-medium">{dayNames[d % 7]} {Math.floor(d / 7) + 1}</td>{day.map((emp, s) => <td key={s} className="p-2 text-slate-700">{emp}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============ Timesheet Generator ============
export function Timesheet(_: { tool: Tool }) {
  const [name, setName] = useState('John Doe');
  const [rate, setRate] = useState(20);
  const [entries, setEntries] = useState<{ day: string; in: string; out: string }[]>([
    { day: 'Monday', in: '09:00', out: '17:00' }, { day: 'Tuesday', in: '09:00', out: '17:00' },
    { day: 'Wednesday', in: '09:00', out: '17:00' }, { day: 'Thursday', in: '09:00', out: '17:00' },
    { day: 'Friday', in: '09:00', out: '17:00' },
  ]);

  const calcHours = (e: { in: string; out: string }) => {
    const [ih, im] = e.in.split(':').map(Number);
    const [oh, om] = e.out.split(':').map(Number);
    return ((oh * 60 + om) - (ih * 60 + im)) / 60;
  };
  const total = entries.reduce((s, e) => s + calcHours(e), 0);
  const pay = total * rate;

  const update = (i: number, key: string, val: string) => setEntries((p) => p.map((e, j) => j === i ? { ...e, [key]: val } : e));
  const exportCsv = () => {
    const rows = [['Employee', name], ['Rate', `$${rate}/hr`], [], ['Day', 'Clock In', 'Clock Out', 'Hours'], ...entries.map((e) => [e.day, e.in, e.out, calcHours(e).toFixed(1)]), [], ['Total Hours', total.toFixed(1)], ['Total Pay', `$${pay.toFixed(2)}`]];
    const csv = rows.map((r) => r.join(',')).join('\n');
    saveBlob(new Blob([csv], { type: 'text/csv' }), `timesheet-${name.replace(/\s+/g, '-')}.csv`);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Employee name"><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Hourly rate ($)" ><input type="number" className="input" value={rate} onChange={(e) => setRate(+e.target.value || 0)} /></Field>
      </div>
      <div className="space-y-2">
        {entries.map((e, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input className="input col-span-3" value={e.day} onChange={(ev) => update(i, 'day', ev.target.value)} />
            <input type="time" className="input col-span-3" value={e.in} onChange={(ev) => update(i, 'in', ev.target.value)} />
            <input type="time" className="input col-span-3" value={e.out} onChange={(ev) => update(i, 'out', ev.target.value)} />
            <span className="col-span-2 text-sm text-slate-600 text-center">{calcHours(e).toFixed(1)}h</span>
            <button onClick={() => setEntries((p) => p.filter((_, j) => j !== i))} className="col-span-1 text-slate-400 hover:text-rose-500"><X className="h-4 w-4 mx-auto" /></button>
          </div>
        ))}
        <button onClick={() => setEntries([...entries, { day: '', in: '09:00', out: '17:00' }])} className="btn-secondary text-sm"><Plus className="h-4 w-4" /> Add row</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Total hours" value={total.toFixed(1)} />
        <Stat label="Total pay" value={`$${pay.toFixed(2)}`} />
      </div>
      <div className="flex justify-end"><button onClick={exportCsv} className="btn-primary"><Download className="h-4 w-4" /> Export CSV</button></div>
    </div>
  );
}

// ============ Work Hours Calculator ============
export function WorkHours(_: { tool: Tool }) {
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');
  const [breakMin, setBreakMin] = useState(30);
  const [days, setDays] = useState(5);
  const [rate, setRate] = useState(20);

  const calcDay = () => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let total = ((eh * 60 + em) - (sh * 60 + sm)) / 60 - breakMin / 60;
    if (total < 0) total = 0;
    return total;
  };
  const dayHours = calcDay();
  const weekHours = dayHours * days;
  const weekPay = weekHours * rate;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Start time"><input type="time" className="input" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field label="End time"><input type="time" className="input" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
        <Field label="Break (minutes)"><input type="number" className="input" value={breakMin} onChange={(e) => setBreakMin(+e.target.value || 0)} /></Field>
        <Field label="Days per week"><input type="number" className="input" value={days} onChange={(e) => setDays(+e.target.value || 1)} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Per day" value={`${dayHours.toFixed(1)}h`} />
        <Stat label="Per week" value={`${weekHours.toFixed(1)}h`} />
        <Stat label="Weekly pay" value={`$${weekPay.toFixed(2)}`} />
      </div>
    </div>
  );
}

// ============ Break Timer ============
export function BreakTimer(_: { tool: Tool }) {
  const [duration, setDuration] = useState(15 * 60);
  const [remaining, setRemaining] = useState(15 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [tickKey, setTickKey] = useState(0);

  const presets = [['Coffee', 5 * 60], ['Lunch', 30 * 60], ['Stretch', 10 * 60], ['Walk', 15 * 60]];
  const setPreset = (s: number) => { setDuration(s); setRemaining(s); setRunning(false); setDone(false); };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => { if (r <= 1) { setRunning(false); setDone(true); return 0; } return r - 1; });
    }, 1000);
    return () => clearInterval(id);
  }, [running, tickKey]);

  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = (remaining % 60).toString().padStart(2, '0');

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-wrap justify-center gap-2">
        {presets.map(([l, s]) => <button key={l as string} onClick={() => setPreset(s as number)} className="btn-secondary text-sm">{l}</button>)}
      </div>
      <p className={`font-display text-6xl font-bold ${done ? 'text-accent-600 animate-pulse' : 'text-slate-900'}`}>{mm}:{ss}</p>
      <div className="flex justify-center gap-2">
        <button onClick={() => { setDone(false); setRunning((r) => !r); setTickKey((k) => k + 1); }} className="btn-primary">{running ? 'Pause' : 'Start'}</button>
        <button onClick={() => { setRunning(false); setRemaining(duration); setDone(false); }} className="btn-secondary">Reset</button>
      </div>
      {done && <p className="font-semibold text-accent-600">Break's over — back to work!</p>}
    </div>
  );
}

// ============ Attendance Tracker ============
export function AttendanceTracker(_: { tool: Tool }) {
  const [records, setRecords] = useState<{ id: string; name: string; date: string; status: 'present' | 'absent' | 'late' }[]>(() => {
    try { return JSON.parse(localStorage.getItem('hr-attendance') || '[]'); } catch { return []; }
  });
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<'present' | 'absent' | 'late'>('present');

  const add = () => {
    if (!name) return;
    const nr = { id: Math.random().toString(36).slice(2), name, date, status };
    const next = [nr, ...records]; setRecords(next); localStorage.setItem('hr-attendance', JSON.stringify(next));
    setName('');
  };
  const del = (id: string) => { const next = records.filter((r) => r.id !== id); setRecords(next); localStorage.setItem('hr-attendance', JSON.stringify(next)); };

  const present = records.filter((r) => r.status === 'present').length;
  const late = records.filter((r) => r.status === 'late').length;
  const absent = records.filter((r) => r.status === 'absent').length;

  const colors = { present: 'bg-accent-100 text-accent-700', late: 'bg-amber-100 text-amber-700', absent: 'bg-rose-100 text-rose-700' };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Employee name"><input className="input" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} /></Field>
        <Field label="Date"><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Status">
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="present">Present</option><option value="late">Late</option><option value="absent">Absent</option>
          </select>
        </Field>
      </div>
      <button onClick={add} className="btn-primary">Add record</button>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Present" value={present} />
        <Stat label="Late" value={late} />
        <Stat label="Absent" value={absent} />
      </div>
      <div className="space-y-2">
        {records.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <span className="flex-1"><span className="font-medium text-slate-800">{r.name}</span> <span className="text-xs text-slate-400">· {r.date}</span></span>
            <span className={`badge ${colors[r.status]}`}>{r.status}</span>
            <button onClick={() => del(r.id)} className="text-slate-400 hover:text-rose-500"><X className="h-4 w-4" /></button>
          </div>
        ))}
        {records.length === 0 && <p className="text-center text-sm text-slate-400 py-6">No attendance records yet.</p>}
      </div>
    </div>
  );
}

// ============ Onboarding Checklist ============
export function OnboardingChecklist(_: { tool: Tool }) {
  const defaultItems = [
    'Send welcome email', 'Create email account', 'Set up workstation', 'Provide employee handbook',
    'Assign mentor', 'Schedule orientation', 'Set up payroll', 'Team introduction meeting',
    'Security training', 'Review job responsibilities',
  ];
  const [items, setItems] = useState<{ text: string; done: boolean }[]>(() => {
    try { const saved = JSON.parse(localStorage.getItem('hr-onboarding') || 'null'); if (saved) return saved; } catch {}
    return defaultItems.map((t) => ({ text: t, done: false }));
  });
  const [newItem, setNewItem] = useState('');
  const [empName, setEmpName] = useState(() => localStorage.getItem('hr-onboard-name') || '');

  const save = (next: typeof items) => { setItems(next); localStorage.setItem('hr-onboarding', JSON.stringify(next)); };
  const toggle = (i: number) => save(items.map((it, j) => j === i ? { ...it, done: !it.done } : it));
  const add = () => { if (newItem.trim()) { save([...items, { text: newItem.trim(), done: false }]); setNewItem(''); } };
  const del = (i: number) => save(items.filter((_, j) => j !== i));

  const done = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  const exportCsv = () => {
    const csv = `Onboarding Checklist for ${empName}\n\nTask,Status\n${items.map((i) => `${i.text},${i.done ? 'Done' : 'Pending'}`).join('\n')}\n\nProgress,${pct}%`;
    saveBlob(new Blob([csv], { type: 'text/csv' }), `onboarding-${empName || 'employee'}.csv`);
  };

  return (
    <div className="space-y-4">
      <Field label="Employee name"><input className="input" value={empName} onChange={(e) => { setEmpName(e.target.value); localStorage.setItem('hr-onboard-name', e.target.value); }} /></Field>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden"><div className="h-full bg-accent-500 transition-all" style={{ width: `${pct}%` }} /></div>
        <span className="text-sm font-semibold text-slate-700">{done}/{items.length}</span>
      </div>
      <div className="flex gap-2"><input className="input" value={newItem} placeholder="Add a task…" onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} /><button onClick={add} className="btn-primary shrink-0"><Plus className="h-4 w-4" /></button></div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <button onClick={() => toggle(i)} className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition ${it.done ? 'bg-accent-500 border-accent-500 text-white' : 'border-slate-300'}`}>{it.done && '✓'}</button>
            <span className={`flex-1 text-sm ${it.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{it.text}</span>
            <button onClick={() => del(i)} className="text-slate-400 hover:text-rose-500"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <div className="flex justify-end"><button onClick={exportCsv} className="btn-primary"><Download className="h-4 w-4" /> Export CSV</button></div>
    </div>
  );
}
