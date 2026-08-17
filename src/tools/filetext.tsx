import { useState, useMemo, useRef } from 'react';
import { CopyButton, ResultBox, FileDrop, saveBlob } from '../tool-ui';
import { Download } from 'lucide-react';
import type { Tool } from '../catalog';

// ============ Text Cleaner ============
export function TextCleaner(_: { tool: Tool }) {
  const [text, setText] = useState('  Hello   world  \n\n  Hello   world  \n  test  \n  test  ');
  const [trimLines, setTrimLines] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false);
  const [removeDupLines, setRemoveDupLines] = useState(false);
  const [removeDupWords, setRemoveDupWords] = useState(false);
  const [toLower, setToLower] = useState(false);
  const [toUpper, setToUpper] = useState(false);

  const result = useMemo(() => {
    let lines = text.split('\n');
    if (trimLines) lines = lines.map((l) => l.trim());
    if (collapseSpaces) lines = lines.map((l) => l.replace(/\s+/g, ' '));
    if (removeEmptyLines) lines = lines.filter((l) => l.length > 0);
    if (removeDupLines) lines = [...new Set(lines)];
    if (removeDupWords) lines = lines.map((l) => [...new Set(l.split(' ').filter(Boolean))].join(' '));
    if (toLower) lines = lines.map((l) => l.toLowerCase());
    if (toUpper) lines = lines.map((l) => l.toUpperCase());
    return lines.join('\n');
  }, [text, trimLines, collapseSpaces, removeEmptyLines, removeDupLines, removeDupWords, toLower, toUpper]);

  const opts: { key: string; label: string; get: boolean; set: (v: boolean) => void }[] = [
    { key: 'trim', label: 'Trim each line', get: trimLines, set: setTrimLines },
    { key: 'collapse', label: 'Collapse multiple spaces', get: collapseSpaces, set: setCollapseSpaces },
    { key: 'empty', label: 'Remove empty lines', get: removeEmptyLines, set: setRemoveEmptyLines },
    { key: 'dupLines', label: 'Remove duplicate lines', get: removeDupLines, set: setRemoveDupLines },
    { key: 'dupWords', label: 'Remove duplicate words (per line)', get: removeDupWords, set: setRemoveDupWords },
    { key: 'lower', label: 'Convert to lowercase', get: toLower, set: setToLower },
    { key: 'upper', label: 'Convert to uppercase', get: toUpper, set: setToUpper },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Input text</label>
        <textarea className="input min-h-[120px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {opts.map((o) => (
          <label key={o.key} className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={o.get} onChange={(e) => o.set(e.target.checked)} className="h-4 w-4 accent-brand-600" /> {o.label}
          </label>
        ))}
      </div>
      <ResultBox>
        <pre className="text-sm font-mono text-slate-800 whitespace-pre-wrap break-words">{result}</pre>
      </ResultBox>
      <div className="flex justify-end gap-2">
        <CopyButton text={result} />
      </div>
    </div>
  );
}

// ============ CSV Viewer ============
export function CSVViewer(_: { tool: Tool }) {
  const [csv, setCsv] = useState('Name,Age,City\nAlice,30,New York\nBob,25,London\nCharlie,35,Tokyo');
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const { headers, rows } = useMemo(() => {
    const lines = csv.trim().split('\n').filter(Boolean);
    if (lines.length === 0) return { headers: [] as string[], rows: [] as string[][] };
    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1).map((l) => l.split(',').map((c) => c.trim()));
    if (sortCol !== null && sortCol < headers.length) {
      rows.sort((a, b) => {
        const av = a[sortCol] || '';
        const bv = b[sortCol] || '';
        const an = parseFloat(av);
        const bn = parseFloat(bv);
        if (!isNaN(an) && !isNaN(bn)) return sortAsc ? an - bn : bn - an;
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return { headers, rows };
  }, [csv, sortCol, sortAsc]);

  const handleFile = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCsv(String(reader.result || ''));
    reader.readAsText(file);
  };

  const downloadCSV = () => {
    saveBlob(new Blob([csv], { type: 'text/csv' }), 'data.csv');
  };

  return (
    <div className="space-y-4">
      <FileDrop accept=".csv,.txt" onFiles={handleFile} label="Upload a CSV file" hint="Or paste CSV below" />
      <div>
        <label className="label">CSV content</label>
        <textarea className="input min-h-[100px] font-mono text-sm" value={csv} onChange={(e) => setCsv(e.target.value)} />
      </div>
      {headers.length > 0 && (
        <div className="overflow-x-auto rounded-xl ring-1 ring-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    onClick={() => { if (sortCol === i) setSortAsc(!sortAsc); else { setSortCol(i); setSortAsc(true); } }}
                    className="px-3 py-2 text-left font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 select-none"
                  >
                    {h} {sortCol === i && (sortAsc ? '↑' : '↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  {headers.map((_, j) => (
                    <td key={j} className="px-3 py-2 text-slate-600">{row[j] || ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{rows.length} rows · {headers.length} columns</span>
        <button onClick={downloadCSV} className="btn-secondary text-sm"><Download className="h-4 w-4" /> Download CSV</button>
      </div>
    </div>
  );
}

// ============ HTML Escape/Unescape ============
export function HTMLEscapeUnescape(_: { tool: Tool }) {
  const [text, setText] = useState('<div class="hero">Hello & welcome</div>');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  const result = useMemo(() => {
    if (mode === 'escape') {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    const el = document.createElement('textarea');
    el.innerHTML = text;
    return el.value;
  }, [text, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('escape')} className={mode === 'escape' ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>Escape</button>
        <button onClick={() => setMode('unescape')} className={mode === 'unescape' ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>Unescape</button>
      </div>
      <div>
        <label className="label">Input</label>
        <textarea className="input min-h-[100px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <ResultBox>
        <pre className="text-sm font-mono text-slate-800 whitespace-pre-wrap break-words">{result}</pre>
      </ResultBox>
      <div className="flex justify-end">
        <CopyButton text={result} />
      </div>
    </div>
  );
}

// ============ URL Encoder/Decoder ============
export function URLEncoderDecoder(_: { tool: Tool }) {
  const [text, setText] = useState('https://example.com/search?q=hello world&lang=en');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const result = useMemo(() => {
    try {
      return mode === 'encode' ? encodeURIComponent(text) : decodeURIComponent(text);
    } catch {
      return 'Error: invalid encoded string';
    }
  }, [text, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={mode === 'encode' ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>Encode</button>
        <button onClick={() => setMode('decode')} className={mode === 'decode' ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>Decode</button>
      </div>
      <div>
        <label className="label">Input</label>
        <textarea className="input min-h-[100px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <ResultBox>
        <pre className="text-sm font-mono text-slate-800 whitespace-pre-wrap break-words">{result}</pre>
      </ResultBox>
      <div className="flex justify-end">
        <CopyButton text={result} />
      </div>
    </div>
  );
}

// ============ Slug Generator ============
export function SlugGenerator(_: { tool: Tool }) {
  const [text, setText] = useState('Hello World! This is a Test Title');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [lower, setLower] = useState(true);

  const result = useMemo(() => {
    let slug = text
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, separator);
    if (lower) slug = slug.toLowerCase();
    return slug;
  }, [text, separator, lower]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Title / Text</label>
        <input className="input" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="label">Separator</label>
          <div className="flex gap-2">
            <button onClick={() => setSeparator('-')} className={separator === '-' ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>Dash (-)</button>
            <button onClick={() => setSeparator('_')} className={separator === '_' ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>Underscore (_)</button>
          </div>
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm text-slate-600">
          <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} className="h-4 w-4 accent-brand-600" /> Lowercase
        </label>
      </div>
      <ResultBox>
        <p className="text-sm font-mono text-slate-800 break-all">{result}</p>
      </ResultBox>
      <div className="flex justify-end">
        <CopyButton text={result} />
      </div>
    </div>
  );
}

// ============ Text Sorter ============
export function TextSorter(_: { tool: Tool }) {
  const [text, setText] = useState('banana\napple\ncherry\ndate\nelderberry');
  const [sortMode, setSortMode] = useState<'asc' | 'desc' | 'len' | 'lenDesc' | 'random'>('asc');
  const [caseInsensitive, setCaseInsensitive] = useState(true);

  const result = useMemo(() => {
    let lines = text.split('\n');
    if (caseInsensitive) lines = lines.map((l) => l.trim()).filter(Boolean);
    else lines = lines.filter(Boolean);

    switch (sortMode) {
      case 'asc':
        lines.sort((a, b) => caseInsensitive ? a.toLowerCase().localeCompare(b.toLowerCase()) : a.localeCompare(b));
        break;
      case 'desc':
        lines.sort((a, b) => caseInsensitive ? b.toLowerCase().localeCompare(a.toLowerCase()) : b.localeCompare(a));
        break;
      case 'len':
        lines.sort((a, b) => a.length - b.length);
        break;
      case 'lenDesc':
        lines.sort((a, b) => b.length - a.length);
        break;
      case 'random':
        lines = [...lines].sort(() => Math.random() - 0.5);
        break;
    }
    return lines.join('\n');
  }, [text, sortMode, caseInsensitive]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Input (one item per line)</label>
        <textarea className="input min-h-[120px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Sort method</label>
          <select className="input" value={sortMode} onChange={(e) => setSortMode(e.target.value as 'asc' | 'desc' | 'len' | 'lenDesc' | 'random')}>
            <option value="asc">Alphabetical A → Z</option>
            <option value="desc">Alphabetical Z → A</option>
            <option value="len">By length (shortest first)</option>
            <option value="lenDesc">By length (longest first)</option>
            <option value="random">Random shuffle</option>
          </select>
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm text-slate-600">
          <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} className="h-4 w-4 accent-brand-600" /> Case-insensitive
        </label>
      </div>
      <ResultBox>
        <pre className="text-sm font-mono text-slate-800 whitespace-pre-wrap break-words">{result}</pre>
      </ResultBox>
      <div className="flex justify-end">
        <CopyButton text={result} />
      </div>
    </div>
  );
}

// ============ Duplicate Line Remover ============
export function DuplicateLineRemover(_: { tool: Tool }) {
  const [text, setText] = useState('apple\nbanana\napple\ncherry\nbanana\ndate');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [keepEmpty, setKeepEmpty] = useState(false);

  const { result, removed } = useMemo(() => {
    const lines = text.split('\n');
    const seen = new Set<string>();
    const out: string[] = [];
    let dupes = 0;

    for (const line of lines) {
      let processed = line;
      if (trimLines) processed = processed.trim();
      if (!keepEmpty && processed === '') continue;
      const key = caseSensitive ? processed : processed.toLowerCase();
      if (seen.has(key)) { dupes++; continue; }
      seen.add(key);
      out.push(processed);
    }
    return { result: out.join('\n'), removed: dupes };
  }, [text, caseSensitive, trimLines, keepEmpty]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Input text</label>
        <textarea className="input min-h-[120px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="h-4 w-4 accent-brand-600" /> Case-sensitive
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} className="h-4 w-4 accent-brand-600" /> Trim lines
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={keepEmpty} onChange={(e) => setKeepEmpty(e.target.checked)} className="h-4 w-4 accent-brand-600" /> Keep empty lines
        </label>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{removed} duplicate line{removed !== 1 ? 's' : ''} removed</span>
        <CopyButton text={result} />
      </div>
      <ResultBox>
        <pre className="text-sm font-mono text-slate-800 whitespace-pre-wrap break-words">{result}</pre>
      </ResultBox>
    </div>
  );
}
