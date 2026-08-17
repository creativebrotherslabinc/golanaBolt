import { useState, useMemo, useEffect } from 'react';
import { CopyButton, ErrorBanner, ResultBox } from '../tool-ui';
import { useT, type Language } from '../i18n';
import type { Tool } from '../catalog';

const S = {
  en: {
    format: 'Format',
    minify: 'Minify',
    indent: 'Indent',
    encode: 'Encode',
    decode: 'Decode',
    invalidInput: 'Invalid input for this mode.',
    pasteHere: 'Paste your {lang} here…',
    pasteCodeHere: 'Paste your {lang} code here…',
    bytes: 'bytes',
    smaller: '{pct}% smaller',
    noChange: 'no change',
    pattern: 'Pattern',
    flags: 'Flags',
    matches: '{n} match',
    matchesPlural: '{n} matches',
    color: 'Color',
    shades: 'Shades',
    original: 'Original',
    changed: 'Changed',
    uuidV4: 'UUID v4',
    uuidV7: 'UUID v7',
    count: 'Count',
    uppercase: 'Uppercase',
    hyphens: 'Hyphens',
    generate: 'Generate',
    markdown: 'Markdown',
    preview: 'Preview',
    copyMarkdown: 'Copy markdown',
    beautify: 'Beautify',
  },
  pt: {
    format: 'Formatar',
    minify: 'Minificar',
    indent: 'Recuo',
    encode: 'Codificar',
    decode: 'Decodificar',
    invalidInput: 'Entrada inválida para este modo.',
    pasteHere: 'Cole seu {lang} aqui…',
    pasteCodeHere: 'Cole seu código {lang} aqui…',
    bytes: 'bytes',
    smaller: '{pct}% menor',
    noChange: 'sem alteração',
    pattern: 'Padrão',
    flags: 'Flags',
    matches: '{n} correspondência',
    matchesPlural: '{n} correspondências',
    color: 'Cor',
    shades: 'Tons',
    original: 'Original',
    changed: 'Alterado',
    uuidV4: 'UUID v4',
    uuidV7: 'UUID v7',
    count: 'Quantidade',
    uppercase: 'Maiúsculas',
    hyphens: 'Hífens',
    generate: 'Gerar',
    markdown: 'Markdown',
    preview: 'Pré-visualização',
    copyMarkdown: 'Copiar markdown',
    beautify: 'Embelezar',
  },
  es: {
    format: 'Formatear',
    minify: 'Minificar',
    indent: 'Sangría',
    encode: 'Codificar',
    decode: 'Decodificar',
    invalidInput: 'Entrada inválida para este modo.',
    pasteHere: 'Pega tu {lang} aquí…',
    pasteCodeHere: 'Pega tu código {lang} aquí…',
    bytes: 'bytes',
    smaller: '{pct}% más pequeño',
    noChange: 'sin cambios',
    pattern: 'Patrón',
    flags: 'Banderas',
    matches: '{n} coincidencia',
    matchesPlural: '{n} coincidencias',
    color: 'Color',
    shades: 'Tonos',
    original: 'Original',
    changed: 'Cambiado',
    uuidV4: 'UUID v4',
    uuidV7: 'UUID v7',
    count: 'Cantidad',
    uppercase: 'Mayúsculas',
    hyphens: 'Guiones',
    generate: 'Generar',
    markdown: 'Markdown',
    preview: 'Vista previa',
    copyMarkdown: 'Copiar markdown',
    beautify: 'Embellecer',
  },
  de: {
    format: 'Formatieren',
    minify: 'Minifizieren',
    indent: 'Einrückung',
    encode: 'Kodieren',
    decode: 'Dekodieren',
    invalidInput: 'Ungültige Eingabe für diesen Modus.',
    pasteHere: 'Fügen Sie Ihr {lang} hier ein…',
    pasteCodeHere: 'Fügen Sie Ihren {lang}-Code hier ein…',
    bytes: 'Bytes',
    smaller: '{pct}% kleiner',
    noChange: 'keine Änderung',
    pattern: 'Muster',
    flags: 'Flags',
    matches: '{n} Treffer',
    matchesPlural: '{n} Treffer',
    color: 'Farbe',
    shades: 'Farbtöne',
    original: 'Original',
    changed: 'Geändert',
    uuidV4: 'UUID v4',
    uuidV7: 'UUID v7',
    count: 'Anzahl',
    uppercase: 'Großbuchstaben',
    hyphens: 'Bindestriche',
    generate: 'Generieren',
    markdown: 'Markdown',
    preview: 'Vorschau',
    copyMarkdown: 'Markdown kopieren',
    beautify: 'Verschönern',
  },
} satisfies Record<Language, Record<string, string>>;

export function JsonFormatter(_: { tool: Tool }) {
  const t = useT(S);
  const [text, setText] = useState('{"name":"Go LANA","tools":40,"free":true}');
  const [indent, setIndent] = useState(2);
  const [err, setErr] = useState('');
  const [out, setOut] = useState('');
  const format = (minify: boolean) => {
    setErr('');
    try {
      const obj = JSON.parse(text);
      setOut(JSON.stringify(obj, null, minify ? 0 : indent));
    } catch (e) {
      setErr((e as Error).message);
      setOut('');
    }
  };
  return (
    <div className="space-y-4">
      <textarea className="input min-h-[140px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => format(false)} className="btn-primary">{t.format}</button>
        <button onClick={() => format(true)} className="btn-secondary">{t.minify}</button>
        <div className="flex items-center gap-1 ml-2">
          <span className="text-xs text-slate-500">{t.indent}</span>
          {[2, 4].map((n) => (
            <button key={n} onClick={() => setIndent(n)} className={`rounded-lg px-2 py-1 text-xs font-medium ${indent === n ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{n}</button>
          ))}
        </div>
      </div>
      {err && <ErrorBanner message={err} />}
      {out && (
        <>
          <ResultBox><pre className="overflow-x-auto text-sm font-mono text-slate-800">{out}</pre></ResultBox>
          <div className="flex justify-end"><CopyButton text={out} /></div>
        </>
      )}
    </div>
  );
}

export function Base64Tool(_: { tool: Tool }) {
  const t = useT(S);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [text, setText] = useState('Hello, Go LANA!');
  const [err, setErr] = useState('');
  const out = useMemo(() => {
    setErr('');
    try {
      if (mode === 'encode') return btoa(unescape(encodeURIComponent(text)));
      return decodeURIComponent(escape(atob(text)));
    } catch {
      setErr(t.invalidInput);
      return '';
    }
  }, [text, mode, t.invalidInput]);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={mode === 'encode' ? 'btn-primary' : 'btn-secondary'}>{t.encode}</button>
        <button onClick={() => setMode('decode')} className={mode === 'decode' ? 'btn-primary' : 'btn-secondary'}>{t.decode}</button>
      </div>
      <textarea className="input min-h-[120px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      {err && <ErrorBanner message={err} />}
      {out && (
        <>
          <ResultBox><pre className="overflow-x-auto text-sm font-mono text-slate-800 break-all whitespace-pre-wrap">{out}</pre></ResultBox>
          <div className="flex justify-end"><CopyButton text={out} /></div>
        </>
      )}
    </div>
  );
}

export function CodeMinifier(_: { tool: Tool }) {
  const t = useT(S);
  const [lang, setLang] = useState<'js' | 'css' | 'html'>('js');
  const [text, setText] = useState('');
  const out = useMemo(() => {
    if (!text.trim()) return '';
    if (lang === 'css') return minifyCss(text);
    if (lang === 'html') return text.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
    return minifyJs(text);
  }, [text, lang]);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['js','css','html'] as const).map((l) => (
          <button key={l} onClick={() => setLang(l)} className={lang === l ? 'btn-primary' : 'btn-secondary'}>{l.toUpperCase()}</button>
        ))}
      </div>
      <textarea className="input min-h-[140px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder={t.pasteHere.replace('{lang}', lang.toUpperCase())} />
      {out && (
        <>
          <ResultBox>
            <pre className="overflow-x-auto text-xs font-mono text-slate-800 break-all whitespace-pre-wrap">{out}</pre>
            <p className="mt-2 text-xs text-slate-400">{text.length} → {out.length} {t.bytes} ({text.length > out.length ? t.smaller.replace('{pct}', String(Math.round((1 - out.length / text.length) * 100))) : t.noChange})</p>
          </ResultBox>
          <div className="flex justify-end"><CopyButton text={out} /></div>
        </>
      )}
    </div>
  );
}

function minifyCss(s: string): string {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').replace(/;}/g, '}').trim();
}
function minifyJs(s: string): string {
  return s
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([=+\-*/<>!&|{}()[\];,:])\s*/g, '$1')
    .trim();
}

export function RegexTester(_: { tool: Tool }) {
  const t = useT(S);
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Contact us at hello@golana.online or support@golana.online.');
  const [err, setErr] = useState('');
  const result = useMemo(() => {
    setErr('');
    try {
      const re = new RegExp(pattern, flags);
      const matches = [...text.matchAll(re)];
      return { matches, highlighted: highlight(text, re, flags.includes('g')) };
    } catch (e) {
      setErr((e as Error).message);
      return null;
    }
  }, [pattern, flags, text]);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="label">{t.pattern}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">/</span>
            <input className="input pl-6 font-mono" value={pattern} onChange={(e) => setPattern(e.target.value)} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">/{flags}</span>
          </div>
        </div>
        <div className="w-24">
          <label className="label">{t.flags}</label>
          <input className="input font-mono" value={flags} onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))} />
        </div>
      </div>
      <textarea className="input min-h-[120px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      {err && <ErrorBanner message={err} />}
      {result && (
        <ResultBox>
          <p className="mb-2 text-sm text-slate-700">{(result.matches.length !== 1 ? t.matchesPlural : t.matches).replace('{n}', String(result.matches.length))}</p>
          <p className="whitespace-pre-wrap break-words text-sm" dangerouslySetInnerHTML={{ __html: result.highlighted }} />
        </ResultBox>
      )}
    </div>
  );
}

function highlight(text: string, re: RegExp, global: boolean): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  if (!global) {
    const m = text.match(re);
    if (!m) return esc(text);
    const idx = text.indexOf(m[0]);
    return esc(text.slice(0, idx)) + `<mark class="rounded bg-amber-200 px-0.5">${esc(m[0])}</mark>` + esc(text.slice(idx + m[0].length));
  }
  return esc(text.replace(re, (m) => `⟦${m}⟧`)).replace(/⟦([^⟦]*)⟧/g, '<mark class="rounded bg-amber-200 px-0.5">$1</mark>');
}

export function ColorPicker(_: { tool: Tool }) {
  const t = useT(S);
  const [color, setColor] = useState('#2470f5');
  const hex = color.toUpperCase();
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const shades = useMemo(() => Array.from({ length: 9 }, (_, i) => adjust(hex, (i - 4) * 12)), [hex]);
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">{t.color}</label>
          <input type="color" value={hex} onChange={(e) => setColor(e.target.value)} className="h-32 w-full rounded-xl ring-1 ring-slate-200" />
        </div>
        <div className="space-y-2">
          {[['HEX', hex], ['RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`], ['HSL', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`]].map(([l, v]) => (
            <div key={l} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100">
              <span className="w-10 text-xs font-medium text-slate-500">{l}</span>
              <span className="flex-1 font-mono text-sm text-slate-800">{v}</span>
              <CopyButton text={v as string} label="" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="label">{t.shades}</p>
        <div className="grid grid-cols-9 gap-1.5">
          {shades.map((s, i) => (
            <button key={i} onClick={() => setColor(s)} className="aspect-square rounded-lg ring-1 ring-slate-200 hover:scale-110 transition" style={{ backgroundColor: s }} title={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function adjust(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const nl = Math.max(0, Math.min(100, l + amount));
  return hslToHex(h, s, nl);
}
function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  return '#' + [f(0), f(8), f(4)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function DiffChecker(_: { tool: Tool }) {
  const t = useT(S);
  const [a, setA] = useState('The quick brown fox\njumps over\nthe lazy dog');
  const [b, setB] = useState('The quick brown fox\nleaps over\nthe lazy cat');
  const diff = useMemo(() => computeDiff(a.split('\n'), b.split('\n')), [a, b]);
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">{t.original}</label>
          <textarea className="input min-h-[160px] font-mono text-sm" value={a} onChange={(e) => setA(e.target.value)} />
        </div>
        <div>
          <label className="label">{t.changed}</label>
          <textarea className="input min-h-[160px] font-mono text-sm" value={b} onChange={(e) => setB(e.target.value)} />
        </div>
      </div>
      <ResultBox>
        <div className="space-y-0.5 font-mono text-sm">
          {diff.map((row, i) => (
            <div key={i} className={`flex items-start gap-2 rounded px-2 py-0.5 ${row.type === 'add' ? 'bg-accent-50 text-accent-800' : row.type === 'del' ? 'bg-rose-50 text-rose-700' : 'text-slate-600'}`}>
              <span className="select-none text-slate-400">{row.type === 'add' ? '+' : row.type === 'del' ? '-' : ' '}</span>
              <span className="whitespace-pre-wrap break-all">{row.text}</span>
            </div>
          ))}
        </div>
      </ResultBox>
    </div>
  );
}

function computeDiff(a: string[], b: string[]): { type: 'same' | 'add' | 'del'; text: string }[] {
  // LCS-based diff
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: { type: 'same' | 'add' | 'del'; text: string }[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push({ type: 'same', text: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ type: 'del', text: a[i] }); i++; }
    else { out.push({ type: 'add', text: b[j] }); j++; }
  }
  while (i < n) out.push({ type: 'del', text: a[i++] });
  while (j < m) out.push({ type: 'add', text: b[j++] });
  return out;
}

// ============ UUID Generator ============
export function UuidGenerator(_: { tool: Tool }) {
  const t = useT(S);
  const [version, setVersion] = useState<'v4' | 'v7'>('v4');
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);

  const genV4 = (): string => {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
    return `${hex.slice(0, 4).join('')}${hex.slice(4, 8).join('')}-${hex.slice(8, 12).join('')}-${hex.slice(12, 16).join('')}-${hex.slice(16, 20).join('')}-${hex.slice(20, 32).join('')}`;
  };

  const genV7 = (): string => {
    const timestamp = Date.now();
    const tsHex = timestamp.toString(16).padStart(12, '0');
    const randBytes = new Uint8Array(10);
    crypto.getRandomValues(randBytes);
    randBytes[0] = (randBytes[0] & 0x0f) | 0x70;
    randBytes[2] = (randBytes[2] & 0x3f) | 0x80;
    const randHex = Array.from(randBytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${tsHex.slice(0, 8)}-${tsHex.slice(8, 12)}-${randHex.slice(0, 4)}-${randHex.slice(4, 8)}-${randHex.slice(8, 20)}`;
  };

  const gen = () => {
    const out: string[] = [];
    for (let i = 0; i < count; i++) {
      let uuid = version === 'v4' ? genV4() : genV7();
      if (!hyphens) uuid = uuid.replace(/-/g, '');
      if (uppercase) uuid = uuid.toUpperCase();
      out.push(uuid);
    }
    setUuids(out);
  };

  useEffect(() => { gen(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          <button onClick={() => setVersion('v4')} className={version === 'v4' ? 'btn-primary' : 'btn-secondary'}>{t.uuidV4}</button>
          <button onClick={() => setVersion('v7')} className={version === 'v7' ? 'btn-primary' : 'btn-secondary'}>{t.uuidV7}</button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">{t.count}</label>
          <input type="number" min={1} max={100} className="input max-w-[80px] text-center" value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, +e.target.value || 1)))} />
        </div>
        <label className="flex items-center gap-1.5 text-sm text-slate-600">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="accent-brand-600 h-4 w-4" />
          {t.uppercase}
        </label>
        <label className="flex items-center gap-1.5 text-sm text-slate-600">
          <input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} className="accent-brand-600 h-4 w-4" />
          {t.hyphens}
        </label>
      </div>
      <button onClick={gen} className="btn-primary">{t.generate}</button>
      {uuids.length > 0 && (
        <ul className="space-y-1.5">
          {uuids.map((u, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 ring-1 ring-slate-100">
              <span className="font-mono text-sm text-slate-800 break-all">{u}</span>
              <CopyButton text={u} label="" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============ Markdown Editor ============
export function MarkdownEditor(_: { tool: Tool }) {
  const t = useT(S);
  const [text, setText] = useState('# Hello World\n\nThis is a **markdown** editor.\n\n- Item 1\n- Item 2\n\n[Go LANA](https://golana.online)');

  const render = (md: string): string => {
    let html = md;
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/^### (.*)$/gm, '<h3 class="text-lg font-bold text-slate-900 mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*)$/gm, '<h2 class="text-xl font-bold text-slate-900 mt-4 mb-2">$1</h2>');
    html = html.replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold text-slate-900 mt-4 mb-2">$1</h1>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.+?)`/g, '<code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-rose-600">$1</code>');
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-brand-600 underline" target="_blank" rel="noreferrer">$1</a>');
    html = html.replace(/^- (.*)$/gm, '<li class="ml-5 list-disc">$1</li>');
    html = html.replace(/^\d+\. (.*)$/gm, '<li class="ml-5 list-decimal">$1</li>');
    html = html.replace(/^(?!<[hlu])(.+)$/gm, '<p class="text-slate-700 my-2">$1</p>');
    html = html.replace(/&gt; (.*)$/gm, '<blockquote class="border-l-4 border-slate-200 pl-4 text-slate-500 italic">$1</blockquote>');
    html = html.replace(/---/g, '<hr class="border-slate-200 my-4" />');
    return html;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div>
        <label className="label">{t.markdown}</label>
        <textarea className="input min-h-[300px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div>
        <label className="label">{t.preview}</label>
        <div className="min-h-[300px] rounded-xl bg-white p-4 ring-1 ring-slate-100 overflow-auto" dangerouslySetInnerHTML={{ __html: render(text) }} />
      </div>
      <div className="lg:col-span-2 flex justify-end">
        <CopyButton text={text} label={t.copyMarkdown} />
      </div>
    </div>
  );
}

// ============ Code Beautifier ============
export function CodeBeautifier(_: { tool: Tool }) {
  const t = useT(S);
  const [lang, setLang] = useState<'js' | 'css' | 'html' | 'json'>('js');
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const [out, setOut] = useState('');

  const beautify = () => {
    setErr('');
    if (!text.trim()) { setOut(''); return; }
    try {
      if (lang === 'json') {
        setOut(JSON.stringify(JSON.parse(text), null, 2));
      } else if (lang === 'css') {
        setOut(beautifyCss(text));
      } else if (lang === 'html') {
        setOut(beautifyHtml(text));
      } else {
        setOut(beautifyJs(text));
      }
    } catch (e) {
      setErr((e as Error).message);
      setOut('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['js', 'css', 'html', 'json'] as const).map((l) => (
          <button key={l} onClick={() => { setLang(l); setOut(''); setErr(''); }} className={lang === l ? 'btn-primary' : 'btn-secondary'}>{l.toUpperCase()}</button>
        ))}
      </div>
      <textarea className="input min-h-[140px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder={t.pasteCodeHere.replace('{lang}', lang.toUpperCase())} />
      <button onClick={beautify} disabled={!text.trim()} className="btn-primary">{t.beautify}</button>
      {err && <ErrorBanner message={err} />}
      {out && (
        <>
          <ResultBox>
            <pre className="overflow-x-auto text-sm font-mono text-slate-800 whitespace-pre-wrap">{out}</pre>
          </ResultBox>
          <div className="flex justify-end"><CopyButton text={out} /></div>
        </>
      )}
    </div>
  );
}

function beautifyJs(s: string): string {
  let out = s;
  out = out.replace(/\/\/[^\n]*/g, '');
  out = out.replace(/\/\*[\s\S]*?\*\//g, '');
  out = out.replace(/\s+/g, ' ').trim();
  let indent = 0;
  const pad = () => '  '.repeat(indent);
  out = out.replace(/([{}();])/g, '$1\n').replace(/\n\s+/g, '\n');
  const lines = out.split('\n').map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('}')) indent = Math.max(0, indent - 1);
    const result = pad() + trimmed;
    if (trimmed.endsWith('{')) indent++;
    return result;
  });
  return lines.join('\n');
}

function beautifyCss(s: string): string {
  let out = s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
  out = out.replace(/\s*([{}:;,])\s*/g, '$1');
  out = out.replace(/;}/g, '}');
  out = out.replace(/{/g, ' {\n  ').replace(/}/g, '\n}\n').replace(/;/g, ';\n  ');
  out = out.replace(/\n\s*\n/g, '\n').replace(/  \n/g, '').trim();
  return out;
}

function beautifyHtml(s: string): string {
  const tokens = s.replace(/>\s+</g, '><').trim().split(/(?=<)/);
  let indent = 0;
  const voids = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  return tokens.map((token) => {
    const tag = token.match(/^<\/?(\w+)/)?.[1]?.toLowerCase() || '';
    const isClosing = token.startsWith('</');
    const isVoid = voids.has(tag);
    if (isClosing) indent = Math.max(0, indent - 1);
    const line = '  '.repeat(indent) + token.trim();
    if (!isClosing && !isVoid && token.startsWith('<') && !token.startsWith('</') && !token.endsWith('/>')) indent++;
    return line;
  }).join('\n');
}
