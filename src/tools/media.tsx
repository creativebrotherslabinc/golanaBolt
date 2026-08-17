import { useState, useRef, useEffect, useMemo } from 'react';
import imageCompression from 'browser-image-compression';
import { X } from 'lucide-react';
import { FileDrop, DownloadButton, ErrorBanner, CopyButton, saveBlob, formatBytes } from '../tool-ui';
import type { Tool } from '../catalog';

export function ImageCompressor(_: { tool: Tool }) {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(60);
  const [maxW, setMaxW] = useState(1920);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState<{ before: number; after: number; url: string } | null>(null);

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setErr('');
    setResult(null);
    try {
      const out = await imageCompression(file, {
        maxSizeMB: 100,
        maxWidthOrHeight: maxW,
        initialQuality: quality / 100,
        useWebWorker: true,
      });
      const url = URL.createObjectURL(out);
      setResult({ before: file.size, after: out.size, url });
      saveBlob(out, file.name.replace(/\.(png|jpe?g|webp)$/i, '') + '-compressed.' + (out.type.split('/')[1] || 'jpg'));
    } catch {
      setErr('Could not compress this image.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="image/*" onFiles={(f) => setFile(f[0])} label={file ? file.name : 'Select an image'} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Quality: {quality}%</label>
          <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(+e.target.value)} className="w-full accent-brand-600" />
        </div>
        <div>
          <label className="label">Max width: {maxW}px</label>
          <input type="range" min={320} max={4000} step={80} value={maxW} onChange={(e) => setMaxW(+e.target.value)} className="w-full accent-brand-600" />
        </div>
      </div>
      {err && <ErrorBanner message={err} />}
      {result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
            <p className="text-xs uppercase tracking-wider text-slate-400">Before</p>
            <p className="font-display text-xl font-bold text-slate-900">{formatBytes(result.before)}</p>
          </div>
          <div className="rounded-xl bg-accent-50 p-4 ring-1 ring-accent-100">
            <p className="text-xs uppercase tracking-wider text-accent-700">After</p>
            <p className="font-display text-xl font-bold text-accent-800">{formatBytes(result.after)}</p>
            <p className="text-xs text-accent-700">{result.after < result.before ? `${Math.round((1 - result.after / result.before) * 100)}% smaller` : ''}</p>
          </div>
          <div className="col-span-2"><img src={result.url} alt="preview" className="mx-auto max-h-64 rounded-xl ring-1 ring-slate-200" /></div>
        </div>
      )}
      <div className="flex justify-end">
        <DownloadButton onClick={run} disabled={!file || busy} label={busy ? 'Compressing…' : 'Compress & Download'} />
      </div>
    </div>
  );
}

export function ImageConverter(_: { tool: Tool }) {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [bg, setBg] = useState('#ffffff');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const url = URL.createObjectURL(file);
      const img = await loadImage(url);
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      if (target === 'image/jpeg' || target === 'image/webp') {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const ext = target === 'image/png' ? 'png' : target === 'image/jpeg' ? 'jpg' : 'webp';
      canvas.toBlob(
        (blob) => {
          if (blob) saveBlob(blob, file.name.replace(/\.(png|jpe?g|webp|gif|bmp)$/i, '') + '.' + ext);
          setBusy(false);
        },
        target,
        0.92
      );
    } catch {
      setErr('Could not convert this image.');
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="image/*" onFiles={(f) => setFile(f[0])} label={file ? file.name : 'Select an image'} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Convert to</label>
          <select className="input" value={target} onChange={(e) => setTarget(e.target.value as any)}>
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
        {(target === 'image/jpeg' || target === 'image/webp') && (
          <div>
            <label className="label">Background (for transparency)</label>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-11 w-full rounded-xl border-0 ring-1 ring-slate-200" />
          </div>
        )}
      </div>
      {err && <ErrorBanner message={err} />}
      <div className="flex justify-end">
        <DownloadButton onClick={run} disabled={!file || busy} label={busy ? 'Converting…' : 'Convert & Download'} />
      </div>
    </div>
  );
}

export function VideoCompressor(_: { tool: Tool }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState<{ before: number; after: number } | null>(null);

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setErr('');
    setResult(null);
    try {
      // Use the MediaRecorder + canvas pipeline to re-encode at lower bitrate.
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = url;
      video.muted = true;
      await new Promise((res) => {
        video.onloadedmetadata = res;
      });
      await video.play();
      const canvas = document.createElement('canvas');
      // Scale down to 85% to reduce size
      const scale = 0.85;
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      const ctx = canvas.getContext('2d')!;

      const stream = canvas.captureStream(24);
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 1_500_000 });
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      const done = new Promise<Blob>((res) => {
        rec.onstop = () => res(new Blob(chunks, { type: 'video/webm' }));
      });
      rec.start();
      const duration = video.duration;
      const start = performance.now();
      await new Promise<void>((res) => {
        const tick = () => {
          if (video.currentTime >= duration || performance.now() - start > 60000) {
            res();
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(tick);
        };
        tick();
      });
      video.pause();
      rec.stop();
      const blob = await done;
      URL.revokeObjectURL(url);
      saveBlob(blob, file.name.replace(/\.[^.]+$/, '') + '-compressed.webm');
      setResult({ before: file.size, after: blob.size });
    } catch {
      setErr('Could not compress this video in the browser.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="video/*" onFiles={(f) => setFile(f[0])} label={file ? file.name : 'Select a video'} hint="Re-encodes to a smaller WebM in your browser" />
      {err && <ErrorBanner message={err} />}
      {result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-100">
            <p className="text-xs uppercase tracking-wider text-slate-400">Before</p>
            <p className="font-display text-xl font-bold">{formatBytes(result.before)}</p>
          </div>
          <div className="rounded-xl bg-accent-50 p-4 ring-1 ring-accent-100">
            <p className="text-xs uppercase tracking-wider text-accent-700">After</p>
            <p className="font-display text-xl font-bold text-accent-800">{formatBytes(result.after)}</p>
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <DownloadButton onClick={run} disabled={!file || busy} label={busy ? 'Compressing…' : 'Compress & Download'} />
      </div>
    </div>
  );
}

export function VideoToAudio(_: { tool: Tool }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = url;
      video.muted = false;
      await new Promise((res) => (video.onloadedmetadata = res));
      // Capture audio track
      // @ts-expect-error captureStream exists on HTMLMediaElement in browsers
      const stream: MediaStream = video.captureStream ? video.captureStream() : (video as any).mozCaptureStream();
      const audioTracks = stream.getAudioTracks();
      if (!audioTracks.length) {
        setErr('This video has no audio track.');
        setBusy(false);
        return;
      }
      const audioStream = new MediaStream(audioTracks);
      const rec = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      const done = new Promise<Blob>((res) => (rec.onstop = () => res(new Blob(chunks, { type: 'audio/webm' }))));
      rec.start();
      await video.play();
      await new Promise((res) => (video.onended = res));
      rec.stop();
      URL.revokeObjectURL(url);
      saveBlob(await done, file.name.replace(/\.[^.]+$/, '') + '.weba');
    } catch {
      setErr('Could not extract audio from this video.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="video/*" onFiles={(f) => setFile(f[0])} label={file ? file.name : 'Select a video'} />
      {err && <ErrorBanner message={err} />}
      <div className="flex justify-end">
        <DownloadButton onClick={run} disabled={!file || busy} label={busy ? 'Extracting…' : 'Extract Audio'} />
      </div>
    </div>
  );
}

export function AudioCutter(_: { tool: Tool }) {
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [dur, setDur] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!file) return;
    const u = URL.createObjectURL(file);
    setUrl(u);
    const a = new Audio(u);
    a.onloadedmetadata = () => {
      setDur(a.duration);
      setEnd(a.duration);
    };
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const audioCtx = new AudioContext();
      const buf = await file.arrayBuffer();
      const decoded = await audioCtx.decodeAudioData(buf);
      const sr = decoded.sampleRate;
      const startS = Math.max(0, start);
      const endS = Math.min(dur, end);
      const startSample = Math.floor(startS * sr);
      const endSample = Math.floor(endS * sr);
      const len = endSample - startSample;
      const out = audioCtx.createBuffer(decoded.numberOfChannels, len, sr);
      for (let ch = 0; ch < decoded.numberOfChannels; ch++) {
        const src = decoded.getChannelData(ch).subarray(startSample, endSample);
        out.copyToChannel(src, ch);
      }
      const wav = audioBufferToWav(out);
      saveBlob(new Blob([wav], { type: 'audio/wav' }), file.name.replace(/\.[^.]+$/, '') + '-cut.wav');
      audioCtx.close();
    } catch {
      setErr('Could not cut this audio file.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="audio/*" onFiles={(f) => setFile(f[0])} label={file ? file.name : 'Select an audio file'} />
      {url && <audio ref={audioRef} src={url} controls className="w-full" />}
      {dur > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start: {start.toFixed(1)}s</label>
            <input type="range" min={0} max={dur} step={0.1} value={start} onChange={(e) => setStart(+e.target.value)} className="w-full accent-brand-600" />
          </div>
          <div>
            <label className="label">End: {end.toFixed(1)}s</label>
            <input type="range" min={0} max={dur} step={0.1} value={end} onChange={(e) => setEnd(+e.target.value)} className="w-full accent-brand-600" />
          </div>
        </div>
      )}
      {err && <ErrorBanner message={err} />}
      <div className="flex justify-end">
        <DownloadButton onClick={run} disabled={!file || busy || end <= start} label={busy ? 'Cutting…' : 'Cut & Download'} />
      </div>
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

// 16-bit PCM WAV encoder
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numCh = buffer.numberOfChannels;
  const sr = buffer.sampleRate;
  const samples = buffer.length;
  const blockAlign = numCh * 2;
  const dataSize = samples * blockAlign;
  const buf = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buf);
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numCh, true);
  view.setUint32(24, sr, true);
  view.setUint32(28, sr * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);
  let off = 44;
  const channels: Float32Array[] = [];
  for (let c = 0; c < numCh; c++) channels.push(buffer.getChannelData(c));
  for (let i = 0; i < samples; i++) {
    for (let c = 0; c < numCh; c++) {
      let s = Math.max(-1, Math.min(1, channels[c][i]));
      s = s < 0 ? s * 0x8000 : s * 0x7fff;
      view.setInt16(off, s, true);
      off += 2;
    }
  }
  return buf;
}

// ============ NEW MEDIA TOOLS ============

export function ImageResizer(_: { tool: Tool }) {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lock, setLock] = useState(true);
  const [ratio, setRatio] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [preview, setPreview] = useState('');

  const onFiles = (files: File[]) => {
    const f = files[0];
    setFile(f);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
      setRatio(img.width / img.height);
      setPreview(url);
    };
    img.src = url;
  };

  const onW = (w: number) => {
    setWidth(w);
    if (lock) setHeight(Math.round(w / ratio));
  };
  const onH = (h: number) => {
    setHeight(h);
    if (lock) setWidth(Math.round(h * ratio));
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const url = URL.createObjectURL(file);
      const img = await loadImage(url);
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (blob) saveBlob(blob, file.name.replace(/\.[^.]+$/, '') + `-${width}x${height}.png`);
        setBusy(false);
      }, 'image/png');
    } catch {
      setErr('Could not resize this image.');
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="image/*" onFiles={onFiles} label={file ? file.name : 'Select an image'} />
      {preview && <img src={preview} alt="preview" className="mx-auto max-h-48 rounded-xl ring-1 ring-slate-200" />}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Width (px)</label>
          <input type="number" className="input" value={width} onChange={(e) => onW(+e.target.value || 1)} />
        </div>
        <div>
          <label className="label">Height (px)</label>
          <input type="number" className="input" value={height} onChange={(e) => onH(+e.target.value || 1)} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} className="accent-brand-600 h-4 w-4" />
        Lock aspect ratio
      </label>
      {err && <ErrorBanner message={err} />}
      <div className="flex justify-end">
        <DownloadButton onClick={run} disabled={!file || busy} label={busy ? 'Resizing…' : 'Resize & Download'} />
      </div>
    </div>
  );
}

export function ImageToBase64(_: { tool: Tool }) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setErr('');
    try {
      const reader = new FileReader();
      reader.onload = () => setResult(reader.result as string);
      reader.onerror = () => setErr('Could not read this file.');
      reader.readAsDataURL(file);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="image/*" onFiles={(f) => setFile(f[0])} label={file ? file.name : 'Select an image'} />
      <button onClick={run} disabled={!file || busy} className="btn-primary">{busy ? 'Converting…' : 'Convert to Base64'}</button>
      {err && <ErrorBanner message={err} />}
      {result && (
        <>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <img src={result} alt="preview" className="h-16 w-16 rounded-lg object-cover" />
            <span className="text-sm text-slate-500">{Math.round(result.length / 1024)} KB of base64 data</span>
          </div>
          <textarea className="input min-h-[160px] font-mono text-xs" readOnly value={result} />
          <div className="flex justify-end"><CopyButton text={result} label="Copy Base64" /></div>
        </>
      )}
    </div>
  );
}

export function ColorPaletteGenerator(_: { tool: Tool }) {
  const [base, setBase] = useState('#2470f5');
  const [mode, setMode] = useState<'analogous' | 'complementary' | 'triadic' | 'monochrome' | 'split'>('analogous');

  const palette = useMemo(() => {
    const hsl = hexToHsl(base);
    const arr: { h: number; s: number; l: number }[] = [];
    switch (mode) {
      case 'analogous':
        for (let d = -60; d <= 60; d += 20) arr.push({ h: (hsl.h + d + 360) % 360, s: hsl.s, l: hsl.l });
        break;
      case 'complementary':
        arr.push(hsl, { h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l });
        for (let l = 20; l <= 80; l += 15) arr.push({ h: hsl.h, s: hsl.s, l });
        break;
      case 'triadic':
        arr.push(hsl, { h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l }, { h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l });
        break;
      case 'monochrome':
        for (let l = 15; l <= 85; l += 10) arr.push({ h: hsl.h, s: hsl.s, l });
        break;
      case 'split':
        arr.push(hsl, { h: (hsl.h + 150) % 360, s: hsl.s, l: hsl.l }, { h: (hsl.h + 210) % 360, s: hsl.s, l: hsl.l });
        break;
    }
    return arr.map(hslToHex);
  }, [base, mode]);

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Base color</label>
          <input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="h-12 w-full rounded-xl ring-1 ring-slate-200" />
        </div>
        <div>
          <label className="label">Harmony</label>
          <select className="input" value={mode} onChange={(e) => setMode(e.target.value as any)}>
            <option value="analogous">Analogous</option>
            <option value="complementary">Complementary</option>
            <option value="triadic">Triadic</option>
            <option value="monochrome">Monochrome</option>
            <option value="split">Split-complementary</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {palette.map((hex, i) => (
          <div key={i} className="group cursor-pointer" onClick={() => { navigator.clipboard.writeText(hex); }}>
            <div className="h-24 w-24 rounded-xl ring-1 ring-slate-200 transition group-hover:scale-105" style={{ backgroundColor: hex }} />
            <p className="mt-1.5 text-center text-xs font-mono text-slate-600 group-hover:text-brand-600">{hex.toUpperCase()}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400">Click any swatch to copy its hex code.</p>
    </div>
  );
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
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

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  return '#' + [f(0), f(8), f(4)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function GradientGenerator(_: { tool: Tool }) {
  const [c1, setC1] = useState('#2470f5');
  const [c2, setC2] = useState('#10b981');
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<'linear' | 'radial'>('linear');

  const css = type === 'linear'
    ? `linear-gradient(${angle}deg, ${c1}, ${c2})`
    : `radial-gradient(circle, ${c1}, ${c2})`;

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Color 1</label>
          <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="h-12 w-full rounded-xl ring-1 ring-slate-200" />
        </div>
        <div>
          <label className="label">Color 2</label>
          <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="h-12 w-full rounded-xl ring-1 ring-slate-200" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Type</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>
        {type === 'linear' && (
          <div>
            <label className="label">Angle: {angle}°</label>
            <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-full accent-brand-600" />
          </div>
        )}
      </div>
      <div className="h-48 rounded-2xl ring-1 ring-slate-200" style={{ background: css }} />
      <div className="rounded-xl bg-slate-900 p-4 font-mono text-sm text-accent-300 break-all">
        background: {css};
      </div>
      <div className="flex justify-end"><CopyButton text={`background: ${css};`} label="Copy CSS" /></div>
    </div>
  );
}

const FONTS = [
  'Inter, sans-serif', 'Georgia, serif', '"Courier New", monospace', 'Impact, sans-serif',
  '"Times New Roman", serif', 'Arial, sans-serif', '"Trebuchet MS", sans-serif', 'Verdana, sans-serif',
  'cursive', 'fantasy',
];

export function FontPreviewer(_: { tool: Tool }) {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog');
  const [size, setSize] = useState(32);

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Preview text</label>
          <input className="input" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          <label className="label">Size: {size}px</label>
          <input type="range" min={12} max={72} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-brand-600" />
        </div>
      </div>
      <div className="space-y-3">
        {FONTS.map((font) => (
          <div key={font} className="rounded-xl bg-white p-4 ring-1 ring-slate-100">
            <div className="mb-1 text-xs font-medium text-slate-400">{font.split(',')[0].replace(/"/g, '')}</div>
            <p style={{ fontFamily: font, fontSize: size }} className="text-slate-900 break-words">{text || ' '}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FaviconGenerator(_: { tool: Tool }) {
  const [text, setText] = useState('GL');
  const [bg, setBg] = useState('#2470f5');
  const [fg, setFg] = useState('#ffffff');
  const [size, setSize] = useState(64);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = fg;
    ctx.font = `bold ${size * 0.5}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.slice(0, 3), size / 2, size / 2 + 1);
  }, [text, bg, fg, size]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) saveBlob(blob, 'favicon.png');
    }, 'image/png');
  };

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Text / initials</label>
          <input className="input" value={text} onChange={(e) => setText(e.target.value)} maxLength={3} />
        </div>
        <div>
          <label className="label">Size: {size}px</label>
          <input type="range" min={16} max={256} step={16} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-brand-600" />
        </div>
        <div>
          <label className="label">Background</label>
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-11 w-full rounded-xl ring-1 ring-slate-200" />
        </div>
        <div>
          <label className="label">Text color</label>
          <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-11 w-full rounded-xl ring-1 ring-slate-200" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <canvas ref={canvasRef} width={size} height={size} className="rounded-xl ring-1 ring-slate-200" style={{ imageRendering: 'pixelated' }} />
        <DownloadButton onClick={download} label="Download PNG" />
      </div>
    </div>
  );
}

export function GifMaker(_: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [delay, setDelay] = useState(300);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [preview, setPreview] = useState('');

  const run = async () => {
    if (files.length < 2) return;
    setBusy(true);
    setErr('');
    try {
      // Simple animated GIF encoder using canvas frames
      const frames: { data: Uint8ClampedArray; w: number; h: number }[] = [];
      let minW = Infinity, minH = Infinity;
      for (const f of files) {
        const url = URL.createObjectURL(f);
        const img = await loadImage(url);
        URL.revokeObjectURL(url);
        minW = Math.min(minW, img.width);
        minH = Math.min(minH, img.height);
      }
      for (const f of files) {
        const url = URL.createObjectURL(f);
        const img = await loadImage(url);
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = minW;
        canvas.height = minH;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, minW, minH);
        frames.push({ data: ctx.getImageData(0, 0, minW, minH).data, w: minW, h: minH });
      }
      const gif = encodeGif(frames, delay);
      const blob = new Blob([gif], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      setPreview(url);
      saveBlob(blob, 'animation.gif');
    } catch {
      setErr('Could not create GIF from these images.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="image/*" multiple onFiles={setFiles} label="Select at least 2 images" hint="Each image becomes a frame" />
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <img key={i} src={URL.createObjectURL(f)} alt="" className="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-200" />
          ))}
        </div>
      )}
      <div>
        <label className="label">Frame delay: {delay}ms</label>
        <input type="range" min={50} max={2000} step={50} value={delay} onChange={(e) => setDelay(+e.target.value)} className="w-full accent-brand-600" />
      </div>
      {err && <ErrorBanner message={err} />}
      {preview && <img src={preview} alt="GIF preview" className="mx-auto rounded-xl ring-1 ring-slate-200" />}
      <div className="flex justify-end">
        <DownloadButton onClick={run} disabled={files.length < 2 || busy} label={busy ? 'Encoding…' : 'Create GIF'} />
      </div>
    </div>
  );
}

// Minimal GIF encoder (supports up to 256 colors per frame with LZW)
function encodeGif(frames: { data: Uint8ClampedArray; w: number; h: number }[], delay: number): ArrayBuffer {
  const w = frames[0].w, h = frames[0].h;
  const buf = new ArrayBuffer(1024 * 1024 * 10);
  const view = new DataView(buf);
  let pos = 0;
  const write = (b: number) => { view.setUint8(pos++, b); };
  const writeStr = (s: string) => { for (let i = 0; i < s.length; i++) write(s.charCodeAt(i)); };

  writeStr('GIF89a');
  view.setUint16(6, w, true);
  view.setUint16(8, h, true);
  write(0x80); write(0); write(0);
  // Global palette - 256 colors grayscale
  for (let i = 0; i < 256; i++) { write(i); write(i); write(i); }

  // Application extension for animation
  write(0x21); write(0xFF); write(11);
  writeStr('NETSCAPE2.0'); write(3); write(1); write(0); write(0);

  for (let f = 0; f < frames.length; f++) {
    // Graphic Control Extension
    write(0x21); write(0xF9); write(4);
    write(0); // packed
    view.setUint16(pos, delay / 10, true); pos += 2;
    write(0); write(0);
    // Image Descriptor
    write(0x2C);
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, w, true); pos += 2;
    view.setUint16(pos, h, true); pos += 2;
    write(0);
    // Image data - quantize to grayscale + LZW
    const px = frames[f].data;
    const indices = new Uint8Array(w * h);
    for (let i = 0, j = 0; i < px.length; i += 4, j++) {
      indices[j] = Math.round(0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]);
    }
    write(8); // LZW min code size
    const lzw = lzwEncode(indices, 8);
    for (let i = 0; i < lzw.length; ) {
      const chunk = Math.min(255, lzw.length - i);
      write(chunk);
      for (let k = 0; k < chunk; k++) write(lzw[i++]);
    }
    write(0); // block terminator
  }
  write(0x3B); // trailer

  return buf.slice(0, pos);
}

function lzwEncode(data: Uint8Array, minSize: number): number[] {
  const clearCode = 1 << minSize;
  const endCode = clearCode + 1;
  let dictSize = endCode + 1;
  const dict = new Map<string, number>();
  const out: number[] = [];
  let prefix = '';
  const bitStr: number[] = [];
  const codeSize = minSize + 1;

  const emit = (code: number) => {
    for (let i = codeSize - 1; i >= 0; i--) bitStr.push((code >> i) & 1);
  };

  emit(clearCode);
  for (let i = 0; i < data.length; i++) {
    const c = String.fromCharCode(data[i]);
    const combined = prefix + c;
    if (dict.has(combined)) {
      prefix = combined;
    } else {
      emit(prefix ? (dict.get(prefix) ?? data[i]) : data[i]);
      if (dictSize < 4096) { dict.set(combined, dictSize++); }
      prefix = c;
    }
  }
  if (prefix) emit(dict.get(prefix) ?? 0);
  emit(endCode);

  const bytes: number[] = [];
  for (let i = 0; i < bitStr.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8 && i + j < bitStr.length; j++) b |= bitStr[i + j] << (7 - j);
    bytes.push(b);
  }
  return bytes;
}

export function MemeGenerator(_: { tool: Tool }) {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState('');
  const [top, setTop] = useState('TOP TEXT');
  const [bottom, setBottom] = useState('BOTTOM TEXT');
  const [fontSize, setFontSize] = useState(48);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const onFiles = (files: File[]) => {
    const f = files[0];
    setFile(f);
    const url = URL.createObjectURL(f);
    setImgUrl(url);
  };

  useEffect(() => {
    if (!imgUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    img.onload = () => {
      const maxW = 500;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      const drawText = (text: string, y: number) => {
        ctx.strokeText(text, canvas.width / 2, y);
        ctx.fillText(text, canvas.width / 2, y);
      };
      drawText(top.toUpperCase(), fontSize);
      drawText(bottom.toUpperCase(), canvas.height - fontSize * 0.3);
    };
    img.src = imgUrl;
  }, [imgUrl, top, bottom, fontSize]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) saveBlob(blob, 'meme.png');
    }, 'image/png');
  };

  return (
    <div className="space-y-4">
      <FileDrop accept="image/*" onFiles={onFiles} label={file ? file.name : 'Select a background image'} />
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label">Top text</label><input className="input" value={top} onChange={(e) => setTop(e.target.value)} /></div>
        <div><label className="label">Bottom text</label><input className="input" value={bottom} onChange={(e) => setBottom(e.target.value)} /></div>
      </div>
      <div>
        <label className="label">Font size: {fontSize}px</label>
        <input type="range" min={20} max={80} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-brand-600" />
      </div>
      {imgUrl && (
        <div className="flex flex-col items-center gap-4">
          <canvas ref={canvasRef} className="max-w-full rounded-xl ring-1 ring-slate-200" />
          <DownloadButton onClick={download} label="Download Meme" />
        </div>
      )}
    </div>
  );
}
