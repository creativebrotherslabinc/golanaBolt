import { useState, useMemo } from 'react';
import { CopyButton, ResultBox } from '../tool-ui';
import { Plus, Trash2, X } from 'lucide-react';
import type { Tool } from '../catalog';

// ============ Headline Generator ============
const HEADLINE_TEMPLATES = [
  '{n} Ways to {benefit} Without {obstacle}',
  'The Ultimate Guide to {topic}',
  'How to {action} in {n} Minutes',
  '{n} {topic} Mistakes You\'re Probably Making',
  'Why {topic} Is More Important Than You Think',
  'The Secret to {benefit} That Nobody Talks About',
  '{n} Proven Strategies for {benefit}',
  'Stop Wasting Time on {topic}: Do This Instead',
  'Everything You Need to Know About {topic}',
  'The {n}-Step Formula for {benefit}',
  'How {topic} Can Transform Your Life',
  '{n} Things I Wish I Knew About {topic} Sooner',
];

export function HeadlineGenerator(_: { tool: Tool }) {
  const [topic, setTopic] = useState('content marketing');
  const [benefit, setBenefit] = useState('grow your audience');
  const [obstacle, setObstacle] = useState('spending a fortune');
  const [action, setAction] = useState('write a blog post');
  const [n, setN] = useState(7);
  const [seed, setSeed] = useState(0);

  const headlines = useMemo(() => {
    const vars: Record<string, string> = { topic, benefit, obstacle, action, n: String(n) };
    const shuffled = [...HEADLINE_TEMPLATES].sort(() => Math.random() - 0.5 + seed * 0.001);
    return shuffled.slice(0, 8).map((t) => t.replace(/\{(\w+)\}/g, (_, k) => vars[k] || `{${k}}`));
  }, [topic, benefit, obstacle, action, n, seed]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Topic</label>
          <input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>
        <div>
          <label className="label">Benefit / Goal</label>
          <input className="input" value={benefit} onChange={(e) => setBenefit(e.target.value)} />
        </div>
        <div>
          <label className="label">Obstacle</label>
          <input className="input" value={obstacle} onChange={(e) => setObstacle(e.target.value)} />
        </div>
        <div>
          <label className="label">Action</label>
          <input className="input" value={action} onChange={(e) => setAction(e.target.value)} />
        </div>
        <div>
          <label className="label">Number</label>
          <input type="number" min={3} max={50} className="input" value={n} onChange={(e) => setN(Math.max(1, +e.target.value || 7))} />
        </div>
      </div>
      <button onClick={() => setSeed(seed + 1)} className="btn-secondary w-full">Generate new headlines</button>
      <div className="space-y-2">
        {headlines.map((h, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <p className="text-sm font-medium text-slate-800 flex-1">{h}</p>
            <CopyButton text={h} label="" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Emoji Decorator ============
const EMOJI_SETS: Record<string, string[]> = {
  Sparkle: ['✨', '🌟', '💫', '⭐', '🌙', '☀️'],
  Nature: ['🌿', '🌸', '🍃', '🌺', '🌻', '🌷'],
  Party: ['🎉', '🎊', '🎈', '🥳', '🎁', '🏆'],
  Love: ['❤️', '💕', '💖', '💗', '💓', '💝'],
  Cool: ['😎', '🔥', '💯', '✅', '⚡', '💎'],
  Food: ['🍕', '🍔', '🌮', '🍰', '☕', '🍩'],
  Tech: ['💻', '📱', '🚀', '🤖', '⚙️', '🔗'],
  Travel: ['✈️', '🌍', '🗺️', '🏖️', '🏔️', '🧳'],
};

export function EmojiDecorator(_: { tool: Tool }) {
  const [text, setText] = useState('Hello world, this is amazing!');
  const [set, setSet] = useState('Sparkle');
  const [mode, setMode] = useState<'surround' | 'between' | 'start' | 'end'>('surround');

  const result = useMemo(() => {
    const emojis = EMOJI_SETS[set];
    if (!text.trim()) return '';
    if (mode === 'surround') return `${emojis[0]} ${text} ${emojis[1]}`;
    if (mode === 'start') return `${emojis[0]} ${text}`;
    if (mode === 'end') return `${text} ${emojis[0]}`;
    const words = text.split(' ');
    return words.map((w, i) => `${w} ${emojis[i % emojis.length]}`).join(' ');
  }, [text, set, mode]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Your text</label>
        <textarea className="input min-h-[80px]" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div>
        <label className="label">Emoji set</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(EMOJI_SETS).map((s) => (
            <button key={s} onClick={() => setSet(s)} className={set === s ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>
              {s} {EMOJI_SETS[s][0]}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Decoration style</label>
        <div className="flex flex-wrap gap-2">
          {(['surround', 'between', 'start', 'end'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={mode === m ? 'btn-primary text-sm capitalize' : 'btn-secondary text-sm capitalize'}>{m}</button>
          ))}
        </div>
      </div>
      <ResultBox>
        <p className="text-sm text-slate-800 break-words">{result}</p>
      </ResultBox>
      <div className="flex justify-end">
        <CopyButton text={result} />
      </div>
    </div>
  );
}

// ============ Text Divider Generator ============
const DIVIDER_STYLES: { name: string; render: () => string }[] = [
  { name: 'Stars', render: () => '✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦' },
  { name: 'Dots', render: () => '· · · · · · · · · · · · · · · · ·' },
  { name: 'Dashes', render: () => '———————————————————————————' },
  { name: 'Equals', render: () => '═════════════════════════════' },
  { name: 'Waves', render: () => '〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜〜' },
  { name: 'Leaves', render: () => '🌿 🌿 🌿 🌿 🌿 🌿 🌿 🌿 🌿' },
  { name: 'Hearts', render: () => '♡ ♡ ♡ ♡ ♡ ♡ ♡ ♡ ♡ ♡ ♡ ♡ ♡' },
  { name: 'Diamonds', render: () => '◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆ ◆' },
  { name: 'Flowers', render: () => '✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿' },
  { name: 'Arrows', render: () => '➤ ➤ ➤ ➤ ➤ ➤ ➤ ➤ ➤ ➤ ➤ ➤ ➤' },
  { name: 'Ornate', render: () => '❧ ━━━━━━━━━━━━━━━━━ ❧' },
  { name: 'Minimal', render: () => '— — — — — — — — — —' },
];

export function TextDividerGenerator(_: { tool: Tool }) {
  const [selected, setSelected] = useState(0);
  const [custom, setCustom] = useState('');
  const [repeat, setRepeat] = useState(10);

  const divider = useMemo(() => {
    if (custom.trim()) return Array(Math.max(1, Math.min(50, repeat))).fill(custom.trim()).join(' ');
    return DIVIDER_STYLES[selected].render();
  }, [selected, custom, repeat]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {DIVIDER_STYLES.map((d, i) => (
          <button key={i} onClick={() => { setSelected(i); setCustom(''); }} className={selected === i && !custom ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>{d.name}</button>
        ))}
      </div>
      <div>
        <label className="label">Or use a custom symbol</label>
        <input className="input max-w-[120px]" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="★" maxLength={3} />
      </div>
      {custom.trim() && (
        <div>
          <label className="label">Repeat count</label>
          <input type="number" min={1} max={50} className="input max-w-[100px]" value={repeat} onChange={(e) => setRepeat(Math.max(1, Math.min(50, +e.target.value || 10)))} />
        </div>
      )}
      <ResultBox>
        <p className="text-center text-lg text-slate-800 break-all">{divider}</p>
      </ResultBox>
      <div className="flex justify-end">
        <CopyButton text={divider} />
      </div>
    </div>
  );
}

// ============ Social Bio Generator ============
const BIO_TEMPLATES = [
  '{role} at {company} | Helping you {benefit} | {hobby} enthusiast 📍 {location}',
  '✨ {role} & {hobby} lover\n🎯 {benefit}\n📍 {location}\n🔗 {link}',
  'Helping people {benefit} through {role}\n{hobby} addict | {location} based\n{link}',
  '{role} by day, {hobby} by night 🌙\nOn a mission to {benefit}\n📍 {location}',
  'Just a {personality} {role} who loves {hobby}\nLet me help you {benefit}\n📍 {location} | {link}',
  '{benefit} → that\'s my thing.\n{role} | {hobby} | {location}\n{link}',
];

export function SocialBioGenerator(_: { tool: Tool }) {
  const [role, setRole] = useState('Content Creator');
  const [company, setCompany] = useState('Self-employed');
  const [benefit, setBenefit] = useState('grow online');
  const [hobby, setHobby] = useState('coffee');
  const [location, setLocation] = useState('New York');
  const [link, setLink] = useState('linktr.ee/me');
  const [personality, setPersonality] = useState('passionate');
  const [platform, setPlatform] = useState<'instagram' | 'twitter' | 'linkedin' | 'tiktok'>('instagram');
  const [seed, setSeed] = useState(0);

  const maxLen: Record<string, number> = { instagram: 150, twitter: 160, linkedin: 220, tiktok: 80 };
  const limit = maxLen[platform];

  const bios = useMemo(() => {
    const vars: Record<string, string> = { role, company, benefit, hobby, location, link, personality };
    const shuffled = [...BIO_TEMPLATES].sort(() => Math.random() - 0.5 + seed * 0.001);
    return shuffled.slice(0, 4).map((t) => t.replace(/\{(\w+)\}/g, (_, k) => vars[k] || `{${k}}`));
  }, [role, company, benefit, hobby, location, link, personality, seed]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Platform</label>
        <div className="flex flex-wrap gap-2">
          {(['instagram', 'twitter', 'linkedin', 'tiktok'] as const).map((p) => (
            <button key={p} onClick={() => setPlatform(p)} className={platform === p ? 'btn-primary text-sm capitalize' : 'btn-secondary text-sm capitalize'}>{p}</button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-1">Max {limit} characters</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="label">Role / Title</label><input className="input" value={role} onChange={(e) => setRole(e.target.value)} /></div>
        <div><label className="label">Company</label><input className="input" value={company} onChange={(e) => setCompany(e.target.value)} /></div>
        <div><label className="label">Benefit / Mission</label><input className="input" value={benefit} onChange={(e) => setBenefit(e.target.value)} /></div>
        <div><label className="label">Hobby / Interest</label><input className="input" value={hobby} onChange={(e) => setHobby(e.target.value)} /></div>
        <div><label className="label">Location</label><input className="input" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
        <div><label className="label">Link</label><input className="input" value={link} onChange={(e) => setLink(e.target.value)} /></div>
        <div><label className="label">Personality word</label><input className="input" value={personality} onChange={(e) => setPersonality(e.target.value)} /></div>
      </div>
      <button onClick={() => setSeed(seed + 1)} className="btn-secondary w-full">Generate new bios</button>
      <div className="space-y-2">
        {bios.map((b, i) => {
          const over = b.length > limit;
          return (
            <div key={i} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <p className="text-sm text-slate-800 whitespace-pre-line">{b}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs ${over ? 'text-rose-500' : 'text-slate-400'}`}>{b.length} / {limit}</span>
                <CopyButton text={b} label="" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ Hashtag Generator ============
const HASHTAG_CATEGORIES: Record<string, string[]> = {
  'General': ['love', 'instagood', 'photooftheday', 'fashion', 'beautiful', 'happy', 'cute', 'tbt', 'followme', 'picoftheday', 'follow', 'me', 'selfie', 'summer', 'art', 'instadaily', 'friends', 'repost', 'nature', 'girl', 'fun'],
  'Business': ['entrepreneur', 'smallbusiness', 'businessowner', 'marketing', 'startup', 'success', 'hustle', 'businesswoman', 'businessman', 'growth', 'leadership', 'networking', 'branding', 'digitalmarketing', 'socialmedia', 'contentmarketing', 'strategy', 'motivation', 'inspiration', 'mindset'],
  'Fitness': ['fitness', 'gym', 'workout', 'fit', 'health', 'healthylifestyle', 'training', 'motivation', 'cardio', 'muscle', 'strength', 'bodybuilding', 'crossfit', 'yoga', 'running', 'weightloss', 'nutrition', 'wellness', 'active', 'sweat'],
  'Food': ['food', 'foodie', 'instafood', 'foodporn', 'foodphotography', 'foodstagram', 'yummy', 'delicious', 'homemade', 'cooking', 'baking', 'recipe', 'foodblogger', 'healthyfood', 'foodlover', 'tasty', 'dinner', 'breakfast', 'dessert', 'chef'],
  'Travel': ['travel', 'travelgram', 'wanderlust', 'adventure', 'explore', 'vacation', 'traveling', 'travelphotography', 'trip', 'journey', 'nature', 'landscape', 'sunset', 'beach', 'mountains', 'city', 'culture', 'wanderer', 'globetrotter', 'travelblogger'],
  'Tech': ['tech', 'technology', 'coding', 'programming', 'developer', 'software', 'ai', 'innovation', 'startup', 'digital', 'cybersecurity', 'datascience', 'machinelearning', 'webdev', 'python', 'javascript', 'react', 'cloud', 'devops', 'tech4good'],
};

export function HashtagGenerator(_: { tool: Tool }) {
  const [keyword, setKeyword] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>(['General']);
  const [count, setCount] = useState(15);

  const toggleCat = (cat: string) => {
    setSelectedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const hashtags = useMemo(() => {
    let pool: string[] = [];
    selectedCats.forEach((c) => { pool = [...pool, ...(HASHTAG_CATEGORIES[c] || [])]; });
    const kw = keyword.trim().toLowerCase().replace(/\s+/g, '');
    if (kw) pool = [kw, `${kw}life`, `${kw}lover`, `${kw}daily`, ...pool];
    const unique = [...new Set(pool)];
    return unique.slice(0, count);
  }, [keyword, selectedCats, count]);

  const hashtagStr = hashtags.map((h) => `#${h}`).join(' ');

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Keyword (optional)</label>
        <input className="input" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. coffee, travel, fitness" />
      </div>
      <div>
        <label className="label">Categories</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(HASHTAG_CATEGORIES).map((cat) => (
            <button key={cat} onClick={() => toggleCat(cat)} className={selectedCats.includes(cat) ? 'btn-primary text-sm' : 'btn-secondary text-sm'}>{cat}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Number of hashtags</label>
        <input type="number" min={5} max={30} className="input max-w-[100px]" value={count} onChange={(e) => setCount(Math.max(5, Math.min(30, +e.target.value || 15)))} />
      </div>
      <ResultBox>
        <p className="text-sm font-mono text-slate-800 break-words">{hashtagStr}</p>
      </ResultBox>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{hashtags.length} hashtags</span>
        <CopyButton text={hashtagStr} />
      </div>
    </div>
  );
}

// ============ List Formatter ============
export function ListFormatter(_: { tool: Tool }) {
  const [text, setText] = useState('apple\nbanana\ncherry\ndate');
  const [style, setStyle] = useState<'numbered' | 'bullet' | 'dash' | 'comma' | 'pipe' | 'json' | 'html'>('numbered');
  const [sort, setSort] = useState<'none' | 'asc' | 'desc' | 'len'>('none');
  const [dedupe, setDedupe] = useState(false);
  const [trim, setTrim] = useState(true);

  const result = useMemo(() => {
    let items = text.split('\n');
    if (trim) items = items.map((s) => s.trim()).filter(Boolean);
    if (dedupe) items = [...new Set(items)];
    if (sort === 'asc') items.sort((a, b) => a.localeCompare(b));
    else if (sort === 'desc') items.sort((a, b) => b.localeCompare(a));
    else if (sort === 'len') items.sort((a, b) => a.length - b.length);

    switch (style) {
      case 'numbered': return items.map((it, i) => `${i + 1}. ${it}`).join('\n');
      case 'bullet': return items.map((it) => `• ${it}`).join('\n');
      case 'dash': return items.map((it) => `- ${it}`).join('\n');
      case 'comma': return items.join(', ');
      case 'pipe': return items.join(' | ');
      case 'json': return JSON.stringify(items, null, 2);
      case 'html': return items.map((it) => `<li>${it}</li>`).join('\n');
    }
  }, [text, style, sort, dedupe, trim]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Input (one item per line)</label>
        <textarea className="input min-h-[120px] font-mono text-sm" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Output style</label>
          <select className="input" value={style} onChange={(e) => setStyle(e.target.value as 'numbered' | 'bullet' | 'dash' | 'comma' | 'pipe' | 'json' | 'html')}>
            <option value="numbered">Numbered (1. 2. 3.)</option>
            <option value="bullet">Bullets (•)</option>
            <option value="dash">Dashes (-)</option>
            <option value="comma">Comma-separated</option>
            <option value="pipe">Pipe-separated</option>
            <option value="json">JSON array</option>
            <option value="html">HTML list items</option>
          </select>
        </div>
        <div>
          <label className="label">Sort</label>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value as 'none' | 'asc' | 'desc' | 'len')}>
            <option value="none">No sorting</option>
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
            <option value="len">By length</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={dedupe} onChange={(e) => setDedupe(e.target.checked)} className="h-4 w-4 accent-brand-600" /> Remove duplicates
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} className="h-4 w-4 accent-brand-600" /> Trim whitespace
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

// ============ Bullet Point Expander ============
export function BulletPointExpander(_: { tool: Tool }) {
  const [bullets, setBullets] = useState('Write engaging blog posts\nResearch keywords\nOptimize for SEO');
  const [style, setStyle] = useState<'sentence' | 'paragraph' | 'detailed'>('sentence');

  const result = useMemo(() => {
    const items = bullets.split('\n').map((s) => s.trim()).filter(Boolean);
    if (items.length === 0) return '';

    const expand = (bullet: string, idx: number) => {
      const clean = bullet.replace(/^[-•*\d.]+\s*/, '').trim();
      const lower = clean.charAt(0).toLowerCase() + clean.slice(1);

      if (style === 'sentence') {
        const prefix = idx === 0 ? 'First,' : idx === items.length - 1 ? 'Finally,' : 'Next,';
        return `${prefix} you should ${lower}.`;
      }
      if (style === 'paragraph') {
        const connectors = ['To begin with,', 'Additionally,', 'Furthermore,', 'Moreover,', 'In addition to this,'];
        const prefix = idx === 0 ? 'To start,' : idx === items.length - 1 ? 'Ultimately,' : connectors[idx % connectors.length];
        return `${prefix} it is important to ${lower}, as this will help you achieve your goals more effectively.`;
      }
      const intros = ['One key step is to', 'Another important aspect is to', 'It is also crucial to', 'Don\'t forget to', 'A great practice is to'];
      const prefix = idx === 0 ? 'One key step is to' : idx === items.length - 1 ? 'Last but not least, make sure to' : intros[idx % intros.length];
      return `${prefix} ${lower}. This means taking the time to focus on this area, as it can have a significant impact on your overall success. By prioritizing this, you set yourself up for better results.`;
    };

    if (style === 'detailed') return items.map((b, i) => expand(b, i)).join('\n\n');
    return items.map((b, i) => expand(b, i)).join('\n');
  }, [bullets, style]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Bullet points (one per line)</label>
        <textarea className="input min-h-[120px] font-mono text-sm" value={bullets} onChange={(e) => setBullets(e.target.value)} />
      </div>
      <div>
        <label className="label">Expansion style</label>
        <select className="input" value={style} onChange={(e) => setStyle(e.target.value as 'sentence' | 'paragraph' | 'detailed')}>
          <option value="sentence">Short sentences</option>
          <option value="paragraph">Connected paragraph</option>
          <option value="detailed">Detailed expansion</option>
        </select>
      </div>
      <ResultBox>
        <p className="text-sm text-slate-800 whitespace-pre-line">{result}</p>
      </ResultBox>
      <div className="flex justify-end">
        <CopyButton text={result} />
      </div>
    </div>
  );
}
