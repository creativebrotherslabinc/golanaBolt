import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import jsPDF from 'jspdf';
import { FileText, X, ArrowUp, ArrowDown } from 'lucide-react';
import { FileDrop, DownloadButton, ErrorBanner, saveBlob, formatBytes } from '../tool-ui';
import type { Tool } from '../catalog';
import { useT, type Language } from '../i18n';

const S = {
  en: {
    mergeAdd: 'Add PDF files to merge',
    mergeHint: 'Drag & drop or click — order them below',
    mergeErr: 'Could not merge these PDFs. Make sure they are valid.',
    merging: 'Merging…',
    mergeBtn: 'Merge & Download',
    splitSelect: 'Select a PDF to split',
    splitRanges: 'Page ranges',
    splitHint: 'Each range produces a separate PDF file.',
    splitErr: 'Could not split. Check the file and range format (e.g. "1-3, 5, 7-9").',
    splitting: 'Splitting…',
    splitBtn: 'Split & Download',
    compressSelect: 'Select a PDF to compress',
    compressErr: 'Could not compress this PDF.',
    before: 'Before',
    after: 'After',
    smallerPct: '% smaller',
    repackaged: 're-packaged',
    compressing: 'Compressing…',
    compressBtn: 'Compress & Download',
    toDocxSelect: 'Select a PDF to convert',
    toDocxHint: 'Extracts the text layer of the PDF into an editable Word document.',
    toDocxErr: 'Could not extract text from this PDF.',
    toDocxing: 'Converting…',
    toDocxBtn: 'Convert to DOCX',
    docxSelect: 'Select a DOCX/TXT file',
    docxErr: 'Could not convert this document.',
    docxing: 'Converting…',
    docxBtn: 'Convert to PDF',
    txtPlaceholder: 'Paste or type your text here…',
    txtBtn: 'Create PDF',
    imgSelect: 'Select images',
    imgHint: 'JPG, PNG, WebP — each image becomes a page',
    imgErr: 'Could not process one of the images.',
    imgConverting: 'Converting…',
    imgBtn: 'Create PDF',
    pdfSelect: 'Select a PDF',
    pdfErr: 'Could not render this PDF.',
    rendering: 'Rendering…',
    renderBtn: 'Render pages',
    pageLabel: 'Page',
    pageSave: 'click to save',
  },
  pt: {
    mergeAdd: 'Adicione arquivos PDF para juntar',
    mergeHint: 'Arraste e solte ou clique — ordene abaixo',
    mergeErr: 'Não foi possível juntar estes PDFs. Verifique se são válidos.',
    merging: 'Juntando…',
    mergeBtn: 'Juntar e Baixar',
    splitSelect: 'Selecione um PDF para dividir',
    splitRanges: 'Intervalos de páginas',
    splitHint: 'Cada intervalo produz um arquivo PDF separado.',
    splitErr: 'Não foi possível dividir. Verifique o arquivo e o formato do intervalo (ex.: "1-3, 5, 7-9").',
    splitting: 'Dividindo…',
    splitBtn: 'Dividir e Baixar',
    compressSelect: 'Selecione um PDF para compactar',
    compressErr: 'Não foi possível compactar este PDF.',
    before: 'Antes',
    after: 'Depois',
    smallerPct: '% menor',
    repackaged: 'reempacotado',
    compressing: 'Compactando…',
    compressBtn: 'Compactar e Baixar',
    toDocxSelect: 'Selecione um PDF para converter',
    toDocxHint: 'Extrai a camada de texto do PDF em um documento Word editável.',
    toDocxErr: 'Não foi possível extrair texto deste PDF.',
    toDocxing: 'Convertendo…',
    toDocxBtn: 'Converter para DOCX',
    docxSelect: 'Selecione um arquivo DOCX/TXT',
    docxErr: 'Não foi possível converter este documento.',
    docxing: 'Convertendo…',
    docxBtn: 'Converter para PDF',
    txtPlaceholder: 'Cole ou digite seu texto aqui…',
    txtBtn: 'Criar PDF',
    imgSelect: 'Selecione imagens',
    imgHint: 'JPG, PNG, WebP — cada imagem vira uma página',
    imgErr: 'Não foi possível processar uma das imagens.',
    imgConverting: 'Convertendo…',
    imgBtn: 'Criar PDF',
    pdfSelect: 'Selecione um PDF',
    pdfErr: 'Não foi possível renderizar este PDF.',
    rendering: 'Renderizando…',
    renderBtn: 'Renderizar páginas',
    pageLabel: 'Página',
    pageSave: 'clique para salvar',
  },
  es: {
    mergeAdd: 'Añade archivos PDF para combinar',
    mergeHint: 'Arrastra y suelta o haz clic — ordénalos abajo',
    mergeErr: 'No se pudieron combinar estos PDFs. Asegúrate de que sean válidos.',
    merging: 'Combinando…',
    mergeBtn: 'Combinar y Descargar',
    splitSelect: 'Selecciona un PDF para dividir',
    splitRanges: 'Rangos de páginas',
    splitHint: 'Cada rango produce un archivo PDF separado.',
    splitErr: 'No se pudo dividir. Revisa el archivo y el formato del rango (ej.: "1-3, 5, 7-9").',
    splitting: 'Dividiendo…',
    splitBtn: 'Dividir y Descargar',
    compressSelect: 'Selecciona un PDF para comprimir',
    compressErr: 'No se pudo comprimir este PDF.',
    before: 'Antes',
    after: 'Después',
    smallerPct: '% más pequeño',
    repackaged: 'reempaquetado',
    compressing: 'Comprimiendo…',
    compressBtn: 'Comprimir y Descargar',
    toDocxSelect: 'Selecciona un PDF para convertir',
    toDocxHint: 'Extrae la capa de texto del PDF en un documento Word editable.',
    toDocxErr: 'No se pudo extraer texto de este PDF.',
    toDocxing: 'Convirtiendo…',
    toDocxBtn: 'Convertir a DOCX',
    docxSelect: 'Selecciona un archivo DOCX/TXT',
    docxErr: 'No se pudo convertir este documento.',
    docxing: 'Convirtiendo…',
    docxBtn: 'Convertir a PDF',
    txtPlaceholder: 'Pega o escribe tu texto aquí…',
    txtBtn: 'Crear PDF',
    imgSelect: 'Selecciona imágenes',
    imgHint: 'JPG, PNG, WebP — cada imagen es una página',
    imgErr: 'No se pudo procesar una de las imágenes.',
    imgConverting: 'Convirtiendo…',
    imgBtn: 'Crear PDF',
    pdfSelect: 'Selecciona un PDF',
    pdfErr: 'No se pudo renderizar este PDF.',
    rendering: 'Renderizando…',
    renderBtn: 'Renderizar páginas',
    pageLabel: 'Página',
    pageSave: 'clic para guardar',
  },
  de: {
    mergeAdd: 'PDF-Dateien zum Zusammenführen hinzufügen',
    mergeHint: 'Drag & Drop oder Klick — unten sortieren',
    mergeErr: 'Diese PDFs konnten nicht zusammengeführt werden. Stelle sicher, dass sie gültig sind.',
    merging: 'Zusammenführen…',
    mergeBtn: 'Zusammenführen & Herunterladen',
    splitSelect: 'PDF zum Teilen auswählen',
    splitRanges: 'Seitenbereiche',
    splitHint: 'Jeder Bereich erzeugt eine separate PDF-Datei.',
    splitErr: 'Teilen nicht möglich. Prüfe Datei und Bereichsformat (z.B. "1-3, 5, 7-9").',
    splitting: 'Teilen…',
    splitBtn: 'Teilen & Herunterladen',
    compressSelect: 'PDF zum Komprimieren auswählen',
    compressErr: 'Dieses PDF konnte nicht komprimiert werden.',
    before: 'Vorher',
    after: 'Nachher',
    smallerPct: '% kleiner',
    repackaged: 'neu verpackt',
    compressing: 'Komprimieren…',
    compressBtn: 'Komprimieren & Herunterladen',
    toDocxSelect: 'PDF zum Konvertieren auswählen',
    toDocxHint: 'Extrahiert die Textschicht des PDF in ein bearbeitbares Word-Dokument.',
    toDocxErr: 'Text konnte nicht aus diesem PDF extrahiert werden.',
    toDocxing: 'Konvertieren…',
    toDocxBtn: 'Zu DOCX konvertieren',
    docxSelect: 'DOCX/TXT-Datei auswählen',
    docxErr: 'Dieses Dokument konnte nicht konvertiert werden.',
    docxing: 'Konvertieren…',
    docxBtn: 'Zu PDF konvertieren',
    txtPlaceholder: 'Füge deinen Text hier ein oder tippe ihn…',
    txtBtn: 'PDF erstellen',
    imgSelect: 'Bilder auswählen',
    imgHint: 'JPG, PNG, WebP — jedes Bild wird eine Seite',
    imgErr: 'Eines der Bilder konnte nicht verarbeitet werden.',
    imgConverting: 'Konvertieren…',
    imgBtn: 'PDF erstellen',
    pdfSelect: 'PDF auswählen',
    pdfErr: 'Dieses PDF konnte nicht gerendert werden.',
    rendering: 'Rendern…',
    renderBtn: 'Seiten rendern',
    pageLabel: 'Seite',
    pageSave: 'Klick zum Speichern',
  },
} satisfies Record<Language, Record<string, string>>;

export function PdfMerger(_: { tool: Tool }) {
  const t = useT(S);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const merge = async () => {
    setBusy(true);
    setErr('');
    try {
      const out = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const blob = new Blob([await out.save()], { type: 'application/pdf' });
      saveBlob(blob, 'merged.pdf');
    } catch (e) {
      setErr(t.mergeErr);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="application/pdf" multiple onFiles={setFiles} label={t.mergeAdd} hint={t.mergeHint} />
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <FileText className="h-5 w-5 text-rose-500" />
              <span className="flex-1 truncate text-sm text-slate-700">{f.name}</span>
              <span className="text-xs text-slate-400">{formatBytes(f.size)}</span>
              <div className="flex gap-1">
                <button disabled={i === 0} onClick={() => setFiles((p) => swap(p, i, i - 1))} className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button disabled={i === files.length - 1} onClick={() => setFiles((p) => swap(p, i, i + 1))} className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                <button onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))} className="rounded p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600"><X className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {err && <ErrorBanner message={err} />}
      <div className="flex justify-end">
        <DownloadButton onClick={merge} disabled={files.length < 2 || busy} label={busy ? t.merging : t.mergeBtn} />
      </div>
    </div>
  );
}

function swap<T>(arr: T[], a: number, b: number): T[] {
  const c = [...arr];
  [c[a], c[b]] = [c[b], c[a]];
  return c;
}

export function PdfSplitter(_: { tool: Tool }) {
  const t = useT(S);
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState('1');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const split = async () => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const total = src.getPageCount();
      const specs = parseRanges(ranges, total);
      for (const [start, end] of specs) {
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, Array.from({ length: end - start + 1 }, (_, k) => start - 1 + k));
        pages.forEach((p) => out.addPage(p));
        const blob = new Blob([await out.save()], { type: 'application/pdf' });
        saveBlob(blob, `split-${start}-${end}.pdf`);
      }
    } catch {
      setErr(t.splitErr);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="application/pdf" onFiles={(f) => setFile(f[0])} label={file ? file.name : t.splitSelect} />
      <div>
        <label className="label">{t.splitRanges}</label>
        <input className="input" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1-3, 5, 7-9" />
        <p className="mt-1 text-xs text-slate-400">{t.splitHint}</p>
      </div>
      {err && <ErrorBanner message={err} />}
      <div className="flex justify-end">
        <DownloadButton onClick={split} disabled={!file || busy} label={busy ? t.splitting : t.splitBtn} />
      </div>
    </div>
  );
}

function parseRanges(input: string, total: number): [number, number][] {
  return input.split(',').map((s) => s.trim()).filter(Boolean).map((part) => {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map((n) => parseInt(n.trim(), 10));
      return [Math.max(1, a), Math.min(total, b)] as [number, number];
    }
    const n = parseInt(part, 10);
    return [n, n] as [number, number];
  }).filter(([a, b]) => !isNaN(a) && !isNaN(b) && a <= b);
}

export function PdfCompressor(_: { tool: Tool }) {
  const t = useT(S);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState<{ before: number; after: number } | null>(null);

  const compress = async () => {
    if (!file) return;
    setBusy(true);
    setErr('');
    setResult(null);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
      pdf.setCreator('Go LANA Compressor');
      pdf.setProducer('Go LANA');
      const out = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
      const blob = new Blob([out], { type: 'application/pdf' });
      const after = blob.size;
      saveBlob(blob, file.name.replace(/\.pdf$/i, '') + '-compressed.pdf');
      setResult({ before: file.size, after });
    } catch {
      setErr(t.compressErr);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="application/pdf" onFiles={(f) => setFile(f[0])} label={file ? file.name : t.compressSelect} />
      {err && <ErrorBanner message={err} />}
      {result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
            <p className="text-xs uppercase tracking-wider text-slate-400">{t.before}</p>
            <p className="font-display text-xl font-bold text-slate-900">{formatBytes(result.before)}</p>
          </div>
          <div className="rounded-xl bg-accent-50 p-4 ring-1 ring-accent-100">
            <p className="text-xs uppercase tracking-wider text-accent-700">{t.after}</p>
            <p className="font-display text-xl font-bold text-accent-800">{formatBytes(result.after)}</p>
            <p className="text-xs text-accent-700">{result.after < result.before ? `${Math.round((1 - result.after / result.before) * 100)}${t.smallerPct}` : t.repackaged}</p>
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <DownloadButton onClick={compress} disabled={!file || busy} label={busy ? t.compressing : t.compressBtn} />
      </div>
    </div>
  );
}

export function PdfToDocx(_: { tool: Tool }) {
  const t = useT(S);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const pdfjs: any = await import('pdfjs-dist/build/pdf.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.mjs?url')).default;
      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      let text = '';
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        const strings = content.items.map((it: any) => ('str' in it ? it.str : '')).join(' ');
        text += `--- ${t.pageLabel} ${p} ---\n${strings}\n\n`;
      }
      const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Converted</title></head><body>${text
        .split('\n')
        .map((l) => (l.startsWith('---') ? `<h3>${l}</h3>` : `<p>${l.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>`))
        .join('')}</body></html>`;
      saveBlob(new Blob([html], { type: 'application/msword' }), file.name.replace(/\.pdf$/i, '') + '.doc');
    } catch (e) {
      setErr(t.toDocxErr);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="application/pdf" onFiles={(f) => setFile(f[0])} label={file ? file.name : t.toDocxSelect} />
      <p className="text-xs text-slate-500">{t.toDocxHint}</p>
      {err && <ErrorBanner message={err} />}
      <div className="flex justify-end">
        <DownloadButton onClick={convert} disabled={!file || busy} label={busy ? t.toDocxing : t.toDocxBtn} />
      </div>
    </div>
  );
}

export function DocxToPdf(_: { tool: Tool }) {
  const t = useT(S);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const text = await file.text();
      const stripped = text.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+\n/g, '\n').trim();
      const lines = stripped.split('\n').filter((l) => l.trim().length);
      const doc = new jsPDF();
      const margin = 36;
      const maxW = doc.internal.pageSize.getWidth() - margin * 2;
      let y = margin;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      for (const line of lines) {
        const wrapped = doc.splitTextToSize(line, maxW) as string[];
        for (const w of wrapped) {
          if (y > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(w, margin, y);
          y += 18;
        }
      }
      saveBlob(doc.output('blob'), file.name.replace(/\.(docx?|txt)$/i, '') + '.pdf');
    } catch {
      setErr(t.docxErr);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept=".doc,.docx,.txt,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onFiles={(f) => setFile(f[0])} label={file ? file.name : t.docxSelect} />
      {err && <ErrorBanner message={err} />}
      <div className="flex justify-end">
        <DownloadButton onClick={convert} disabled={!file || busy} label={busy ? t.docxing : t.docxBtn} />
      </div>
    </div>
  );
}

export function TxtToPdf(_: { tool: Tool }) {
  const t = useT(S);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const convert = () => {
    setBusy(true);
    try {
      const doc = new jsPDF();
      const margin = 36;
      const maxW = doc.internal.pageSize.getWidth() - margin * 2;
      let y = margin;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      for (const line of text.split('\n')) {
        const wrapped = doc.splitTextToSize(line || ' ', maxW) as string[];
        for (const w of wrapped) {
          if (y > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(w, margin, y);
          y += 16;
        }
      }
      saveBlob(doc.output('blob'), 'text.pdf');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        className="input min-h-[240px] font-mono text-sm"
        placeholder={t.txtPlaceholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end">
        <DownloadButton onClick={convert} disabled={!text.trim() || busy} label={t.txtBtn} />
      </div>
    </div>
  );
}

export function ImagesToPdf(_: { tool: Tool }) {
  const t = useT(S);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const convert = async () => {
    setBusy(true);
    setErr('');
    try {
      const doc = new jsPDF();
      let first = true;
      for (const f of files) {
        const url = URL.createObjectURL(f);
        const img = await loadImage(url);
        URL.revokeObjectURL(url);
        const pw = doc.internal.pageSize.getWidth();
        const ph = doc.internal.pageSize.getHeight();
        const ratio = Math.min(pw / img.width, ph / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        if (!first) doc.addPage();
        first = false;
        const fmt = f.type.includes('png') ? 'PNG' : 'JPEG';
        doc.addImage(img, fmt, (pw - w) / 2, (ph - h) / 2, w, h);
      }
      saveBlob(doc.output('blob'), 'images.pdf');
    } catch {
      setErr(t.imgErr);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="image/*" multiple onFiles={setFiles} label={t.imgSelect} hint={t.imgHint} />
      {files.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {files.map((f, i) => (
            <div key={i} className="aspect-square rounded-lg bg-slate-100 overflow-hidden relative group">
              <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
              <button onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 rounded-full bg-white/90 p-1 opacity-0 group-hover:opacity-100 transition">
                <X className="h-3.5 w-3.5 text-rose-600" />
              </button>
            </div>
          ))}
        </div>
      )}
      {err && <ErrorBanner message={err} />}
      <div className="flex justify-end">
        <DownloadButton onClick={convert} disabled={files.length === 0 || busy} label={busy ? t.imgConverting : t.imgBtn} />
      </div>
    </div>
  );
}

export function PdfToImages(_: { tool: Tool }) {
  const t = useT(S);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setErr('');
    setImages([]);
    try {
      const pdfjs: any = await import('pdfjs-dist/build/pdf.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = (await import('pdfjs-dist/build/pdf.worker.mjs?url')).default;
      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      const urls: string[] = [];
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        urls.push(canvas.toDataURL('image/png'));
      }
      setImages(urls);
    } catch {
      setErr(t.pdfErr);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="application/pdf" onFiles={(f) => setFile(f[0])} label={file ? file.name : t.pdfSelect} />
      {err && <ErrorBanner message={err} />}
      <div className="flex justify-end">
        <DownloadButton onClick={convert} disabled={!file || busy} label={busy ? t.rendering : t.renderBtn} />
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((src, i) => (
            <a key={i} href={src} download={`page-${i + 1}.png`} className="group relative rounded-xl overflow-hidden ring-1 ring-slate-200">
              <img src={src} alt={`${t.pageLabel} ${i + 1}`} className="w-full" />
              <span className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">{t.pageLabel} {i + 1} — {t.pageSave}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}
