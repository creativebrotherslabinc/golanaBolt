import { useState, useMemo, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { CopyButton, ResultBox, Stat } from '../tool-ui';
import type { Tool } from '../catalog';
import { useT, type Language } from '../i18n';

const S = {
  en: {
    textOrUrl: 'Text or URL',
    size: 'Size',
    fg: 'FG',
    bg: 'BG',
    downloadPng: 'Download PNG',
    enterTextQr: 'Enter text to generate a QR code.',
    length: 'Length: {length}',
    uppercase: 'Uppercase',
    lowercase: 'Lowercase',
    numbers: 'Numbers',
    symbols: 'Symbols',
    regenerate: 'Regenerate',
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
    veryStrong: 'Very strong',
    length_: 'Length',
    value: 'Value',
    from: 'From',
    to: 'To',
    dateOfBirth: 'Date of birth',
    ageAtDate: 'Age at date',
    years: 'Years',
    months: 'Months',
    days: 'Days',
    weeks: 'Weeks',
    firstDate: 'First date',
    secondDate: 'Second date',
    metric: 'Metric',
    imperial: 'Imperial',
    height: 'Height',
    weight: 'Weight',
    underweight: 'Underweight',
    normal: 'Normal',
    overweight: 'Overweight',
    obese: 'Obese',
    min: 'Min',
    max: 'Max',
    howMany: 'How many',
    uniqueValuesOnly: 'Unique values only',
    generate: 'Generate',
    startTyping: 'Start typing or paste your text…',
    words: 'Words',
    characters: 'Characters',
    noSpaces: 'No spaces',
    sentences: 'Sentences',
    paragraphs: 'Paragraphs',
    readTime: 'Read time',
    focus25: 'Focus 25',
    short5: 'Short 5',
    long15: 'Long 15',
    focus: 'Focus',
    break_: 'Break',
    pause: 'Pause',
    start: 'Start',
    reset: 'Reset',
    completedCycles: 'Completed cycles:',
    amount: 'Amount',
    unit: 'Unit',
    ingredient: 'Ingredient',
    grams: 'Grams',
    milliliters: 'Milliliters',
    encrypt: 'Encrypt',
    decrypt: 'Decrypt',
    textToEncrypt: 'Text to encrypt',
    encryptedTextToDecrypt: 'Encrypted text to decrypt',
    secretKey: 'Secret key',
    result: 'Result',
    invalidInputDecryption: 'Invalid input for decryption.',
    enterIpPlaceholder: 'Enter an IP address (or leave blank for your own)',
    lookingUp: 'Looking up…',
    lookup: 'Lookup',
    couldNotLookupIp: 'Could not look up this IP. The service may be unavailable.',
    ipAddress: 'IP Address',
    city: 'City',
    region: 'Region',
    country: 'Country',
    countryCode: 'Country Code',
    postalCode: 'Postal Code',
    latitude: 'Latitude',
    longitude: 'Longitude',
    timezone: 'Timezone',
    ispOrg: 'ISP / Org',
    pasteLongUrl: 'Paste a long URL',
    shortening: 'Shortening…',
    shorten: 'Shorten',
    couldNotShortenUrl: 'Could not shorten this URL. The service may be unavailable.',
    shortUrl: 'Short URL',
    totalVisits: 'Total Visits',
    allTimePageViews: 'All-time page views',
    today: 'Today',
    visitsSinceMidnight: 'Visits since midnight',
    yourVisits: 'Your Visits',
    timesYouOpened: "Times you've opened this",
    counterStorageDesc: "This counter is stored in your browser's local storage. Each time you (or anyone on this device) opens this tool, the numbers increase. It's a simple client-side demo — no server or database involved.",
    resetCounter: 'Reset counter',
    currentSession: 'Current session',
    resume: 'Resume',
    saveReset: 'Save & reset',
    savedSessions: 'Saved sessions',
    clear: 'Clear',
  },
  pt: {
    textOrUrl: 'Texto ou URL',
    size: 'Tamanho',
    fg: 'Frente',
    bg: 'Fundo',
    downloadPng: 'Baixar PNG',
    enterTextQr: 'Digite um texto para gerar um QR code.',
    length: 'Comprimento: {length}',
    uppercase: 'Maiúsculas',
    lowercase: 'Minúsculas',
    numbers: 'Números',
    symbols: 'Símbolos',
    regenerate: 'Regenerar',
    weak: 'Fraca',
    fair: 'Razoável',
    good: 'Boa',
    strong: 'Forte',
    veryStrong: 'Muito forte',
    length_: 'Comprimento',
    value: 'Valor',
    from: 'De',
    to: 'Para',
    dateOfBirth: 'Data de nascimento',
    ageAtDate: 'Idade na data',
    years: 'Anos',
    months: 'Meses',
    days: 'Dias',
    weeks: 'Semanas',
    firstDate: 'Primeira data',
    secondDate: 'Segunda data',
    metric: 'Métrico',
    imperial: 'Imperial',
    height: 'Altura',
    weight: 'Peso',
    underweight: 'Abaixo do peso',
    normal: 'Normal',
    overweight: 'Acima do peso',
    obese: 'Obeso',
    min: 'Mín',
    max: 'Máx',
    howMany: 'Quantos',
    uniqueValuesOnly: 'Apenas valores únicos',
    generate: 'Gerar',
    startTyping: 'Comece a digitar ou cole seu texto…',
    words: 'Palavras',
    characters: 'Caracteres',
    noSpaces: 'Sem espaços',
    sentences: 'Frases',
    paragraphs: 'Parágrafos',
    readTime: 'Tempo de leitura',
    focus25: 'Foco 25',
    short5: 'Pausa 5',
    long15: 'Pausa 15',
    focus: 'Foco',
    break_: 'Pausa',
    pause: 'Pausar',
    start: 'Iniciar',
    reset: 'Reiniciar',
    completedCycles: 'Ciclos concluídos:',
    amount: 'Quantidade',
    unit: 'Unidade',
    ingredient: 'Ingrediente',
    grams: 'Gramas',
    milliliters: 'Mililitros',
    encrypt: 'Criptografar',
    decrypt: 'Descriptografar',
    textToEncrypt: 'Texto para criptografar',
    encryptedTextToDecrypt: 'Texto criptografado para descriptografar',
    secretKey: 'Chave secreta',
    result: 'Resultado',
    invalidInputDecryption: 'Entrada inválida para descriptografia.',
    enterIpPlaceholder: 'Digite um endereço IP (ou deixe em branco para o seu)',
    lookingUp: 'Buscando…',
    lookup: 'Buscar',
    couldNotLookupIp: 'Não foi possível buscar este IP. O serviço pode estar indisponível.',
    ipAddress: 'Endereço IP',
    city: 'Cidade',
    region: 'Região',
    country: 'País',
    countryCode: 'Código do país',
    postalCode: 'Código postal',
    latitude: 'Latitude',
    longitude: 'Longitude',
    timezone: 'Fuso horário',
    ispOrg: 'ISP / Org',
    pasteLongUrl: 'Cole uma URL longa',
    shortening: 'Encurtando…',
    shorten: 'Encurtar',
    couldNotShortenUrl: 'Não foi possível encurtar esta URL. O serviço pode estar indisponível.',
    shortUrl: 'URL curta',
    totalVisits: 'Visitas totais',
    allTimePageViews: 'Visualizações de todos os tempos',
    today: 'Hoje',
    visitsSinceMidnight: 'Visitas desde a meia-noite',
    yourVisits: 'Suas visitas',
    timesYouOpened: 'Vezes que você abriu isto',
    counterStorageDesc: 'Este contador é armazenado no armazenamento local do seu navegador. Cada vez que você (ou qualquer pessoa neste dispositivo) abre esta ferramenta, os números aumentam. É uma simples demonstração no lado do cliente — sem servidor ou banco de dados.',
    resetCounter: 'Reiniciar contador',
    currentSession: 'Sessão atual',
    resume: 'Retomar',
    saveReset: 'Salvar e reiniciar',
    savedSessions: 'Sessões salvas',
    clear: 'Limpar',
  },
  es: {
    textOrUrl: 'Texto o URL',
    size: 'Tamaño',
    fg: 'Frente',
    bg: 'Fondo',
    downloadPng: 'Descargar PNG',
    enterTextQr: 'Escribe texto para generar un código QR.',
    length: 'Longitud: {length}',
    uppercase: 'Mayúsculas',
    lowercase: 'Minúsculas',
    numbers: 'Números',
    symbols: 'Símbolos',
    regenerate: 'Regenerar',
    weak: 'Débil',
    fair: 'Aceptable',
    good: 'Buena',
    strong: 'Fuerte',
    veryStrong: 'Muy fuerte',
    length_: 'Longitud',
    value: 'Valor',
    from: 'De',
    to: 'A',
    dateOfBirth: 'Fecha de nacimiento',
    ageAtDate: 'Edad en la fecha',
    years: 'Años',
    months: 'Meses',
    days: 'Días',
    weeks: 'Semanas',
    firstDate: 'Primera fecha',
    secondDate: 'Segunda fecha',
    metric: 'Métrico',
    imperial: 'Imperial',
    height: 'Altura',
    weight: 'Peso',
    underweight: 'Bajo de peso',
    normal: 'Normal',
    overweight: 'Sobrepeso',
    obese: 'Obeso',
    min: 'Mín',
    max: 'Máx',
    howMany: 'Cuántos',
    uniqueValuesOnly: 'Solo valores únicos',
    generate: 'Generar',
    startTyping: 'Empieza a escribir o pega tu texto…',
    words: 'Palabras',
    characters: 'Caracteres',
    noSpaces: 'Sin espacios',
    sentences: 'Oraciones',
    paragraphs: 'Párrafos',
    readTime: 'Tiempo de lectura',
    focus25: 'Foco 25',
    short5: 'Pausa 5',
    long15: 'Pausa 15',
    focus: 'Foco',
    break_: 'Pausa',
    pause: 'Pausar',
    start: 'Iniciar',
    reset: 'Reiniciar',
    completedCycles: 'Ciclos completados:',
    amount: 'Cantidad',
    unit: 'Unidad',
    ingredient: 'Ingrediente',
    grams: 'Gramos',
    milliliters: 'Mililitros',
    encrypt: 'Cifrar',
    decrypt: 'Descifrar',
    textToEncrypt: 'Texto a cifrar',
    encryptedTextToDecrypt: 'Texto cifrado a descifrar',
    secretKey: 'Clave secreta',
    result: 'Resultado',
    invalidInputDecryption: 'Entrada inválida para descifrar.',
    enterIpPlaceholder: 'Escribe una dirección IP (o déjalo en blanco para la tuya)',
    lookingUp: 'Buscando…',
    lookup: 'Buscar',
    couldNotLookupIp: 'No se pudo buscar esta IP. El servicio puede no estar disponible.',
    ipAddress: 'Dirección IP',
    city: 'Ciudad',
    region: 'Región',
    country: 'País',
    countryCode: 'Código de país',
    postalCode: 'Código postal',
    latitude: 'Latitud',
    longitude: 'Longitud',
    timezone: 'Zona horaria',
    ispOrg: 'ISP / Org',
    pasteLongUrl: 'Pega una URL larga',
    shortening: 'Acortando…',
    shorten: 'Acortar',
    couldNotShortenUrl: 'No se pudo acortar esta URL. El servicio puede no estar disponible.',
    shortUrl: 'URL corta',
    totalVisits: 'Visitas totales',
    allTimePageViews: 'Vistas de todos los tiempos',
    today: 'Hoy',
    visitsSinceMidnight: 'Visitas desde medianoche',
    yourVisits: 'Tus visitas',
    timesYouOpened: 'Veces que has abierto esto',
    counterStorageDesc: 'Este contador se almacena en el almacenamiento local de tu navegador. Cada vez que tú (o cualquier persona en este dispositivo) abre esta herramienta, los números aumentan. Es una simple demostración del lado del cliente — sin servidor ni base de datos.',
    resetCounter: 'Reiniciar contador',
    currentSession: 'Sesión actual',
    resume: 'Reanudar',
    saveReset: 'Guardar y reiniciar',
    savedSessions: 'Sesiones guardadas',
    clear: 'Limpiar',
  },
  de: {
    textOrUrl: 'Text oder URL',
    size: 'Größe',
    fg: 'VG',
    bg: 'HG',
    downloadPng: 'PNG herunterladen',
    enterTextQr: 'Text eingeben, um einen QR-Code zu generieren.',
    length: 'Länge: {length}',
    uppercase: 'Großbuchstaben',
    lowercase: 'Kleinbuchstaben',
    numbers: 'Zahlen',
    symbols: 'Symbole',
    regenerate: 'Neu generieren',
    weak: 'Schwach',
    fair: 'Mittel',
    good: 'Gut',
    strong: 'Stark',
    veryStrong: 'Sehr stark',
    length_: 'Länge',
    value: 'Wert',
    from: 'Von',
    to: 'Nach',
    dateOfBirth: 'Geburtsdatum',
    ageAtDate: 'Alter am Datum',
    years: 'Jahre',
    months: 'Monate',
    days: 'Tage',
    weeks: 'Wochen',
    firstDate: 'Erstes Datum',
    secondDate: 'Zweites Datum',
    metric: 'Metrisch',
    imperial: 'Imperial',
    height: 'Größe',
    weight: 'Gewicht',
    underweight: 'Untergewicht',
    normal: 'Normal',
    overweight: 'Übergewicht',
    obese: 'Adipös',
    min: 'Min',
    max: 'Max',
    howMany: 'Wie viele',
    uniqueValuesOnly: 'Nur eindeutige Werte',
    generate: 'Generieren',
    startTyping: 'Tippen oder Text einfügen…',
    words: 'Wörter',
    characters: 'Zeichen',
    noSpaces: 'Ohne Leerzeichen',
    sentences: 'Sätze',
    paragraphs: 'Absätze',
    readTime: 'Lesezeit',
    focus25: 'Fokus 25',
    short5: 'Kurz 5',
    long15: 'Lang 15',
    focus: 'Fokus',
    break_: 'Pause',
    pause: 'Pause',
    start: 'Start',
    reset: 'Zurücksetzen',
    completedCycles: 'Abgeschlossene Zyklen:',
    amount: 'Menge',
    unit: 'Einheit',
    ingredient: 'Zutat',
    grams: 'Gramm',
    milliliters: 'Milliliter',
    encrypt: 'Verschlüsseln',
    decrypt: 'Entschlüsseln',
    textToEncrypt: 'Zu verschlüsselnder Text',
    encryptedTextToDecrypt: 'Zu entschlüsselnder verschlüsselter Text',
    secretKey: 'Geheimer Schlüssel',
    result: 'Ergebnis',
    invalidInputDecryption: 'Ungültige Eingabe für Entschlüsselung.',
    enterIpPlaceholder: 'IP-Adresse eingeben (oder leer lassen für Ihre eigene)',
    lookingUp: 'Suche läuft…',
    lookup: 'Suchen',
    couldNotLookupIp: 'Diese IP konnte nicht gesucht werden. Der Dienst ist möglicherweise nicht verfügbar.',
    ipAddress: 'IP-Adresse',
    city: 'Stadt',
    region: 'Region',
    country: 'Land',
    countryCode: 'Ländercode',
    postalCode: 'Postleitzahl',
    latitude: 'Breitengrad',
    longitude: 'Längengrad',
    timezone: 'Zeitzone',
    ispOrg: 'ISP / Org',
    pasteLongUrl: 'Lange URL einfügen',
    shortening: 'Kürzen…',
    shorten: 'Kürzen',
    couldNotShortenUrl: 'Diese URL konnte nicht gekürzt werden. Der Dienst ist möglicherweise nicht verfügbar.',
    shortUrl: 'Kurze URL',
    totalVisits: 'Gesamte Besuche',
    allTimePageViews: 'Alle Seitenaufrufe',
    today: 'Heute',
    visitsSinceMidnight: 'Besuche seit Mitternacht',
    yourVisits: 'Ihre Besuche',
    timesYouOpened: 'Wie oft Sie dies geöffnet haben',
    counterStorageDesc: 'Dieser Zähler wird im lokalen Speicher Ihres Browsers gespeichert. Jedes Mal, wenn Sie (oder jemand auf diesem Gerät) dieses Tool öffnen, erhöhen sich die Zahlen. Es ist eine einfache clientseitige Demo — kein Server oder Datenbank beteiligt.',
    resetCounter: 'Zähler zurücksetzen',
    currentSession: 'Aktuelle Sitzung',
    resume: 'Fortsetzen',
    saveReset: 'Speichern & zurücksetzen',
    savedSessions: 'Gespeicherte Sitzungen',
    clear: 'Löschen',
  },
} satisfies Record<Language, Record<string, string>>;

export function QrGenerator(_: { tool: Tool }) {
  const t = useT(S);
  const [text, setText] = useState('https://golana.online');
  const [size, setSize] = useState(256);
  const [fg, setFg] = useState('#0f172a');
  const [bg, setBg] = useState('#ffffff');
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    if (!text) {
      setDataUrl('');
      return;
    }
    QRCode.toDataURL(text, { width: size, margin: 2, color: { dark: fg, light: bg } })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [text, size, fg, bg]);

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="label">{t.textOrUrl}</label>
          <textarea className="input min-h-[100px]" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">{t.size}</label>
            <input type="number" className="input" value={size} onChange={(e) => setSize(+e.target.value || 256)} />
          </div>
          <div>
            <label className="label">{t.fg}</label>
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-11 w-full rounded-xl ring-1 ring-slate-200" />
          </div>
          <div>
            <label className="label">{t.bg}</label>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-11 w-full rounded-xl ring-1 ring-slate-200" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        {dataUrl ? (
          <>
            <img src={dataUrl} alt="QR code" className="rounded-xl ring-1 ring-slate-200" />
            <a href={dataUrl} download="qr-code.png" className="btn-primary">{t.downloadPng}</a>
          </>
        ) : (
          <p className="text-sm text-slate-400">{t.enterTextQr}</p>
        )}
      </div>
    </div>
  );
}

export function PasswordGenerator(_: { tool: Tool }) {
  const t = useT(S);
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [pw, setPw] = useState('');

  const gen = () => {
    let pool = '';
    if (upper) pool += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (lower) pool += 'abcdefghijkmnopqrstuvwxyz';
    if (nums) pool += '23456789';
    if (syms) pool += '!@#$%^&*()-_=+[]{};:,.?';
    if (!pool) { setPw(''); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let out = '';
    for (let i = 0; i < length; i++) out += pool[arr[i] % pool.length];
    setPw(out);
  };

  useEffect(() => { gen(); }, [length, upper, lower, nums, syms]);

  const strength = useMemo(() => {
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (upper && lower) score++;
    if (nums) score++;
    if (syms) score++;
    return Math.min(score, 5);
  }, [length, upper, lower, nums, syms]);

  const strengthLabels = [t.weak, t.fair, t.good, t.strong, t.veryStrong];
  const strengthLabel = strengthLabels[strength - 1] ?? t.weak;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-slate-900 p-5 font-mono text-lg text-accent-300 break-all">
        {pw || '—'}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
          <div className={`h-full transition-all ${['bg-rose-500','bg-orange-500','bg-amber-500','bg-lime-500','bg-accent-500'][strength-1]}`} style={{ width: `${(strength / 5) * 100}%` }} />
        </div>
        <span className="text-sm font-medium text-slate-600">{strengthLabel}</span>
        <button onClick={gen} className="btn-primary">{t.regenerate}</button>
        <CopyButton text={pw} />
      </div>
      <div>
        <label className="label">{t.length.replace('{length}', String(length))}</label>
        <input type="range" min={6} max={64} value={length} onChange={(e) => setLength(+e.target.value)} className="w-full accent-brand-600" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([[t.uppercase, upper, setUpper], [t.lowercase, lower, setLower], [t.numbers, nums, setNums], [t.symbols, syms, setSyms]] as const).map(([l, v, set]) => (
          <label key={l} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-100 cursor-pointer">
            <input type="checkbox" checked={v} onChange={(e) => set(e.target.checked)} className="accent-brand-600 h-4 w-4" />
            <span className="text-sm text-slate-700">{l}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function UnitConverter(_: { tool: Tool }) {
  const t = useT(S);
  const cats: Record<string, Record<string, number>> = {
    Length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
    Weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000 },
    Volume: { L: 1, mL: 0.001, gal: 3.78541, qt: 0.946353, cup: 0.236588, 'fl oz': 0.0295735 },
    Speed: { 'm/s': 1, 'km/h': 0.277778, mph: 0.44704, knot: 0.514444 },
  };
  const [cat, setCat] = useState('Length');
  const [val, setVal] = useState(1);
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');
  const units = Object.keys(cats[cat]);
  useEffect(() => {
    const u = Object.keys(cats[cat]);
    setFrom(u[0]); setTo(u[1]);
  }, [cat]);
  const result = (val * cats[cat][from]) / cats[cat][to];
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {Object.keys(cats).map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cat === c ? 'btn-primary' : 'btn-secondary'}>{c}</button>
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="label">{t.value}</label>
          <input type="number" className="input" value={val} onChange={(e) => setVal(+e.target.value || 0)} />
        </div>
        <div>
          <label className="label">{t.from}</label>
          <select className="input" value={from} onChange={(e) => setFrom(e.target.value)}>
            {units.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="label">{t.to}</label>
          <select className="input" value={to} onChange={(e) => setTo(e.target.value)}>
            {units.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div className="rounded-2xl bg-brand-600 p-6 text-center text-white">
        <p className="font-display text-3xl font-bold">{result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}</p>
        <p className="mt-1 text-sm opacity-80">{val} {from} = {result.toFixed(4)} {to}</p>
      </div>
    </div>
  );
}

export function AgeCalculator(_: { tool: Tool }) {
  const t = useT(S);
  const [dob, setDob] = useState('2000-01-01');
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  const res = useMemo(() => {
    const d1 = new Date(dob);
    const d2 = new Date(to);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 < d1) return null;
    let y = d2.getFullYear() - d1.getFullYear();
    let m = d2.getMonth() - d1.getMonth();
    let d = d2.getDate() - d1.getDate();
    if (d < 0) { m--; d += new Date(d2.getFullYear(), d2.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const totalDays = Math.floor((d2.getTime() - d1.getTime()) / 86400000);
    return { y, m, d, totalDays };
  }, [dob, to]);
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label">{t.dateOfBirth}</label><input type="date" className="input" value={dob} onChange={(e) => setDob(e.target.value)} /></div>
        <div><label className="label">{t.ageAtDate}</label><input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} /></div>
      </div>
      {res && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label={t.years} value={res.y} />
          <Stat label={t.months} value={res.y * 12 + res.m} />
          <Stat label={t.days} value={res.totalDays} />
          <Stat label={t.weeks} value={Math.floor(res.totalDays / 7)} />
        </div>
      )}
    </div>
  );
}

export function DateDifference(_: { tool: Tool }) {
  const t = useT(S);
  const [a, setA] = useState(new Date().toISOString().slice(0, 10));
  const [b, setB] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const days = useMemo(() => {
    const d1 = new Date(a); const d2 = new Date(b);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    return Math.abs(Math.floor((d2.getTime() - d1.getTime()) / 86400000));
  }, [a, b]);
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label">{t.firstDate}</label><input type="date" className="input" value={a} onChange={(e) => setA(e.target.value)} /></div>
        <div><label className="label">{t.secondDate}</label><input type="date" className="input" value={b} onChange={(e) => setB(e.target.value)} /></div>
      </div>
      {days !== null && (
        <div className="grid grid-cols-3 gap-3">
          <Stat label={t.days} value={days} />
          <Stat label={t.weeks} value={Math.floor(days / 7)} />
          <Stat label={t.months} value={Math.floor(days / 30)} />
        </div>
      )}
    </div>
  );
}

export function BmiCalculator(_: { tool: Tool }) {
  const t = useT(S);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const h = unit === 'metric' ? height / 100 : height * 0.0254;
  const w = unit === 'metric' ? weight : weight * 0.453592;
  const bmi = h > 0 ? w / (h * h) : 0;
  const cat = bmi < 18.5 ? t.underweight : bmi < 25 ? t.normal : bmi < 30 ? t.overweight : t.obese;
  const color = bmi < 18.5 ? 'text-sky-600' : bmi < 25 ? 'text-accent-600' : bmi < 30 ? 'text-amber-600' : 'text-rose-600';
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setUnit('metric')} className={unit === 'metric' ? 'btn-primary' : 'btn-secondary'}>{t.metric}</button>
        <button onClick={() => setUnit('imperial')} className={unit === 'imperial' ? 'btn-primary' : 'btn-secondary'}>{t.imperial}</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">{t.height} ({unit === 'metric' ? 'cm' : 'in'})</label>
          <input type="number" className="input" value={height} onChange={(e) => setHeight(+e.target.value || 0)} />
        </div>
        <div>
          <label className="label">{t.weight} ({unit === 'metric' ? 'kg' : 'lb'})</label>
          <input type="number" className="input" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} />
        </div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-6 text-center text-white">
        <p className="font-display text-4xl font-bold">{bmi.toFixed(1)}</p>
        <p className={`mt-1 text-sm ${color}`}>{cat}</p>
      </div>
    </div>
  );
}

export function RandomNumber(_: { tool: Tool }) {
  const t = useT(S);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [unique, setUnique] = useState(false);

  const gen = () => {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const out: number[] = [];
    const used = new Set<number>();
    let attempts = 0;
    while (out.length < count && attempts < 10000) {
      const n = Math.floor(Math.random() * (hi - lo + 1)) + lo;
      if (unique) {
        if (!used.has(n)) { used.add(n); out.push(n); }
      } else out.push(n);
      attempts++;
    }
    setResults(out);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div><label className="label">{t.min}</label><input type="number" className="input" value={min} onChange={(e) => setMin(+e.target.value || 0)} /></div>
        <div><label className="label">{t.max}</label><input type="number" className="input" value={max} onChange={(e) => setMax(+e.target.value || 0)} /></div>
        <div><label className="label">{t.howMany}</label><input type="number" className="input" value={count} min={1} onChange={(e) => setCount(+e.target.value || 1)} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="accent-brand-600 h-4 w-4" />
        {t.uniqueValuesOnly}
      </label>
      <button onClick={gen} className="btn-primary w-full">{t.generate}</button>
      {results.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {results.map((n, i) => (
            <span key={i} className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600 text-white font-display text-xl font-bold animate-pop">{n}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function TextCase(_: { tool: Tool }) {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog.');
  const fns: Record<string, (s: string) => string> = {
    'UPPER': (s) => s.toUpperCase(),
    lower: (s) => s.toLowerCase(),
    Title: (s) => s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase()),
    Sentence: (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
    camelCase: (s) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    snake_case: (s) => s.trim().toLowerCase().replace(/\s+/g, '_'),
    'kebab-case': (s) => s.trim().toLowerCase().replace(/\s+/g, '-'),
    'aLtErNaTiNg': (s) => s.split('').map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join(''),
  };
  return (
    <div className="space-y-4">
      <textarea className="input min-h-[120px]" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {Object.keys(fns).map((k) => (
          <button key={k} onClick={() => setText(fns[k](text))} className="btn-secondary">{k}</button>
        ))}
      </div>
      <ResultBox><p className="break-all font-mono text-sm text-slate-800">{text}</p></ResultBox>
      <div className="flex justify-end"><CopyButton text={text} /></div>
    </div>
  );
}

export function WordCounter(_: { tool: Tool }) {
  const t = useT(S);
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const words = (text.match(/\S+/g) || []).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const sentences = (text.match(/[.!?]+/g) || []).length;
    const paragraphs = text.split(/\n+/).filter((p) => p.trim()).length;
    const readTime = Math.max(1, Math.round(words / 200));
    return { words, chars, charsNoSpace, sentences, paragraphs, readTime };
  }, [text]);
  return (
    <div className="space-y-4">
      <textarea className="input min-h-[160px]" placeholder={t.startTyping} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <Stat label={t.words} value={stats.words} />
        <Stat label={t.characters} value={stats.chars} />
        <Stat label={t.noSpaces} value={stats.charsNoSpace} />
        <Stat label={t.sentences} value={stats.sentences} />
        <Stat label={t.paragraphs} value={stats.paragraphs} />
        <Stat label={t.readTime} value={`${stats.readTime}m`} />
      </div>
    </div>
  );
}

export function TimerPomodoro(_: { tool: Tool }) {
  const t = useT(S);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const durations = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
  const [remaining, setRemaining] = useState(durations[mode]);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          setCycles((c) => c + 1);
          try { new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=').play(); } catch {}
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const switchMode = (m: typeof mode) => {
    setMode(m);
    setRunning(false);
    setRemaining(durations[m]);
  };
  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = (remaining % 60).toString().padStart(2, '0');
  const pct = ((durations[mode] - remaining) / durations[mode]) * 100;
  const color = mode === 'focus' ? 'from-brand-500 to-brand-600' : mode === 'short' ? 'from-accent-500 to-accent-600' : 'from-amber-500 to-orange-500';

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center gap-2">
        {([['focus', t.focus25], ['short', t.short5], ['long', t.long15]] as const).map(([m, l]) => (
          <button key={m} onClick={() => switchMode(m)} className={mode === m ? 'btn-primary' : 'btn-secondary'}>{l}</button>
        ))}
      </div>
      <div className="relative mx-auto h-56 w-56">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="6" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="url(#g)" strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45 * (1 - pct / 100)} className="transition-all duration-500" />
          <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3b8eff" /><stop offset="100%" stopColor="#10b981" /></linearGradient></defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-5xl font-bold bg-gradient-to-br ${color} bg-clip-text text-transparent`}>{mm}:{ss}</span>
          <span className="mt-1 text-xs uppercase tracking-wider text-slate-400">{mode === 'focus' ? t.focus : t.break_}</span>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={() => setRunning((r) => !r)} className="btn-primary">{running ? t.pause : t.start}</button>
        <button onClick={() => { setRunning(false); setRemaining(durations[mode]); }} className="btn-secondary">{t.reset}</button>
      </div>
      <p className="text-sm text-slate-500">{t.completedCycles} <span className="font-semibold text-slate-700">{cycles}</span></p>
    </div>
  );
}

export function CookingConverter(_: { tool: Tool }) {
  const t = useT(S);
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState('cup');
  const [ingredient, setIngredient] = useState('water');
  // density g/ml relative to water
  const densities: Record<string, number> = {
    water: 1, milk: 1.03, oil: 0.92, flour: 0.53, sugar: 0.85, salt: 1.2, butter: 0.96, rice: 0.85, honey: 1.42,
  };
  const units: Record<string, number> = { cup: 240, tbsp: 15, tsp: 5, 'fl oz': 29.5735, mL: 1, L: 1000 };
  const ml = amount * units[unit];
  const grams = ml * (densities[ingredient] ?? 1);
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div><label className="label">{t.amount}</label><input type="number" className="input" value={amount} onChange={(e) => setAmount(+e.target.value || 0)} /></div>
        <div>
          <label className="label">{t.unit}</label>
          <select className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
            {Object.keys(units).map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="label">{t.ingredient}</label>
          <select className="input" value={ingredient} onChange={(e) => setIngredient(e.target.value)}>
            {Object.keys(densities).map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label={t.grams} value={grams.toFixed(1)} />
        <Stat label={t.milliliters} value={ml.toFixed(1)} />
      </div>
    </div>
  );
}

// ============ Text Encryption Tool ============
export function TextEncryption(_: { tool: Tool }) {
  const t = useT(S);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [text, setText] = useState('Hello, World!');
  const [key, setKey] = useState('secret');
  const [result, setResult] = useState('');

  const process = () => {
    try {
      if (mode === 'encrypt') {
        const encrypted = btoa(unescape(encodeURIComponent(text.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join(''))));
        setResult(encrypted);
      } else {
        const decoded = decodeURIComponent(escape(atob(text)));
        const decrypted = decoded.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join('');
        setResult(decrypted);
      }
    } catch {
      setResult(t.invalidInputDecryption);
    }
  };

  useEffect(() => { if (text) process(); }, [text, key, mode]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('encrypt')} className={mode === 'encrypt' ? 'btn-primary' : 'btn-secondary'}>{t.encrypt}</button>
        <button onClick={() => setMode('decrypt')} className={mode === 'decrypt' ? 'btn-primary' : 'btn-secondary'}>{t.decrypt}</button>
      </div>
      <div>
        <label className="label">{mode === 'encrypt' ? t.textToEncrypt : t.encryptedTextToDecrypt}</label>
        <textarea className="input min-h-[100px]" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div>
        <label className="label">{t.secretKey}</label>
        <input className="input" value={key} onChange={(e) => setKey(e.target.value)} />
      </div>
      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">{t.result}</p>
        <p className="font-mono text-sm text-slate-800 break-all">{result || '—'}</p>
      </div>
      <div className="flex justify-end"><CopyButton text={result} /></div>
    </div>
  );
}

// ============ IP Lookup ============
export function IpLookup(_: { tool: Tool }) {
  const t = useT(S);
  const [ip, setIp] = useState('');
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const lookup = async () => {
    const target = ip.trim() || '';
    setBusy(true); setErr(''); setData(null);
    try {
      const url = target ? `https://ipapi.co/${target}/json/` : 'https://ipapi.co/json/';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Lookup failed');
      const json = await res.json();
      if (json.error) throw new Error(json.reason || 'Lookup failed');
      setData(json);
    } catch {
      setErr(t.couldNotLookupIp);
    } finally {
      setBusy(false);
    }
  };

  const fieldKeys = {
    ipAddress: 'ip',
    city: 'city',
    region: 'region',
    country: 'country_name',
    countryCode: 'country_code',
    postalCode: 'postal',
    latitude: 'latitude',
    longitude: 'longitude',
    timezone: 'timezone',
    ispOrg: 'org',
  } as const;
  const fields: [string, string][] = data ? (
    Object.entries(fieldKeys)
      .map(([labelKey, dataKey]) => [t[labelKey as keyof typeof t], (data as any)[dataKey]] as [string, any])
      .filter(([, v]) => v !== undefined && v !== null) as [string, string][]
  ) : [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="input" value={ip} onChange={(e) => setIp(e.target.value)} placeholder={t.enterIpPlaceholder} onKeyDown={(e) => e.key === 'Enter' && lookup()} />
        <button onClick={lookup} disabled={busy} className="btn-primary shrink-0">{busy ? t.lookingUp : t.lookup}</button>
      </div>
      {err && <p className="text-sm text-rose-600">{err}</p>}
      {data && (
        <div className="grid sm:grid-cols-2 gap-3">
          {fields.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
              <p className="mt-1 font-medium text-slate-800">{String(value)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ URL Shortener ============
export function UrlShortener(_: { tool: Tool }) {
  const t = useT(S);
  const [url, setUrl] = useState('https://');
  const [short, setShort] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const shorten = async () => {
    if (!url || url === 'https://') return;
    setBusy(true); setErr(''); setShort('');
    try {
      const res = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error('Shortening failed');
      const text = await res.text();
      if (text.startsWith('error:')) throw new Error(text);
      setShort(text);
    } catch {
      setErr(t.couldNotShortenUrl);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t.pasteLongUrl} onKeyDown={(e) => e.key === 'Enter' && shorten()} />
        <button onClick={shorten} disabled={busy} className="btn-primary shrink-0">{busy ? t.shortening : t.shorten}</button>
      </div>
      {err && <p className="text-sm text-rose-600">{err}</p>}
      {short && (
        <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">{t.shortUrl}</p>
          <div className="flex items-center gap-2">
            <a href={short} target="_blank" rel="noreferrer" className="flex-1 font-mono text-sm text-brand-600 hover:underline break-all">{short}</a>
            <CopyButton text={short} />
          </div>
        </div>
      )}
    </div>
  );
}

// ============ Visitor Counter (client-side) ============
export function VisitorCounter(_: { tool: Tool }) {
  const t = useT(S);
  const [count, setCount] = useState(0);
  const [today, setToday] = useState(0);
  const [myVisits, setMyVisits] = useState(0);

  useEffect(() => {
    const key = 'visitor-count';
    const dayKey = 'visitor-day';
    const myKey = 'my-visits';
    const today_str = new Date().toISOString().slice(0, 10);

    let total = parseInt(localStorage.getItem(key) || '0', 10);
    let day = localStorage.getItem(dayKey);
    let dayCount = parseInt(localStorage.getItem(key + '-today') || '0', 10);
    let mine = parseInt(localStorage.getItem(myKey) || '0', 10);

    if (day !== today_str) {
      dayCount = 0;
      localStorage.setItem(dayKey, today_str);
    }

    total++; dayCount++; mine++;
    localStorage.setItem(key, String(total));
    localStorage.setItem(key + '-today', String(dayCount));
    localStorage.setItem(myKey, String(mine));

    setCount(total); setToday(dayCount); setMyVisits(mine);
  }, []);

  const reset = () => {
    localStorage.removeItem('visitor-count');
    localStorage.removeItem('visitor-day');
    localStorage.removeItem('visitor-count-today');
    localStorage.removeItem('my-visits');
    setCount(0); setToday(0); setMyVisits(0);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat label={t.totalVisits} value={count.toLocaleString()} hint={t.allTimePageViews} />
        <Stat label={t.today} value={today.toLocaleString()} hint={t.visitsSinceMidnight} />
        <Stat label={t.yourVisits} value={myVisits.toLocaleString()} hint={t.timesYouOpened} />
      </div>
      <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <p className="text-sm text-slate-600">
          {t.counterStorageDesc}
        </p>
      </div>
      <button onClick={reset} className="btn-secondary">{t.resetCounter}</button>
    </div>
  );
}

// ============ Session Timer ============
export function SessionTimer(_: { tool: Tool }) {
  const t = useT(S);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [sessions, setSessions] = useState<{ start: string; duration: number }[]>(() => {
    try { return JSON.parse(localStorage.getItem('session-timer-history') || '[]'); } catch { return []; }
  });
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const pause = () => {
    if (running) { setRunning(false); }
    else { startRef.current = Date.now() - elapsed * 1000; setRunning(true); }
  };

  const stop = () => {
    if (elapsed === 0) return;
    const entry = { start: new Date(startRef.current).toLocaleString(), duration: elapsed };
    const next = [entry, ...sessions].slice(0, 20);
    setSessions(next);
    localStorage.setItem('session-timer-history', JSON.stringify(next));
    setElapsed(0); setRunning(false); startRef.current = Date.now();
  };

  const clearHistory = () => { setSessions([]); localStorage.removeItem('session-timer-history'); };

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="font-display text-5xl font-bold tabular-nums text-slate-900">{fmt(elapsed)}</p>
        <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{t.currentSession}</p>
      </div>
      <div className="flex justify-center gap-2">
        <button onClick={pause} className="btn-primary">{running ? t.pause : t.resume}</button>
        <button onClick={stop} className="btn-secondary">{t.saveReset}</button>
      </div>
      {sessions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">{t.savedSessions}</p>
            <button onClick={clearHistory} className="text-xs text-slate-400 hover:text-rose-500">{t.clear}</button>
          </div>
          {sessions.map((s, i) => (
            <div key={i} className="flex justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm">
              <span className="text-slate-500">{s.start}</span>
              <span className="font-mono font-medium text-slate-800">{fmt(s.duration)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
