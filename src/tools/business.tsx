import { useState, useEffect, useMemo } from 'react';
import { CopyButton, ResultBox, saveBlob } from '../tool-ui';
import { Plus, Trash2, X, Check, Download } from 'lucide-react';
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

// ============ Inventory List Manager ============
interface InventoryItem { id: string; name: string; sku: string; quantity: number; price: number; }

export function InventoryManager(_: { tool: Tool }) {
  const [items, setItems] = usePersistentState<InventoryItem[]>('biz-inventory', [
    { id: '1', name: 'Widget A', sku: 'WDG-001', quantity: 50, price: 9.99 },
    { id: '2', name: 'Widget B', sku: 'WDG-002', quantity: 12, price: 14.99 },
  ]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const add = () => {
    if (!name.trim()) return;
    setItems([...items, { id: Date.now().toString(), name: name.trim(), sku: sku.trim(), quantity: parseInt(quantity) || 0, price: parseFloat(price) || 0 }]);
    setName(''); setSku(''); setQuantity(''); setPrice('');
  };
  const remove = (id: string) => setItems(items.filter((i) => i.id !== id));
  const updateQty = (id: string, delta: number) => setItems(items.map((i) => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i));

  const totalValue = items.reduce((s, i) => s + i.quantity * i.price, 0);
  const lowStock = items.filter((i) => i.quantity < 10).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <input className="input col-span-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
        <input className="input" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" />
        <input className="input" type="number" min={0} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Qty" />
        <input className="input col-span-2 sm:col-span-1" type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
      </div>
      <button onClick={add} className="btn-secondary w-full"><Plus className="h-4 w-4" /> Add item</button>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-wider text-slate-400">Items</p>
          <p className="font-display text-xl font-bold text-slate-900">{items.length}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-wider text-slate-400">Low stock</p>
          <p className="font-display text-xl font-bold text-amber-600">{lowStock}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-wider text-slate-400">Total value</p>
          <p className="font-display text-xl font-bold text-slate-900">${totalValue.toFixed(2)}</p>
        </div>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No items yet.</p>
        ) : items.map((i) => (
          <div key={i.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">{i.name} <span className="text-xs text-slate-400">· {i.sku}</span></p>
              <p className="text-xs text-slate-500">${i.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => updateQty(i.id, -1)} className="h-6 w-6 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center text-sm">−</button>
              <span className={`w-12 text-center text-sm font-semibold ${i.quantity < 10 ? 'text-amber-600' : 'text-slate-700'}`}>{i.quantity}</span>
              <button onClick={() => updateQty(i.id, 1)} className="h-6 w-6 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center text-sm">+</button>
            </div>
            <button onClick={() => remove(i.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Simple CRM ============
interface CRMSearch { id: string; name: string; email: string; phone: string; company: string; status: 'lead' | 'active' | 'inactive'; notes: string; }

export function SimpleCRM(_: { tool: Tool }) {
  const [contacts, setContacts] = usePersistentState<CRMSearch[]>('biz-crm', [
    { id: '1', name: 'Jane Doe', email: 'jane@example.com', phone: '555-0100', company: 'Acme Inc', status: 'active', notes: 'Interested in premium plan.' },
  ]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<'lead' | 'active' | 'inactive'>('lead');
  const [notes, setNotes] = useState('');
  const [filter, setFilter] = useState<'all' | 'lead' | 'active' | 'inactive'>('all');

  const add = () => {
    if (!name.trim()) return;
    setContacts([...contacts, { id: Date.now().toString(), name: name.trim(), email: email.trim(), phone: phone.trim(), company: company.trim(), status, notes: notes.trim() }]);
    setName(''); setEmail(''); setPhone(''); setCompany(''); setStatus('lead'); setNotes('');
  };
  const remove = (id: string) => setContacts(contacts.filter((c) => c.id !== id));
  const cycleStatus = (id: string) => setContacts(contacts.map((c) => {
    if (c.id !== id) return c;
    const next = c.status === 'lead' ? 'active' : c.status === 'active' ? 'inactive' : 'lead';
    return { ...c, status: next };
  }));

  const filtered = filter === 'all' ? contacts : contacts.filter((c) => c.status === filter);
  const statusColors: Record<string, string> = { lead: 'bg-sky-100 text-sky-700', active: 'bg-emerald-100 text-emerald-700', inactive: 'bg-slate-100 text-slate-500' };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-2">
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
        <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value as 'lead' | 'active' | 'inactive')}>
          <option value="lead">Lead</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={add} className="btn-primary"><Plus className="h-4 w-4" /> Add</button>
      </div>
      <textarea className="input min-h-[50px] text-sm" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes…" />
      <div className="flex gap-2">
        {(['all', 'lead', 'active', 'inactive'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'btn-primary text-sm capitalize' : 'btn-secondary text-sm capitalize'}>{f}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No contacts found.</p>
        ) : filtered.map((c) => (
          <div key={c.id} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                  <button onClick={() => cycleStatus(c.id)} className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[c.status]}`}>{c.status}</button>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{c.company} · {c.email} · {c.phone}</p>
                {c.notes && <p className="text-xs text-slate-400 mt-1">{c.notes}</p>}
              </div>
              <button onClick={() => remove(c.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Client Follow-Up Tracker ============
interface FollowUp { id: string; client: string; action: string; dueDate: string; done: boolean; }

export function ClientFollowUpTracker(_: { tool: Tool }) {
  const [items, setItems] = usePersistentState<FollowUp[]>('biz-followups', [
    { id: '1', client: 'Acme Inc', action: 'Send proposal', dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10), done: false },
  ]);
  const [client, setClient] = useState('');
  const [action, setAction] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [filter, setFilter] = useState<'all' | 'pending' | 'done' | 'overdue'>('all');

  const add = () => {
    if (!client.trim() || !action.trim()) return;
    setItems([...items, { id: Date.now().toString(), client: client.trim(), action: action.trim(), dueDate, done: false }]);
    setClient(''); setAction('');
  };
  const toggle = (id: string) => setItems(items.map((f) => f.id === id ? { ...f, done: !f.done } : f));
  const remove = (id: string) => setItems(items.filter((f) => f.id !== id));

  const today = new Date().toISOString().slice(0, 10);
  const filtered = items.filter((f) => {
    if (filter === 'all') return true;
    if (filter === 'done') return f.done;
    if (filter === 'pending') return !f.done;
    if (filter === 'overdue') return !f.done && f.dueDate < today;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-2">
        <input className="input" value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client name" />
        <input className="input" value={action} onChange={(e) => setAction(e.target.value)} placeholder="Follow-up action" />
        <div className="flex gap-2">
          <input type="date" className="input flex-1" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <button onClick={add} className="btn-primary"><Plus className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'overdue', 'done'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'btn-primary text-sm capitalize' : 'btn-secondary text-sm capitalize'}>{f}</button>
        ))}
      </div>
      <div className="space-y-2">
        {sorted.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No follow-ups.</p>
        ) : sorted.map((f) => {
          const isOverdue = !f.done && f.dueDate < today;
          return (
            <div key={f.id} className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${f.done ? 'bg-emerald-50 ring-emerald-100' : isOverdue ? 'bg-rose-50 ring-rose-100' : 'bg-slate-50 ring-slate-100'}`}>
              <button onClick={() => toggle(f.id)} className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 ${f.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                {f.done && <Check className="h-3 w-3 text-white" />}
              </button>
              <div className="flex-1">
                <p className={`text-sm font-medium ${f.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>{f.client}: {f.action}</p>
                <p className={`text-xs ${isOverdue ? 'text-rose-500 font-medium' : 'text-slate-400'}`}>Due {f.dueDate}{isOverdue ? ' · Overdue' : ''}</p>
              </div>
              <button onClick={() => remove(f.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ Order Status Tracker ============
interface Order { id: string; orderNum: string; customer: string; status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; total: number; }

export function OrderStatusTracker(_: { tool: Tool }) {
  const [orders, setOrders] = usePersistentState<Order[]>('biz-orders', [
    { id: '1', orderNum: 'ORD-001', customer: 'John Smith', status: 'processing', total: 129.99 },
    { id: '2', orderNum: 'ORD-002', customer: 'Jane Doe', status: 'shipped', total: 49.99 },
  ]);
  const [orderNum, setOrderNum] = useState('');
  const [customer, setCustomer] = useState('');
  const [total, setTotal] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');

  const add = () => {
    if (!orderNum.trim()) return;
    setOrders([...orders, { id: Date.now().toString(), orderNum: orderNum.trim(), customer: customer.trim(), status: 'pending', total: parseFloat(total) || 0 }]);
    setOrderNum(''); setCustomer(''); setTotal('');
  };
  const remove = (id: string) => setOrders(orders.filter((o) => o.id !== id));
  const cycleStatus = (id: string) => setOrders(orders.map((o) => {
    if (o.id !== id) return o;
    const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const next = statuses[(statuses.indexOf(o.status) + 1) % statuses.length];
    return { ...o, status: next };
  }));

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700', processing: 'bg-sky-100 text-sky-700',
    shipped: 'bg-violet-100 text-violet-700', delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-4 gap-2">
        <input className="input" value={orderNum} onChange={(e) => setOrderNum(e.target.value)} placeholder="Order #" />
        <input className="input" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Customer" />
        <input className="input" type="number" min={0} step="0.01" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total $" />
        <button onClick={add} className="btn-primary"><Plus className="h-4 w-4" /> Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'btn-primary text-sm capitalize' : 'btn-secondary text-sm capitalize'}>{f}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No orders found.</p>
        ) : filtered.map((o) => (
          <div key={o.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">{o.orderNum} <span className="text-xs font-normal text-slate-400">· {o.customer}</span></p>
              <p className="text-xs text-slate-500">${o.total.toFixed(2)}</p>
            </div>
            <button onClick={() => cycleStatus(o.id)} className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColors[o.status]}`}>{o.status}</button>
            <button onClick={() => remove(o.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Business Expense Tracker ============
interface Expense { id: string; date: string; category: string; description: string; amount: number; }

export function BusinessExpenseTracker(_: { tool: Tool }) {
  const [expenses, setExpenses] = usePersistentState<Expense[]>('biz-expenses', [
    { id: '1', date: new Date().toISOString().slice(0, 10), category: 'Office', description: 'Office supplies', amount: 45.50 },
  ]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('Office');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const add = () => {
    const amt = parseFloat(amount);
    if (!description.trim() || isNaN(amt) || amt <= 0) return;
    setExpenses([...expenses, { id: Date.now().toString(), date, category: category.trim(), description: description.trim(), amount: amt }]);
    setDescription(''); setAmount('');
  };
  const remove = (id: string) => setExpenses(expenses.filter((e) => e.id !== id));

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const categories = ['Office', 'Travel', 'Meals', 'Software', 'Equipment', 'Marketing', 'Utilities', 'Other'];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-6 text-center shadow-lg">
        <p className="text-xs uppercase tracking-wider text-white/60">Total expenses</p>
        <p className="font-display text-4xl font-bold text-white mt-1">${total.toFixed(2)}</p>
        <p className="text-sm text-white/70 mt-1">{expenses.length} transactions</p>
      </div>
      <div className="grid sm:grid-cols-4 gap-2">
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <div className="flex gap-2">
          <input className="input flex-1" type="number" min={0} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
          <button onClick={add} className="btn-primary"><Plus className="h-4 w-4" /></button>
        </div>
      </div>
      {byCategory.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">By category</p>
          {byCategory.map(([cat, amt]) => (
            <div key={cat} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-100">
              <span className="text-slate-600">{cat}</span>
              <span className="font-medium text-slate-800">${amt.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        {expenses.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">No expenses yet.</p>
        ) : expenses.slice().reverse().map((e) => (
          <div key={e.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">{e.description}</p>
              <p className="text-xs text-slate-400">{e.date} · {e.category}</p>
            </div>
            <span className="text-sm font-semibold text-slate-700">${e.amount.toFixed(2)}</span>
            <button onClick={() => remove(e.id)} className="text-slate-300 hover:text-rose-500"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Profit Margin Calculator ============
export function ProfitMarginCalculator(_: { tool: Tool }) {
  const [revenue, setRevenue] = useState('1000');
  const [cost, setCost] = useState('600');

  const rev = parseFloat(revenue) || 0;
  const c = parseFloat(cost) || 0;
  const profit = rev - c;
  const margin = rev > 0 ? (profit / rev) * 100 : 0;
  const markup = c > 0 ? (profit / c) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Revenue ($)</label>
          <input type="number" min={0} step="0.01" className="input" value={revenue} onChange={(e) => setRevenue(e.target.value)} />
        </div>
        <div>
          <label className="label">Cost ($)</label>
          <input type="number" min={0} step="0.01" className="input" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-50 p-4 text-center ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-wider text-slate-400">Profit</p>
          <p className={`font-display text-2xl font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>${profit.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 text-center ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-wider text-slate-400">Margin</p>
          <p className={`font-display text-2xl font-bold ${margin >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{margin.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 text-center ring-1 ring-slate-100 col-span-2 sm:col-span-1">
          <p className="text-xs uppercase tracking-wider text-slate-400">Markup</p>
          <p className={`font-display text-2xl font-bold ${markup >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{markup.toFixed(1)}%</p>
        </div>
      </div>
      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <p className="text-sm text-slate-600">
          <span className="font-medium">Profit margin</span> shows what percentage of your revenue is profit.
          <span className="font-medium"> Markup</span> shows how much you've added to the cost to get the selling price.
        </p>
      </div>
    </div>
  );
}
