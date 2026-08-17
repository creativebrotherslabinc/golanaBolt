import { useState, useRef } from 'react';
import { Plus, X, Download, FileText } from 'lucide-react';
import { saveBlob } from '../tool-ui';
import type { Tool } from '../catalog';

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: { id: string; role: string; company: string; period: string; bullets: string }[];
  education: { id: string; degree: string; school: string; period: string }[];
  skills: string;
}

const empty: ResumeData = {
  name: 'Jane Doe',
  title: 'Product Designer',
  email: 'jane@example.com',
  phone: '+1 555 0100',
  location: 'San Francisco, CA',
  summary: 'Product designer with 6 years crafting intuitive digital experiences across fintech and consumer apps.',
  experience: [
    { id: '1', role: 'Senior Product Designer', company: 'Acme Corp', period: '2022 — Present', bullets: 'Led redesign of the mobile app, boosting daily active users 28%.\nBuilt and maintained the design system used by 4 product teams.' },
    { id: '2', role: 'Product Designer', company: 'Startup Inc', period: '2019 — 2022', bullets: 'Shipped onboarding flow that cut churn by 15%.\nPartnered with research to validate concepts with 50+ users.' },
  ],
  education: [{ id: '1', degree: 'BFA, Interaction Design', school: 'RISD', period: '2015 — 2019' }],
  skills: 'Figma, Prototyping, Design Systems, User Research, Accessibility',
};

const uid = () => Math.random().toString(36).slice(2, 9);

export function ResumeGenie(_: { tool: Tool }) {
  const [d, setD] = useState<ResumeData>(() => {
    try { return { ...empty, ...JSON.parse(localStorage.getItem('resume-data') || '{}') }; } catch { return empty; }
  });
  const [tab, setTab] = useState<'edit' | 'preview'>('preview');
  const save = (next: ResumeData) => { setD(next); localStorage.setItem('resume-data', JSON.stringify(next)); };
  const previewRef = useRef<HTMLDivElement | null>(null);

  const addExp = () => save({ ...d, experience: [...d.experience, { id: uid(), role: '', company: '', period: '', bullets: '' }] });
  const addEdu = () => save({ ...d, education: [...d.education, { id: uid(), degree: '', school: '', period: '' }] });

  const exportHtml = () => {
    const node = previewRef.current;
    if (!node) return;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${d.name} — Resume</title>
    <style>
      @page { margin: 0.5in; }
      body { font-family: 'Inter', Arial, sans-serif; color: #0f172a; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 40px; }
      h1 { font-size: 28px; margin: 0; letter-spacing: -0.02em; }
      h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #2470f5; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; margin: 24px 0 12px; }
      .title { color: #64748b; font-size: 15px; margin-top: 2px; }
      .contact { color: #64748b; font-size: 13px; margin-top: 8px; }
      .contact span { margin-right: 12px; }
      .item { margin-bottom: 14px; }
      .item-head { display: flex; justify-content: space-between; font-weight: 600; }
      .item-sub { color: #64748b; font-size: 14px; }
      .item-period { color: #94a3b8; font-size: 13px; }
      ul { margin: 6px 0 0; padding-left: 18px; }
      li { margin-bottom: 3px; font-size: 14px; }
      .skills { font-size: 14px; }
    </style></head><body>${node.innerHTML}</body></html>`;
    saveBlob(new Blob([html], { type: 'text/html' }), `${d.name.replace(/\s+/g, '-').toLowerCase()}-resume.html`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          <button onClick={() => setTab('edit')} className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${tab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Edit</button>
          <button onClick={() => setTab('preview')} className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${tab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Preview</button>
        </div>
        <button onClick={exportHtml} className="btn-primary"><Download className="h-4 w-4" /> Export HTML</button>
      </div>

      {tab === 'edit' ? (
        <div className="space-y-6">
          <section className="space-y-3">
            <h3 className="font-display font-semibold text-slate-900">Personal info</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="input" placeholder="Full name" value={d.name} onChange={(e) => save({ ...d, name: e.target.value })} />
              <input className="input" placeholder="Professional title" value={d.title} onChange={(e) => save({ ...d, title: e.target.value })} />
              <input className="input" placeholder="Email" value={d.email} onChange={(e) => save({ ...d, email: e.target.value })} />
              <input className="input" placeholder="Phone" value={d.phone} onChange={(e) => save({ ...d, phone: e.target.value })} />
              <input className="input" placeholder="Location" value={d.location} onChange={(e) => save({ ...d, location: e.target.value })} />
            </div>
            <textarea className="input min-h-[80px]" placeholder="Short professional summary" value={d.summary} onChange={(e) => save({ ...d, summary: e.target.value })} />
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-slate-900">Experience</h3>
              <button onClick={addExp} className="btn-ghost text-sm"><Plus className="h-4 w-4" /> Add</button>
            </div>
            {d.experience.map((exp) => (
              <div key={exp.id} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 space-y-2 relative">
                <button onClick={() => save({ ...d, experience: d.experience.filter((x) => x.id !== exp.id) })} className="absolute right-3 top-3 text-slate-400 hover:text-rose-500"><X className="h-4 w-4" /></button>
                <div className="grid sm:grid-cols-3 gap-2 pr-6">
                  <input className="input" placeholder="Role" value={exp.role} onChange={(e) => save({ ...d, experience: d.experience.map((x) => x.id === exp.id ? { ...x, role: e.target.value } : x) })} />
                  <input className="input" placeholder="Company" value={exp.company} onChange={(e) => save({ ...d, experience: d.experience.map((x) => x.id === exp.id ? { ...x, company: e.target.value } : x) })} />
                  <input className="input" placeholder="Period" value={exp.period} onChange={(e) => save({ ...d, experience: d.experience.map((x) => x.id === exp.id ? { ...x, period: e.target.value } : x) })} />
                </div>
                <textarea className="input min-h-[70px]" placeholder="Achievements (one per line)" value={exp.bullets} onChange={(e) => save({ ...d, experience: d.experience.map((x) => x.id === exp.id ? { ...x, bullets: e.target.value } : x) })} />
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-slate-900">Education</h3>
              <button onClick={addEdu} className="btn-ghost text-sm"><Plus className="h-4 w-4" /> Add</button>
            </div>
            {d.education.map((edu) => (
              <div key={edu.id} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100 relative">
                <button onClick={() => save({ ...d, education: d.education.filter((x) => x.id !== edu.id) })} className="absolute right-3 top-3 text-slate-400 hover:text-rose-500"><X className="h-4 w-4" /></button>
                <div className="grid sm:grid-cols-3 gap-2 pr-6">
                  <input className="input" placeholder="Degree" value={edu.degree} onChange={(e) => save({ ...d, education: d.education.map((x) => x.id === edu.id ? { ...x, degree: e.target.value } : x) })} />
                  <input className="input" placeholder="School" value={edu.school} onChange={(e) => save({ ...d, education: d.education.map((x) => x.id === edu.id ? { ...x, school: e.target.value } : x) })} />
                  <input className="input" placeholder="Period" value={edu.period} onChange={(e) => save({ ...d, education: d.education.map((x) => x.id === edu.id ? { ...x, period: e.target.value } : x) })} />
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <h3 className="font-display font-semibold text-slate-900">Skills</h3>
            <input className="input" placeholder="Comma-separated skills" value={d.skills} onChange={(e) => save({ ...d, skills: e.target.value })} />
          </section>
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-8 ring-1 ring-slate-200 shadow-sm">
          <div ref={previewRef} className="resume-doc">
            <h1 style={{ fontSize: 28, margin: 0, letterSpacing: '-0.02em', fontWeight: 700 }}>{d.name || 'Your Name'}</h1>
            <div className="title" style={{ color: '#64748b', fontSize: 15, marginTop: 2 }}>{d.title}</div>
            <div className="contact" style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>
              {d.email && <span>{d.email}</span>}
              {d.phone && <span>{d.phone}</span>}
              {d.location && <span>{d.location}</span>}
            </div>
            {d.summary && (
              <>
                <h2 style={h2Style}>Summary</h2>
                <p style={{ fontSize: 14, color: '#334155' }}>{d.summary}</p>
              </>
            )}
            {d.experience.length > 0 && (
              <>
                <h2 style={h2Style}>Experience</h2>
                {d.experience.map((exp) => (
                  <div key={exp.id} className="item" style={{ marginBottom: 14 }}>
                    <div className="item-head" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>{exp.role}</span><span className="item-period" style={{ color: '#94a3b8', fontSize: 13 }}>{exp.period}</span>
                    </div>
                    <div className="item-sub" style={{ color: '#64748b', fontSize: 14 }}>{exp.company}</div>
                    {exp.bullets.trim() && (
                      <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                        {exp.bullets.split('\n').filter((b) => b.trim()).map((b, i) => (
                          <li key={i} style={{ marginBottom: 3, fontSize: 14 }}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            )}
            {d.education.length > 0 && (
              <>
                <h2 style={h2Style}>Education</h2>
                {d.education.map((edu) => (
                  <div key={edu.id} className="item" style={{ marginBottom: 10 }}>
                    <div className="item-head" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>{edu.degree}</span><span className="item-period" style={{ color: '#94a3b8', fontSize: 13 }}>{edu.period}</span>
                    </div>
                    <div className="item-sub" style={{ color: '#64748b', fontSize: 14 }}>{edu.school}</div>
                  </div>
                ))}
              </>
            )}
            {d.skills && (
              <>
                <h2 style={h2Style}>Skills</h2>
                <p className="skills" style={{ fontSize: 14 }}>{d.skills}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const h2Style: React.CSSProperties = { fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2470f5', borderBottom: '2px solid #e2e8f0', paddingBottom: 4, margin: '24px 0 12px', fontWeight: 600 };
