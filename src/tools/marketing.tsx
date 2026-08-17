import { useState, useMemo } from 'react';
import { CopyButton, ErrorBanner, ResultBox } from '../tool-ui';
import { saveBlob } from '../tool-ui';
import { Plus, Trash2, Download, Copy } from 'lucide-react';
import type { Tool } from '../catalog';

// ============ Meta Tag Generator ============
export function MetaTagGenerator(_: { tool: Tool }) {
  const [title, setTitle] = useState('Go LANA — Free Online Tools');
  const [desc, setDesc] = useState('A library of all needed apps: PDF, media, calculators, utilities, AI, developer tools, games and more.');
  const [url, setUrl] = useState('https://golana.online');
  const [image, setImage] = useState('https://golana.online/og.png');
  const [keywords, setKeywords] = useState('free tools, online tools, pdf tools');
  const [author, setAuthor] = useState('');

  const tags = useMemo(() => {
    const lines: string[] = [];
    lines.push(`<title>${title}</title>`);
    lines.push(`<meta name="description" content="${desc}" />`);
    if (keywords.trim()) lines.push(`<meta name="keywords" content="${keywords}" />`);
    if (author.trim()) lines.push(`<meta name="author" content="${author}" />`);
    lines.push(`<meta name="robots" content="index, follow" />`);
    lines.push('');
    lines.push(`<!-- Open Graph -->`);
    lines.push(`<meta property="og:title" content="${title}" />`);
    lines.push(`<meta property="og:description" content="${desc}" />`);
    lines.push(`<meta property="og:url" content="${url}" />`);
    lines.push(`<meta property="og:image" content="${image}" />`);
    lines.push(`<meta property="og:type" content="website" />`);
    lines.push('');
    lines.push(`<!-- Twitter -->`);
    lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
    lines.push(`<meta name="twitter:title" content="${title}" />`);
    lines.push(`<meta name="twitter:description" content="${desc}" />`);
    lines.push(`<meta name="twitter:image" content="${image}" />`);
    return lines.join('\n');
  }, [title, desc, url, image, keywords, author]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Page Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label">URL</label>
          <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Description</label>
          <textarea className="input min-h-[80px]" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <div>
          <label className="label">OG Image URL</label>
          <input className="input" value={image} onChange={(e) => setImage(e.target.value)} />
        </div>
        <div>
          <label className="label">Keywords (comma-separated)</label>
          <input className="input" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
        </div>
        <div>
          <label className="label">Author</label>
          <input className="input" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
      </div>
      <ResultBox>
        <pre className="overflow-x-auto text-xs font-mono text-slate-800 whitespace-pre-wrap">{tags}</pre>
      </ResultBox>
      <div className="flex justify-end gap-2">
        <CopyButton text={tags} />
      </div>
    </div>
  );
}

// ============ Keyword Density Checker ============
export function KeywordDensityChecker(_: { tool: Tool }) {
  const [text, setText] = useState('');
  const [minLen, setMinLen] = useState(3);

  const result = useMemo(() => {
    if (!text.trim()) return [];
    const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
    const filtered = words.filter((w) => w.length >= minLen);
    const total = filtered.length;
    const counts: Record<string, number> = {};
    filtered.forEach((w) => { counts[w] = (counts[w] || 0) + 1; });
    return Object.entries(counts)
      .map(([word, count]) => ({ word, count, pct: (count / total) * 100 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [text, minLen]);

  return (
    <div className="space-y-4">
      <textarea className="input min-h-[160px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your content here…" />
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500">Min word length</label>
        <input type="number" min={1} max={10} className="input max-w-[80px] text-center" value={minLen} onChange={(e) => setMinLen(Math.max(1, +e.target.value || 1))} />
      </div>
      {result.length > 0 ? (
        <ResultBox>
          <div className="space-y-1.5">
            {result.map((r) => (
              <div key={r.word} className="flex items-center gap-3">
                <span className="w-28 truncate text-sm font-medium text-slate-700">{r.word}</span>
                <div className="flex-1 h-5 rounded bg-slate-100 overflow-hidden">
                  <div className="h-full bg-brand-500 rounded" style={{ width: `${Math.max(2, r.pct)}%` }} />
                </div>
                <span className="w-12 text-right text-xs text-slate-500">{r.count}x</span>
                <span className="w-12 text-right text-xs font-mono text-slate-400">{r.pct.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </ResultBox>
      ) : (
        <p className="text-center text-sm text-slate-400 py-4">Enter text to see keyword density.</p>
      )}
    </div>
  );
}

// ============ UTM Builder ============
export function UtmBuilder(_: { tool: Tool }) {
  const [base, setBase] = useState('https://golana.online');
  const [source, setSource] = useState('newsletter');
  const [medium, setMedium] = useState('email');
  const [campaign, setCampaign] = useState('summer_sale');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');

  const url = useMemo(() => {
    const params = new URLSearchParams();
    params.set('utm_source', source);
    params.set('utm_medium', medium);
    if (campaign.trim()) params.set('utm_campaign', campaign);
    if (term.trim()) params.set('utm_term', term);
    if (content.trim()) params.set('utm_content', content);
    try {
      const u = new URL(base);
      u.search = params.toString();
      return u.toString();
    } catch {
      return `${base}?${params.toString()}`;
    }
  }, [base, source, medium, campaign, term, content]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Website URL</label>
        <input className="input" value={base} onChange={(e) => setBase(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Campaign Source *</label>
          <input className="input" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. newsletter" />
        </div>
        <div>
          <label className="label">Campaign Medium *</label>
          <input className="input" value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="e.g. email" />
        </div>
        <div>
          <label className="label">Campaign Name</label>
          <input className="input" value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="e.g. summer_sale" />
        </div>
        <div>
          <label className="label">Campaign Term</label>
          <input className="input" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="e.g. running+shoes" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Campaign Content</label>
          <input className="input" value={content} onChange={(e) => setContent(e.target.value)} placeholder="e.g. banner_top" />
        </div>
      </div>
      <ResultBox>
        <p className="break-all text-sm font-mono text-slate-800">{url}</p>
      </ResultBox>
      <div className="flex justify-end">
        <CopyButton text={url} />
      </div>
    </div>
  );
}

// ============ Popup Builder ============
export function PopupBuilder(_: { tool: Tool }) {
  const [headline, setHeadline] = useState('Get 10% Off!');
  const [body, setBody] = useState('Subscribe to our newsletter and receive an exclusive discount on your first order.');
  const [cta, setCta] = useState('Claim Discount');
  const [bg, setBg] = useState('#ffffff');
  const [accent, setAccent] = useState('#2470f5');
  const [position, setPosition] = useState<'center' | 'bottom' | 'top'>('center');

  const code = useMemo(() => {
    const pos = position === 'center' ? 'align-items:center;' : position === 'bottom' ? 'align-items:flex-end;' : 'align-items:flex-start;';
    return `<div id="popup" style="position:fixed;inset:0;z-index:9999;display:flex;${pos}justify-content:center;background:rgba(0,0,0,0.5);padding:1rem;">
  <div style="background:${bg};border-radius:16px;max-width:420px;width:100%;padding:2rem;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
    <h2 style="font-size:1.5rem;font-weight:bold;margin:0 0 0.75rem;color:#1e293b;">${headline}</h2>
    <p style="color:#64748b;margin:0 0 1.5rem;line-height:1.5;">${body}</p>
    <a href="#" style="display:inline-block;background:${accent};color:#fff;padding:0.75rem 2rem;border-radius:8px;text-decoration:none;font-weight:600;">${cta}</a>
  </div>
</div>`;
  }, [headline, body, cta, bg, accent, position]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Headline</label>
          <input className="input" value={headline} onChange={(e) => setHeadline(e.target.value)} />
        </div>
        <div>
          <label className="label">CTA Button Text</label>
          <input className="input" value={cta} onChange={(e) => setCta(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Body Text</label>
          <textarea className="input min-h-[80px]" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div>
          <label className="label">Background Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-14 rounded-lg ring-1 ring-slate-200" />
            <input className="input" value={bg} onChange={(e) => setBg(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Button Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-10 w-14 rounded-lg ring-1 ring-slate-200" />
            <input className="input" value={accent} onChange={(e) => setAccent(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Position</label>
          <select className="input" value={position} onChange={(e) => setPosition(e.target.value as 'center' | 'bottom' | 'top')}>
            <option value="center">Center</option>
            <option value="bottom">Bottom</option>
            <option value="top">Top</option>
          </select>
        </div>
      </div>
      <div>
        <p className="label">Live Preview</p>
        <div className="rounded-xl bg-slate-200 p-6 min-h-[200px] flex" style={{ alignItems: position === 'bottom' ? 'flex-end' : position === 'top' ? 'flex-start' : 'center', justifyContent: 'center' }}>
          <div style={{ background: bg }} className="max-w-[340px] w-full rounded-2xl p-6 text-center shadow-lg">
            <h3 className="text-lg font-bold text-slate-800 mb-2">{headline}</h3>
            <p className="text-sm text-slate-500 mb-4">{body}</p>
            <span style={{ background: accent }} className="inline-block text-white px-6 py-2 rounded-lg font-semibold text-sm">{cta}</span>
          </div>
        </div>
      </div>
      <ResultBox>
        <pre className="overflow-x-auto text-xs font-mono text-slate-800 whitespace-pre-wrap">{code}</pre>
      </ResultBox>
      <div className="flex justify-end">
        <CopyButton text={code} />
      </div>
    </div>
  );
}

// ============ Pricing Table Generator ============
interface Plan { name: string; price: string; period: string; features: string; featured: boolean; }

export function PricingTableGenerator(_: { tool: Tool }) {
  const [plans, setPlans] = useState<Plan[]>([
    { name: 'Starter', price: '$9', period: '/mo', features: '1 project\nEmail support\n5GB storage', featured: false },
    { name: 'Pro', price: '$29', period: '/mo', features: '10 projects\nPriority support\n50GB storage\nCustom domain', featured: true },
    { name: 'Business', price: '$99', period: '/mo', features: 'Unlimited projects\n24/7 support\n500GB storage\nCustom domain\nAPI access', featured: false },
  ]);

  const update = (idx: number, patch: Partial<Plan>) => setPlans((p) => p.map((pl, i) => i === idx ? { ...pl, ...patch } : pl));
  const addPlan = () => setPlans((p) => [...p, { name: 'New Plan', price: '$0', period: '/mo', features: 'Feature 1', featured: false }]);
  const removePlan = (idx: number) => setPlans((p) => p.filter((_, i) => i !== idx));

  const code = useMemo(() => {
    const cols = plans.map((p) => {
      const feats = p.features.split('\n').filter((f) => f.trim()).map((f) => `      <li style="padding:0.5rem 0;border-bottom:1px solid #e2e8f0;">✓ ${f.trim()}</li>`).join('\n');
      return `    <div style="flex:1;max-width:280px;background:#fff;border-radius:16px;padding:2rem;text-align:center;${p.featured ? 'border:2px solid #2470f5;box-shadow:0 10px 30px rgba(36,112,245,0.15);' : 'border:1px solid #e2e8f0;'}">
      <h3 style="font-size:1.125rem;font-weight:600;color:#64748b;margin:0 0 0.5rem;">${p.name}</h3>
      <p style="font-size:2.5rem;font-weight:700;color:#1e293b;margin:0 0 0.25rem;">${p.price}<span style="font-size:1rem;color:#94a3b8;">${p.period}</span></p>
      <ul style="list-style:none;padding:0;margin:1.5rem 0;text-align:left;color:#475569;font-size:0.875rem;">
${feats}
      </ul>
      <a href="#" style="display:block;background:${p.featured ? '#2470f5' : '#f1f5f9'};color:${p.featured ? '#fff' : '#475569'};padding:0.75rem;border-radius:8px;text-decoration:none;font-weight:600;text-align:center;">Choose ${p.name}</a>
    </div>`;
    }).join('\n');
    return `<div style="display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:center;padding:2rem 0;font-family:system-ui,sans-serif;">
${cols}
</div>`;
  }, [plans]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {plans.map((p, idx) => (
          <div key={idx} className="flex-1 min-w-[200px] rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <input className="input font-semibold text-sm" value={p.name} onChange={(e) => update(idx, { name: e.target.value })} />
              <button onClick={() => removePlan(idx)} className="text-slate-300 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="flex gap-2">
              <input className="input" value={p.price} onChange={(e) => update(idx, { price: e.target.value })} placeholder="$9" />
              <input className="input" value={p.period} onChange={(e) => update(idx, { period: e.target.value })} placeholder="/mo" />
            </div>
            <textarea className="input min-h-[100px] text-xs" value={p.features} onChange={(e) => update(idx, { features: e.target.value })} placeholder="One feature per line" />
            <label className="flex items-center gap-1.5 text-xs text-slate-600">
              <input type="checkbox" checked={p.featured} onChange={(e) => update(idx, { featured: e.target.checked })} className="accent-brand-600 h-4 w-4" />
              Highlight as featured
            </label>
          </div>
        ))}
        <button onClick={addPlan} className="flex-1 min-w-[200px] rounded-xl border-2 border-dashed border-slate-200 p-4 text-sm text-slate-400 hover:border-brand-300 hover:text-brand-600 transition flex items-center justify-center gap-1">
          <Plus className="h-4 w-4" /> Add plan
        </button>
      </div>
      <div>
        <p className="label">Live Preview</p>
        <div className="flex flex-wrap gap-4 justify-center bg-slate-100 rounded-xl p-4">
          {plans.map((p, i) => (
            <div key={i} style={p.featured ? { border: '2px solid #2470f5' } : { border: '1px solid #e2e8f0' }} className="max-w-[240px] w-full bg-white rounded-2xl p-5 text-center">
              <p className="text-sm font-semibold text-slate-500">{p.name}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{p.price}<span className="text-sm text-slate-400">{p.period}</span></p>
              <ul className="text-left text-xs text-slate-600 mt-3 space-y-1">
                {p.features.split('\n').filter((f) => f.trim()).map((f, j) => <li key={j} className="flex gap-1"><span className="text-accent-500">✓</span>{f.trim()}</li>)}
              </ul>
              <span style={{ background: p.featured ? '#2470f5' : '#f1f5f9', color: p.featured ? '#fff' : '#475569' }} className="block mt-4 py-2 rounded-lg text-sm font-semibold">{`Choose ${p.name}`}</span>
            </div>
          ))}
        </div>
      </div>
      <ResultBox>
        <pre className="overflow-x-auto text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-[300px]">{code}</pre>
      </ResultBox>
      <div className="flex justify-end">
        <CopyButton text={code} />
      </div>
    </div>
  );
}

// ============ FAQ Accordion Builder ============
interface Faq { q: string; a: string; }

export function FaqAccordionBuilder(_: { tool: Tool }) {
  const [faqs, setFaqs] = useState<Faq[]>([
    { q: 'What is Go LANA?', a: 'Go LANA is a free library of online tools for everyday tasks.' },
    { q: 'Do I need to sign up?', a: 'No, all tools work instantly in your browser without an account.' },
    { q: 'Is it really free?', a: 'Yes, every tool is completely free to use.' },
  ]);

  const update = (idx: number, patch: Partial<Faq>) => setFaqs((f) => f.map((fi, i) => i === idx ? { ...fi, ...patch } : fi));
  const addFaq = () => setFaqs((f) => [...f, { q: 'New question?', a: 'New answer.' }]);
  const removeFaq = (idx: number) => setFaqs((f) => f.filter((_, i) => i !== idx));

  const code = useMemo(() => {
    const items = faqs.map((f) => `  <details style="border:1px solid #e2e8f0;border-radius:8px;padding:1rem 1.25rem;margin-bottom:0.75rem;">
    <summary style="font-weight:600;cursor:pointer;color:#1e293b;font-size:1rem;">${f.q}</summary>
    <p style="margin:0.75rem 0 0;color:#64748b;line-height:1.6;">${f.a}</p>
  </details>`).join('\n');
    return `<div style="max-width:640px;margin:0 auto;font-family:system-ui,sans-serif;">
${items}
</div>`;
  }, [faqs]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {faqs.map((f, idx) => (
          <div key={idx} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100 space-y-2">
            <div className="flex items-center gap-2">
              <input className="input font-medium" value={f.q} onChange={(e) => update(idx, { q: e.target.value })} placeholder="Question" />
              <button onClick={() => removeFaq(idx)} className="text-slate-300 hover:text-rose-500 shrink-0"><Trash2 className="h-4 w-4" /></button>
            </div>
            <textarea className="input min-h-[60px] text-sm" value={f.a} onChange={(e) => update(idx, { a: e.target.value })} placeholder="Answer" />
          </div>
        ))}
      </div>
      <button onClick={addFaq} className="btn-secondary w-full"><Plus className="h-4 w-4" /> Add question</button>
      <div>
        <p className="label">Live Preview</p>
        <div className="max-w-lg mx-auto space-y-2">
          {faqs.map((f, i) => (
            <details key={i} className="rounded-lg border border-slate-200 p-3">
              <summary className="font-semibold text-slate-800 cursor-pointer text-sm">{f.q}</summary>
              <p className="mt-2 text-sm text-slate-500">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <ResultBox>
        <pre className="overflow-x-auto text-xs font-mono text-slate-800 whitespace-pre-wrap">{code}</pre>
      </ResultBox>
      <div className="flex justify-end">
        <CopyButton text={code} />
      </div>
    </div>
  );
}

// ============ Email Signature Generator ============
export function EmailSignatureGenerator(_: { tool: Tool }) {
  const [name, setName] = useState('Jane Doe');
  const [title, setTitle] = useState('Marketing Manager');
  const [company, setCompany] = useState('Go LANA');
  const [email, setEmail] = useState('jane@golana.online');
  const [phone, setPhone] = useState('+1 555 0100');
  const [website, setWebsite] = useState('golana.online');
  const [accent, setAccent] = useState('#2470f5');

  const code = useMemo(() => {
    return `<table style="font-family:system-ui,sans-serif;font-size:14px;color:#475569;border-left:3px solid ${accent};padding-left:16px;">
  <tr>
    <td style="padding:0;">
      <p style="margin:0;font-size:16px;font-weight:700;color:#1e293b;">${name}</p>
      <p style="margin:2px 0 8px;color:#64748b;font-size:13px;">${title} · ${company}</p>
      <p style="margin:2px 0;color:#64748b;">✉ <a href="mailto:${email}" style="color:${accent};text-decoration:none;">${email}</a></p>
      <p style="margin:2px 0;color:#64748b;">☎ ${phone}</p>
      <p style="margin:2px 0;color:#64748b;">🌐 <a href="https://${website}" style="color:${accent};text-decoration:none;">${website}</a></p>
    </td>
  </tr>
</table>`;
  }, [name, title, company, email, phone, website, accent]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Full Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">Job Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label">Company</label>
          <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="label">Website</label>
          <input className="input" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <div>
          <label className="label">Accent Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-10 w-14 rounded-lg ring-1 ring-slate-200" />
            <input className="input" value={accent} onChange={(e) => setAccent(e.target.value)} />
          </div>
        </div>
      </div>
      <div>
        <p className="label">Live Preview</p>
        <div className="rounded-xl bg-white p-4 ring-1 ring-slate-100" dangerouslySetInnerHTML={{ __html: code }} />
      </div>
      <ResultBox>
        <pre className="overflow-x-auto text-xs font-mono text-slate-800 whitespace-pre-wrap">{code}</pre>
      </ResultBox>
      <div className="flex justify-end">
        <CopyButton text={code} />
      </div>
    </div>
  );
}

// ============ Invoice Generator ============
interface InvoiceItem { desc: string; qty: number; rate: number; }

export function InvoiceGenerator(_: { tool: Tool }) {
  const [fromName, setFromName] = useState('Your Company LLC');
  const [toName, setToName] = useState('Client Inc.');
  const [invoiceNo, setInvoiceNo] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState<InvoiceItem[]>([
    { desc: 'Design work', qty: 10, rate: 50 },
    { desc: 'Consultation', qty: 2, rate: 100 },
  ]);
  const [taxRate, setTaxRate] = useState(0);

  const updateItem = (idx: number, patch: Partial<InvoiceItem>) => setItems((it) => it.map((im, i) => i === idx ? { ...im, ...patch } : im));
  const addItem = () => setItems((it) => [...it, { desc: '', qty: 1, rate: 0 }]);
  const removeItem = (idx: number) => setItems((it) => it.filter((_, i) => i !== idx));

  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const downloadHtml = () => {
    const rows = items.map((it) => `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${it.desc}</td><td style="padding:8px;text-align:center;border-bottom:1px solid #e2e8f0;">${it.qty}</td><td style="padding:8px;text-align:right;border-bottom:1px solid #e2e8f0;">$${it.rate.toFixed(2)}</td><td style="padding:8px;text-align:right;border-bottom:1px solid #e2e8f0;">$${(it.qty * it.rate).toFixed(2)}</td></tr>`).join('');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${invoiceNo}</title></head><body style="font-family:system-ui,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#1e293b;">
<h1 style="font-size:2rem;font-weight:700;margin:0 0 1rem;">Invoice</h1>
<p style="color:#64748b;margin:0 0 0.25rem;"><strong>From:</strong> ${fromName}</p>
<p style="color:#64748b;margin:0 0 0.25rem;"><strong>Bill To:</strong> ${toName}</p>
<p style="color:#64748b;margin:0 0 1rem;"><strong>Invoice #:</strong> ${invoiceNo} &nbsp; <strong>Date:</strong> ${date}</p>
<table style="width:100%;border-collapse:collapse;margin-bottom:1rem;">
<thead><tr style="background:#f8fafc;"><th style="padding:8px;text-align:left;border-bottom:2px solid #e2e8f0;">Description</th><th style="padding:8px;text-align:center;border-bottom:2px solid #e2e8f0;">Qty</th><th style="padding:8px;text-align:right;border-bottom:2px solid #e2e8f0;">Rate</th><th style="padding:8px;text-align:right;border-bottom:2px solid #e2e8f0;">Amount</th></tr></thead>
<tbody>${rows}</tbody>
</table>
<div style="text-align:right;">
<p style="margin:0.25rem 0;color:#64748b;">Subtotal: $${subtotal.toFixed(2)}</p>
<p style="margin:0.25rem 0;color:#64748b;">Tax (${taxRate}%): $${tax.toFixed(2)}</p>
<p style="margin:0.5rem 0;font-size:1.25rem;font-weight:700;color:#1e293b;">Total: $${total.toFixed(2)}</p>
</div>
</body></html>`;
    saveBlob(new Blob([html], { type: 'text/html' }), `invoice-${invoiceNo}.html`);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">From</label>
          <input className="input" value={fromName} onChange={(e) => setFromName(e.target.value)} />
        </div>
        <div>
          <label className="label">Bill To</label>
          <input className="input" value={toName} onChange={(e) => setToName(e.target.value)} />
        </div>
        <div>
          <label className="label">Invoice #</label>
          <input className="input" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
        </div>
        <div>
          <label className="label">Date</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        {items.map((it, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input className="input flex-1" value={it.desc} onChange={(e) => updateItem(idx, { desc: e.target.value })} placeholder="Description" />
            <input type="number" min={1} className="input w-20 text-center" value={it.qty} onChange={(e) => updateItem(idx, { qty: +e.target.value || 0 })} />
            <input type="number" min={0} className="input w-24 text-right" value={it.rate} onChange={(e) => updateItem(idx, { rate: +e.target.value || 0 })} />
            <span className="w-24 text-right text-sm font-medium text-slate-700">${(it.qty * it.rate).toFixed(2)}</span>
            <button onClick={() => removeItem(idx)} className="text-slate-300 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        <button onClick={addItem} className="btn-secondary w-full"><Plus className="h-4 w-4" /> Add item</button>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-500">Tax rate (%)</label>
        <input type="number" min={0} max={100} className="input max-w-[80px] text-center" value={taxRate} onChange={(e) => setTaxRate(Math.max(0, +e.target.value || 0))} />
      </div>
      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 space-y-1">
        <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm text-slate-600"><span>Tax ({taxRate}%)</span><span>${tax.toFixed(2)}</span></div>
        <div className="flex justify-between font-display text-lg font-bold text-slate-900 pt-1 border-t border-slate-200"><span>Total</span><span>${total.toFixed(2)}</span></div>
      </div>
      <div className="flex justify-end">
        <button onClick={downloadHtml} className="btn-primary"><Download className="h-4 w-4" /> Download invoice</button>
      </div>
    </div>
  );
}

// ============ Simple Logo Maker ============
export function LogoMaker(_: { tool: Tool }) {
  const [text, setText] = useState('LANA');
  const [sub, setSub] = useState('ONLINE');
  const [font, setFont] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [bg, setBg] = useState('#2470f5');
  const [fg, setFg] = useState('#ffffff');
  const [shape, setShape] = useState<'square' | 'rounded' | 'circle'>('rounded');
  const [size, setSize] = useState(200);

  const fontClass = font === 'mono' ? 'font-mono' : font === 'serif' ? 'font-serif' : 'font-display';
  const shapeClass = shape === 'circle' ? 'rounded-full' : shape === 'rounded' ? 'rounded-2xl' : 'rounded-none';

  const download = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${shape === 'circle' ? size / 2 : shape === 'rounded' ? 24 : 0}" fill="${bg}" />
  <text x="50%" y="${sub ? '42%' : '52%'}" text-anchor="middle" dominant-baseline="middle" font-family="${font === 'mono' ? 'monospace' : font === 'serif' ? 'serif' : 'sans-serif'}" font-size="${size * 0.28}" font-weight="700" fill="${fg}">${text}</text>
  ${sub ? `<text x="50%" y="62%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="${size * 0.1}" letter-spacing="2" fill="${fg}" opacity="0.7">${sub}</text>` : ''}
</svg>`;
    saveBlob(new Blob([svg], { type: 'image/svg+xml' }), `logo-${text.toLowerCase()}.svg`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div style={{ width: size, height: size, background: bg }} className={`${shapeClass} flex flex-col items-center justify-center ${fontClass} shadow-lg`}>
          <span style={{ color: fg, fontSize: size * 0.28 }} className="font-bold leading-none">{text}</span>
          {sub && <span style={{ color: fg, fontSize: size * 0.1 }} className="tracking-widest opacity-70 mt-1">{sub}</span>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Logo Text</label>
          <input className="input" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <label className="label">Subtitle</label>
          <input className="input" value={sub} onChange={(e) => setSub(e.target.value)} />
        </div>
        <div>
          <label className="label">Font</label>
          <select className="input" value={font} onChange={(e) => setFont(e.target.value as 'sans' | 'serif' | 'mono')}>
            <option value="sans">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="mono">Monospace</option>
          </select>
        </div>
        <div>
          <label className="label">Shape</label>
          <select className="input" value={shape} onChange={(e) => setShape(e.target.value as 'square' | 'rounded' | 'circle')}>
            <option value="rounded">Rounded</option>
            <option value="square">Square</option>
            <option value="circle">Circle</option>
          </select>
        </div>
        <div>
          <label className="label">Background</label>
          <div className="flex items-center gap-2">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-14 rounded-lg ring-1 ring-slate-200" />
            <input className="input" value={bg} onChange={(e) => setBg(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Text Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-14 rounded-lg ring-1 ring-slate-200" />
            <input className="input" value={fg} onChange={(e) => setFg(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Size (px)</label>
          <input type="number" min={80} max={400} className="input" value={size} onChange={(e) => setSize(Math.max(80, Math.min(400, +e.target.value || 200)))} />
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={download} className="btn-primary"><Download className="h-4 w-4" /> Download SVG</button>
      </div>
    </div>
  );
}

// ============ Social Media Post Template Maker ============
export function SocialPostTemplateMaker(_: { tool: Tool }) {
  const [platform, setPlatform] = useState<'instagram' | 'twitter' | 'linkedin' | 'facebook'>('instagram');
  const [headline, setHeadline] = useState('Big news!');
  const [body, setBody] = useState('We just launched something amazing. Check it out now and let us know what you think.');
  const [hashtags, setHashtags] = useState('#launch #newproduct');
  const [bg, setBg] = useState('#2470f5');
  const [fg, setFg] = useState('#ffffff');

  const dims: Record<string, { w: number; h: number; label: string }> = {
    instagram: { w: 1080, h: 1080, label: '1080 × 1080 (Square)' },
    twitter: { w: 1500, h: 500, label: '1500 × 500 (Header)' },
    linkedin: { w: 1200, h: 627, label: '1200 × 627 (Share)' },
    facebook: { w: 1200, h: 630, label: '1200 × 630 (Link)' },
  };
  const d = dims[platform];

  const download = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${d.w}" height="${d.h}">
  <rect width="${d.w}" height="${d.h}" fill="${bg}" />
  <text x="50%" y="40%" text-anchor="middle" font-family="sans-serif" font-size="${d.h * 0.12}" font-weight="700" fill="${fg}">${headline}</text>
  <text x="50%" y="55%" text-anchor="middle" font-family="sans-serif" font-size="${d.h * 0.05}" fill="${fg}" opacity="0.85">${body.slice(0, 80)}</text>
  <text x="50%" y="70%" text-anchor="middle" font-family="sans-serif" font-size="${d.h * 0.04}" fill="${fg}" opacity="0.7">${hashtags}</text>
</svg>`;
    saveBlob(new Blob([svg], { type: 'image/svg+xml' }), `${platform}-post.svg`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(['instagram', 'twitter', 'linkedin', 'facebook'] as const).map((p) => (
          <button key={p} onClick={() => setPlatform(p)} className={platform === p ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>{p[0].toUpperCase() + p.slice(1)}</button>
        ))}
      </div>
      <p className="text-xs text-slate-400">{d.label}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Headline</label>
          <input className="input" value={headline} onChange={(e) => setHeadline(e.target.value)} />
        </div>
        <div>
          <label className="label">Hashtags</label>
          <input className="input" value={hashtags} onChange={(e) => setHashtags(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Body Text</label>
          <textarea className="input min-h-[80px]" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div>
          <label className="label">Background</label>
          <div className="flex items-center gap-2">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-14 rounded-lg ring-1 ring-slate-200" />
            <input className="input" value={bg} onChange={(e) => setBg(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Text Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-14 rounded-lg ring-1 ring-slate-200" />
            <input className="input" value={fg} onChange={(e) => setFg(e.target.value)} />
          </div>
        </div>
      </div>
      <div>
        <p className="label">Live Preview</p>
        <div style={{ aspectRatio: `${d.w} / ${d.h}`, background: bg }} className="rounded-xl p-6 flex flex-col justify-center text-center max-h-[280px] overflow-hidden">
          <p style={{ color: fg }} className="font-display font-bold text-xl sm:text-2xl">{headline}</p>
          <p style={{ color: fg }} className="text-sm mt-2 opacity-85 line-clamp-3">{body}</p>
          <p style={{ color: fg }} className="text-xs mt-2 opacity-70">{hashtags}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={download} className="btn-primary"><Download className="h-4 w-4" /> Download SVG</button>
      </div>
    </div>
  );
}
