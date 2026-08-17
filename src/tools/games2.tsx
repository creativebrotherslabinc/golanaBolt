import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Trophy, Play } from 'lucide-react';
import type { Tool } from '../catalog';

// ============ 2048 ============
export function Game2048(_: { tool: Tool }) {
  const SIZE = 4;
  const [grid, setGrid] = useState<number[][]>(init2048);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => +localStorage.getItem('2048-best') || 0);
  const [over, setOver] = useState(false);

  function init2048(): number[][] {
    const g = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    addRandom2048(g); addRandom2048(g);
    return g;
  }
  function addRandom2048(g: number[][]) {
    const empty: [number, number][] = [];
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (!g[r][c]) empty.push([r, c]);
    if (!empty.length) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    g[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
  function slide(row: number[]): [number[], number] {
    let arr = row.filter((v) => v);
    let gained = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) { arr[i] *= 2; gained += arr[i]; arr.splice(i + 1, 1); }
    }
    while (arr.length < SIZE) arr.push(0);
    return [arr, gained];
  }
  function move(dir: 'left' | 'right' | 'up' | 'down') {
    if (over) return;
    const g = grid.map((r) => [...r]);
    let changed = false;
    let gained = 0;
    const cols = dir === 'up' || dir === 'down';
    const rev = dir === 'right' || dir === 'down';
    for (let i = 0; i < SIZE; i++) {
      let line = cols ? g.map((r) => r[i]) : [...g[i]];
      if (rev) line.reverse();
      const [slid, gain] = slide(line);
      gained += gain;
      if (rev) slid.reverse();
      for (let j = 0; j < SIZE; j++) {
        const val = cols ? g[j][i] : g[i][j];
        const newVal = cols ? slid[j] : slid[j];
        if (cols) { if (g[j][i] !== slid[j]) { g[j][i] = slid[j]; changed = true; } }
        else { if (g[i][j] !== slid[j]) { g[i][j] = slid[j]; changed = true; } }
      }
    }
    if (changed) {
      addRandom2048(g);
      setGrid(g);
      const ns = score + gained;
      setScore(ns);
      if (ns > best) { setBest(ns); localStorage.setItem('2048-best', String(ns)); }
      if (!canMove2048(g)) setOver(true);
    }
  }
  function canMove2048(g: number[][]): boolean {
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (!g[r][c]) return true;
      if (c < SIZE - 1 && g[r][c] === g[r][c + 1]) return true;
      if (r < SIZE - 1 && g[r][c] === g[r + 1][c]) return true;
    }
    return false;
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, 'left' | 'right' | 'up' | 'down'> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
      const d = map[e.key];
      if (d) { e.preventDefault(); move(d); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const colors: Record<number, string> = { 0: 'bg-slate-100', 2: 'bg-slate-200 text-slate-700', 4: 'bg-amber-100 text-amber-800', 8: 'bg-orange-200 text-orange-900', 16: 'bg-orange-300 text-white', 32: 'bg-orange-400 text-white', 64: 'bg-rose-400 text-white', 128: 'bg-rose-500 text-white', 256: 'bg-rose-600 text-white', 512: 'bg-brand-500 text-white', 1024: 'bg-brand-600 text-white', 2048: 'bg-brand-700 text-white' };

  const reset = () => { setGrid(init2048()); setScore(0); setOver(false); };

  return (
    <div className="space-y-4 max-w-md mx-auto" onTouchStart={(e) => {
      const t = e.touches[0]; (e.currentTarget as any)._sx = t.clientX; (e.currentTarget as any)._sy = t.clientY;
    }} onTouchEnd={(e) => {
      const t = e.changedTouches[0]; const dx = t.clientX - (e.currentTarget as any)._sx; const dy = t.clientY - (e.currentTarget as any)._sy;
      if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left'); else move(dy > 0 ? 'down' : 'up');
    }}>
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="rounded-xl bg-slate-100 px-4 py-2 text-center"><p className="text-xs text-slate-400">Score</p><p className="font-bold text-lg">{score}</p></div>
          <div className="rounded-xl bg-amber-100 px-4 py-2 text-center"><p className="text-xs text-amber-500">Best</p><p className="font-bold text-lg text-amber-700">{best}</p></div>
        </div>
        <button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /> New</button>
      </div>
      <div className="grid grid-cols-4 gap-2 bg-slate-200 p-2 rounded-2xl">
        {grid.flat().map((v, i) => (
          <div key={i} className={`aspect-square rounded-xl flex items-center justify-center font-bold text-xl transition-all ${colors[v] || 'bg-brand-800 text-white'}`}>
            {v || ''}
          </div>
        ))}
      </div>
      {over && <p className="text-center font-semibold text-rose-500">Game over! Score: {score}</p>}
      <p className="text-center text-xs text-slate-400">Use arrow keys or swipe to move tiles.</p>
    </div>
  );
}

// ============ Snake ============
export function Snake(_: { tool: Tool }) {
  const CELL = 15, GRID = 20;
  const [snake, setSnake] = useState<[number, number][]>([[10, 10], [9, 10], [8, 10]]);
  const [food, setFood] = useState<[number, number]>([15, 10]);
  const [dir, setDir] = useState<[number, number]>([1, 0]);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [running, setRunning] = useState(false);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
      const d = map[e.key];
      if (d) { e.preventDefault(); const cur = dirRef.current; if (d[0] !== -cur[0] || d[1] !== -cur[1]) setDir(d); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!running || over) return;
    const id = setInterval(() => {
      setSnake((s) => {
        const [hx, hy] = s[0];
        const [dx, dy] = dirRef.current;
        const nh: [number, number] = [hx + dx, hy + dy];
        if (nh[0] < 0 || nh[0] >= GRID || nh[1] < 0 || nh[1] >= GRID || s.some(([x, y]) => x === nh[0] && y === nh[1])) {
          setOver(true); setRunning(false); return s;
        }
        const ns = [nh, ...s];
        if (nh[0] === food[0] && nh[1] === food[1]) {
          setScore((sc) => sc + 1);
          let nf: [number, number];
          do { nf = [Math.floor(Math.random() * GRID), Math.floor(Math.random() * GRID)]; } while (ns.some(([x, y]) => x === nf[0] && y === nf[1]));
          setFood(nf);
        } else ns.pop();
        return ns;
      });
    }, 120);
    return () => clearInterval(id);
  }, [running, over, food]);

  const reset = () => { setSnake([[10, 10], [9, 10], [8, 10]]); setFood([15, 10]); setDir([1, 0]); setScore(0); setOver(false); setRunning(true); };

  return (
    <div className="space-y-4 max-w-md mx-auto text-center">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Score: {score}</span>
        <button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /> {over ? 'Restart' : 'New'}</button>
      </div>
      <div className="relative mx-auto bg-slate-900 rounded-2xl overflow-hidden ring-1 ring-slate-300 max-w-full" style={{ width: CELL * GRID, height: CELL * GRID, aspectRatio: '1 / 1' }}>
        {snake.map(([x, y], i) => (
          <div key={i} className={`absolute rounded-sm ${i === 0 ? 'bg-accent-400' : 'bg-accent-500'}`} style={{ left: x * CELL, top: y * CELL, width: CELL - 1, height: CELL - 1 }} />
        ))}
        <div className="absolute rounded-full bg-rose-500" style={{ left: food[0] * CELL + 2, top: food[1] * CELL + 2, width: CELL - 5, height: CELL - 5 }} />
        {over && <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80"><p className="text-white font-bold text-xl">Game Over!</p></div>}
        {!running && !over && <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80"><button onClick={() => setRunning(true)} className="btn-primary"><Play className="h-4 w-4" /> Start</button></div>}
      </div>
      <p className="text-xs text-slate-400">Arrow keys to steer.</p>
    </div>
  );
}

// ============ Memory Match ============
export function MemoryMatch(_: { tool: Tool }) {
  const emojis = ['🍕', '🚀', '🎸', '🌈', '⚽', '🎯', '🦄', '🐙'];
  const [cards, setCards] = useState(() => shuffle(emojis.concat(emojis).map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }))));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const click = (idx: number) => {
    if (flipped.length === 2 || cards[idx].flipped || cards[idx].matched) return;
    const nc = [...cards]; nc[idx].flipped = true; setCards(nc);
    const nf = [...flipped, idx];
    setFlipped(nf);
    if (nf.length === 2) {
      setMoves((m) => m + 1);
      setTimeout(() => {
        setCards((c) => {
          const [a, b] = nf;
          if (c[a].emoji === c[b].emoji) { c[a].matched = true; c[b].matched = true; }
          else { c[a].flipped = false; c[b].flipped = false; }
          if (c.every((card) => card.matched)) setWon(true);
          return [...c];
        });
        setFlipped([]);
      }, 700);
    }
  };

  const reset = () => { setCards(shuffle(emojis.concat(emojis).map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false })))); setFlipped([]); setMoves(0); setWon(false); };

  return (
    <div className="space-y-4 max-w-md mx-auto text-center">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Moves: {moves}</span>
        <button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /> New</button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((c, i) => (
          <button key={c.id} onClick={() => click(i)} className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all ${(c.flipped || c.matched) ? 'bg-white ring-1 ring-brand-200' : 'bg-brand-500'}`}>
            {c.flipped || c.matched ? c.emoji : ''}
          </button>
        ))}
      </div>
      {won && <p className="font-semibold text-accent-600">You won in {moves} moves!</p>}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ============ Flappy Bird ============
export function FlappyBird(_: { tool: Tool }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [running, setRunning] = useState(false);
  const stateRef = useRef({ y: 200, vy: 0, pipes: [] as { x: number; gap: number }[], frame: 0 });

  const flap = useCallback(() => {
    if (over) return;
    if (!running) setRunning(true);
    stateRef.current.vy = -7;
  }, [over, running]);

  useEffect(() => {
    if (!running || over) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = 320, H = 400;
    const id = setInterval(() => {
      const s = stateRef.current;
      s.frame++;
      s.vy += 0.4; s.y += s.vy;
      if (s.frame % 90 === 0) s.pipes.push({ x: W, gap: 80 + Math.random() * 180 });
      s.pipes.forEach((p) => p.x -= 2.5);
      s.pipes = s.pipes.filter((p) => p.x > -50);
      // collision
      if (s.y > H - 20 || s.y < 0) { setOver(true); setRunning(false); }
      for (const p of s.pipes) {
        if (p.x < 70 && p.x > 30 && (s.y < p.gap - 40 || s.y > p.gap + 40)) { setOver(true); setRunning(false); }
        if (p.x === 30) setScore((sc) => sc + 1);
      }
      // draw
      ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(0, H - 20, W, 20);
      for (const p of s.pipes) {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(p.x, 0, 40, p.gap - 40);
        ctx.fillRect(p.x, p.gap + 40, 40, H - p.gap - 40);
      }
      ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(50, s.y, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(55, s.y - 3, 3, 0, Math.PI * 2); ctx.fill();
    }, 30);
    return () => clearInterval(id);
  }, [running, over]);

  const reset = () => { stateRef.current = { y: 200, vy: 0, pipes: [], frame: 0 }; setScore(0); setOver(false); setRunning(false); };

  return (
    <div className="space-y-3 max-w-sm mx-auto text-center">
      <div className="flex items-center justify-between"><span className="font-semibold">Score: {score}</span><button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /></button></div>
      <canvas ref={canvasRef} width={320} height={400} onClick={flap} className="mx-auto rounded-2xl ring-1 ring-slate-200 cursor-pointer max-w-full h-auto" />
      <p className="text-xs text-slate-400">Click or tap to flap.</p>
    </div>
  );
}

// ============ Tetris ============
export function Tetris(_: { tool: Tool }) {
  const COLS = 10, ROWS = 18;
  const [board, setBoard] = useState(() => Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [piece, setPiece] = useState(() => randomPiece());
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [running, setRunning] = useState(false);
  const pieceRef = useRef(piece); pieceRef.current = piece;
  const boardRef = useRef(board); boardRef.current = board;

  const SHAPES: number[][][] = [
    [[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 1, 0], [0, 1, 1]],
  ];

  function randomPiece() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return { shape, x: 3, y: 0 };
  }

  const collides = (b: number[][], p: typeof piece) => {
    for (let r = 0; r < p.shape.length; r++) for (let c = 0; c < p.shape[r].length; c++) {
      if (p.shape[r][c] && (b[p.y + r]?.[p.x + c] !== undefined ? b[p.y + r]?.[p.x + c] : 1)) return true;
    }
    return false;
  };

  const merge = (b: number[][], p: typeof piece) => {
    const nb = b.map((r) => [...r]);
    for (let r = 0; r < p.shape.length; r++) for (let c = 0; c < p.shape[r].length; c++) if (p.shape[r][c]) nb[p.y + r][p.x + c] = 1;
    return nb;
  };

  const drop = () => {
    const p = { ...pieceRef.current, y: pieceRef.current.y + 1 };
    if (!collides(boardRef.current, p)) { setPiece(p); }
    else {
      const nb = merge(boardRef.current, pieceRef.current);
      let cleared = 0;
      for (let r = nb.length - 1; r >= 0; r--) { if (nb[r].every((v) => v)) { nb.splice(r, 1); nb.unshift(Array(COLS).fill(0)); cleared++; r++; } }
      if (cleared) setScore((s) => s + cleared * 100);
      const np = randomPiece();
      if (collides(nb, np)) { setOver(true); setRunning(false); }
      setBoard(nb); setPiece(np);
    }
  };

  const move = (dx: number) => {
    const p = { ...pieceRef.current, x: pieceRef.current.x + dx };
    if (!collides(boardRef.current, p)) setPiece(p);
  };
  const rotate = () => {
    const shape = pieceRef.current.shape[0].map((_, i) => pieceRef.current.shape.map((r) => r[i]).reverse());
    const p = { ...pieceRef.current, shape };
    if (!collides(boardRef.current, p)) setPiece(p);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowUp') rotate();
      if (e.key === 'ArrowDown') drop();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    if (!running || over) return;
    const id = setInterval(drop, 500);
    return () => clearInterval(id);
  }, [running, over]);

  const display = merge(board, piece);
  const reset = () => { setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0))); setPiece(randomPiece()); setScore(0); setOver(false); setRunning(true); };

  return (
    <div className="space-y-3 max-w-sm mx-auto text-center">
      <div className="flex items-center justify-between"><span className="font-semibold">Score: {score}</span><button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /></button></div>
      <div className="grid grid-cols-10 gap-px bg-slate-300 p-1 rounded-xl mx-auto" style={{ width: 'fit-content' }}>
        {display.flat().map((v, i) => (
          <div key={i} className={`w-4 h-4 rounded-sm ${v ? 'bg-brand-500' : 'bg-slate-100'}`} />
        ))}
      </div>
      {!running && !over && <button onClick={() => setRunning(true)} className="btn-primary"><Play className="h-4 w-4" /> Start</button>}
      {over && <p className="font-semibold text-rose-500">Game Over! Score: {score}</p>}
      <div className="flex gap-2 justify-center">
        <button onClick={() => move(-1)} className="btn-secondary px-3">←</button>
        <button onClick={rotate} className="btn-secondary px-3">↻</button>
        <button onClick={drop} className="btn-secondary px-3">↓</button>
        <button onClick={() => move(1)} className="btn-secondary px-3">→</button>
      </div>
    </div>
  );
}

// ============ Minesweeper ============
export function Minesweeper(_: { tool: Tool }) {
  const SIZE = 9, MINES = 10;
  const [board, setBoard] = useState(() => initMS());
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flags, setFlags] = useState(0);

  function initMS(): { mine: boolean; revealed: boolean; flagged: boolean; count: number }[][] {
    const b = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => ({ mine: false, revealed: false, flagged: false, count: 0 })));
    let placed = 0;
    while (placed < MINES) { const r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE); if (!b[r][c].mine) { b[r][c].mine = true; placed++; } }
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (b[r][c].mine) continue;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if (b[r + dr]?.[c + dc]?.mine) n++;
      b[r][c].count = n;
    }
    return b;
  }

  const reveal = (r: number, c: number) => {
    if (over || board[r][c].revealed || board[r][c].flagged) return;
    const nb = board.map((row) => row.map((cell) => ({ ...cell })));
    const flood = (r: number, c: number) => {
      if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || nb[r][c].revealed || nb[r][c].flagged) return;
      nb[r][c].revealed = true;
      if (nb[r][c].count === 0 && !nb[r][c].mine) { for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) flood(r + dr, c + dc); }
    };
    if (nb[r][c].mine) { nb.forEach((row) => row.forEach((cell) => { if (cell.mine) cell.revealed = true; })); setOver(true); }
    else flood(r, c);
    setBoard(nb);
    const safe = nb.flat().filter((c) => !c.mine).every((c) => c.revealed);
    if (safe) setWon(true);
  };

  const flag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (over || board[r][c].revealed) return;
    const nb = board.map((row) => row.map((cell) => ({ ...cell })));
    nb[r][c].flagged = !nb[r][c].flagged;
    setBoard(nb);
    setFlags(nb.flat().filter((c) => c.flagged).length);
  };

  const reset = () => { setBoard(initMS()); setOver(false); setWon(false); setFlags(0); };
  const colors = ['', 'text-blue-600', 'text-accent-600', 'text-rose-500', 'text-purple-600', 'text-orange-600', 'text-cyan-600', 'text-slate-800', 'text-slate-500'];

  return (
    <div className="space-y-3 max-w-md mx-auto text-center">
      <div className="flex items-center justify-between"><span className="font-semibold">💣 {MINES - flags}</span><button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /></button></div>
      <div className="grid gap-px bg-slate-300 p-1 rounded-xl mx-auto" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, width: 'fit-content' }}>
        {board.map((row, r) => row.map((cell, c) => (
          <button key={`${r}-${c}`} onClick={() => reveal(r, c)} onContextMenu={(e) => flag(e, r, c)}
            className={`w-7 h-7 text-sm font-bold rounded-sm flex items-center justify-center ${cell.revealed ? (cell.mine ? 'bg-rose-500 text-white' : 'bg-slate-100 ' + colors[cell.count]) : 'bg-slate-200 hover:bg-slate-300'}`}>
            {cell.revealed ? (cell.mine ? '💣' : cell.count || '') : (cell.flagged ? '🚩' : '')}
          </button>
        )))}
      </div>
      {over && <p className="font-semibold text-rose-500">💥 Boom!</p>}
      {won && <p className="font-semibold text-accent-600">You cleared it!</p>}
      <p className="text-xs text-slate-400">Left-click to reveal, right-click to flag.</p>
    </div>
  );
}

// ============ Sudoku ============
export function Sudoku(_: { tool: Tool }) {
  const [puzzle, setPuzzle] = useState(() => generateSudoku());
  const [board, setBoard] = useState<number[][]>(() => puzzle.map((r) => [...r]));
  const [err, setErr] = useState('');

  function generateSudoku(): number[][] {
    const base = [[1,2,3,4,5,6,7,8,9],[4,5,6,7,8,9,1,2,3],[7,8,9,1,2,3,4,5,6],[2,3,4,5,6,7,8,9,1],[5,6,7,8,9,1,2,3,4],[8,9,1,2,3,4,5,6,7],[3,4,5,6,7,8,9,1,2],[6,7,8,9,1,2,3,4,5],[9,1,2,3,4,5,6,7,8]];
    const rotated = base.map((r, i) => r.map((_, j) => base[(j + i) % 9][Math.floor((i * 3 + j) % 9)]));
    const holes = 40;
    const cells: [number, number][] = [];
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) cells.push([r, c]);
    shuffle(cells).slice(0, holes).forEach(([r, c]) => { rotated[r][c] = 0; });
    return rotated;
  }

  const set = (r: number, c: number, v: number) => {
    if (puzzle[r][c] !== 0) return;
    const nb = board.map((row) => [...row]);
    nb[r][c] = v;
    setBoard(nb);
    setErr('');
  };

  const check = () => {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (!v) { setErr('Grid is not complete.'); return; }
      for (let i = 0; i < 9; i++) { if (i !== c && board[r][i] === v) { setErr(`Duplicate in row ${r + 1}.`); return; } if (i !== r && board[i][c] === v) { setErr(`Duplicate in column ${c + 1}.`); return; } }
    }
    setErr('Solved correctly!');
  };

  const reset = () => { const p = generateSudoku(); setPuzzle(p); setBoard(p.map((r) => [...r])); setErr(''); };

  return (
    <div className="space-y-3 max-w-lg mx-auto">
      <div className="flex justify-end gap-2"><button onClick={check} className="btn-primary">Check</button><button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /> New</button></div>
      <div className="grid grid-cols-9 gap-px bg-slate-300 p-1 rounded-xl mx-auto" style={{ width: 'fit-content' }}>
        {board.map((row, r) => row.map((v, c) => (
          <select key={`${r}-${c}`} value={v} onChange={(e) => set(r, c, +e.target.value || 0)} disabled={puzzle[r][c] !== 0}
            className={`w-8 h-8 text-center text-sm font-bold border-0 rounded-sm ${puzzle[r][c] ? 'bg-slate-200 text-slate-700' : 'bg-white text-brand-700'} ${(r % 3 === 2 && r < 8) ? 'mb-0.5' : ''} ${(c % 3 === 2 && c < 8) ? 'mr-0.5' : ''}`}>
            <option value={0}></option>
            {[1,2,3,4,5,6,7,8,9].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        )))}
      </div>
      {err && <p className={`text-center text-sm font-medium ${err.includes('correctly') ? 'text-accent-600' : 'text-rose-500'}`}>{err}</p>}
    </div>
  );
}

// ============ Hangman ============
export function Hangman(_: { tool: Tool }) {
  const words = ['JAVASCRIPT', 'BROWSER', 'KEYBOARD', 'ELEPHANT', 'RAINBOW', 'MOUNTAIN', 'PIZZA', 'ASTRONAUT', 'BUTTERFLY', 'DRAGON'];
  const [word, setWord] = useState(() => words[Math.floor(Math.random() * words.length)]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(0);
  const maxWrong = 6;
  const won = word.split('').every((c) => guessed.has(c));
  const lost = wrong >= maxWrong;

  const guess = (l: string) => {
    if (guessed.has(l) || won || lost) return;
    const ng = new Set(guessed); ng.add(l); setGuessed(ng);
    if (!word.includes(l)) setWrong((w) => w + 1);
  };

  const reset = () => { setWord(words[Math.floor(Math.random() * words.length)]); setGuessed(new Set()); setWrong(0); };

  return (
    <div className="space-y-5 max-w-md mx-auto text-center">
      <div className="text-6xl min-h-[80px]">{['😀','😐','😟','😦','😧','😨','😵'][wrong]}</div>
      <div className="flex justify-center gap-1">
        {word.split('').map((c, i) => (
          <span key={i} className="w-8 border-b-2 border-slate-400 text-2xl font-bold">{guessed.has(c) || lost ? c : ''}</span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 max-w-xs mx-auto">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => (
          <button key={l} onClick={() => guess(l)} disabled={guessed.has(l) || won || lost}
            className={`w-8 h-8 rounded-lg text-sm font-bold ${guessed.has(l) ? (word.includes(l) ? 'bg-accent-200 text-accent-700' : 'bg-rose-200 text-rose-600') : 'bg-slate-100 hover:bg-brand-100'}`}>
            {l}
          </button>
        ))}
      </div>
      {won && <p className="font-semibold text-accent-600">You won! 🎉</p>}
      {lost && <p className="font-semibold text-rose-500">You lost! Word: {word}</p>}
      <button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /> New word</button>
    </div>
  );
}

// ============ Rock Paper Scissors ============
export function RockPaperScissors(_: { tool: Tool }) {
  const [pScore, setPScore] = useState(0);
  const [cScore, setCScore] = useState(0);
  const [result, setResult] = useState('');
  const [pPick, setPPick] = useState('');
  const [cPick, setCPick] = useState('');

  const play = (pick: 'rock' | 'paper' | 'scissors') => {
    const choices = ['rock', 'paper', 'scissors'] as const;
    const cpu = choices[Math.floor(Math.random() * 3)];
    setPPick(pick); setCPick(cpu);
    if (pick === cpu) setResult('Draw!');
    else if ((pick === 'rock' && cpu === 'scissors') || (pick === 'paper' && cpu === 'rock') || (pick === 'scissors' && cpu === 'paper')) { setResult('You win!'); setPScore((s) => s + 1); }
    else { setResult('CPU wins!'); setCScore((s) => s + 1); }
  };

  const emoji: Record<string, string> = { rock: '✊', paper: '✋', scissors: '✌' };

  return (
    <div className="space-y-6 max-w-sm mx-auto text-center">
      <div className="flex justify-around">
        <div><p className="text-xs text-slate-400">You</p><p className="font-bold text-2xl">{pScore}</p></div>
        <div><p className="text-xs text-slate-400">CPU</p><p className="font-bold text-2xl">{cScore}</p></div>
      </div>
      <div className="flex justify-around text-5xl">
        <span>{pPick ? emoji[pPick] : '❓'}</span>
        <span className="text-slate-300">vs</span>
        <span>{cPick ? emoji[cPick] : '❓'}</span>
      </div>
      {result && <p className="font-semibold text-lg">{result}</p>}
      <div className="flex justify-center gap-3">
        {(['rock', 'paper', 'scissors'] as const).map((c) => (
          <button key={c} onClick={() => play(c)} className="text-4xl p-4 rounded-2xl bg-slate-100 hover:bg-brand-100 transition">{emoji[c]}</button>
        ))}
      </div>
    </div>
  );
}

// ============ Typing Speed Test ============
export function TypingSpeed(_: { tool: Tool }) {
  const sentences = ['The quick brown fox jumps over the lazy dog.', 'Pack my box with five dozen liquor jugs.', 'How vexingly quick daft zebras jump!', 'Sphinx of black quartz, judge my vow.', 'Two driven jocks help fax my big quiz.'];
  const [target, setTarget] = useState(() => sentences[Math.floor(Math.random() * sentences.length)]);
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const onChange = (v: string) => {
    if (!startTime && v) setStartTime(Date.now());
    setTyped(v);
    if (v === target) setDone(true);
  };

  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
  const words = typed.trim().split(/\s+/).filter(Boolean).length;
  const wpm = done && startTime ? Math.round((words / (elapsed / 60))) : 0;
  const accuracy = typed ? Math.round((typed.split('').filter((c, i) => c === target[i]).length / typed.length) * 100) : 100;

  const reset = () => { setTarget(sentences[Math.floor(Math.random() * sentences.length)]); setTyped(''); setStartTime(null); setDone(false); };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <p className="rounded-xl bg-slate-50 p-4 text-lg leading-relaxed">
        {target.split('').map((c, i) => (
          <span key={i} className={i < typed.length ? (typed[i] === c ? 'text-accent-600' : 'text-rose-500 bg-rose-100') : 'text-slate-600'}>{c}</span>
        ))}
      </p>
      <textarea className="input min-h-[80px]" value={typed} onChange={(e) => onChange(e.target.value)} disabled={done} placeholder="Start typing…" />
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-xs text-slate-400">WPM</p><p className="font-bold text-xl">{wpm}</p></div>
        <div className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-xs text-slate-400">Accuracy</p><p className="font-bold text-xl">{accuracy}%</p></div>
        <div className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-xs text-slate-400">Time</p><p className="font-bold text-xl">{elapsed.toFixed(1)}s</p></div>
      </div>
      {done && <p className="text-center font-semibold text-accent-600">Done! {wpm} WPM at {accuracy}% accuracy.</p>}
      <button onClick={reset} className="btn-secondary mx-auto block"><RotateCcw className="h-4 w-4" /> New sentence</button>
    </div>
  );
}

// ============ Pong ============
export function Pong(_: { tool: Tool }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState({ p: 0, c: 0 });
  const [running, setRunning] = useState(false);
  const stateRef = useRef({ by: 100, py: 100, ay: 100, bx: 200, bvx: 3, bvy: 2 });

  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = 400, H = 200;
    const id = setInterval(() => {
      const s = stateRef.current;
      s.bx += s.bvx; s.by += s.bvy;
      if (s.by < 5 || s.by > H - 5) s.bvy *= -1;
      // simple AI
      s.ay += (s.by - s.ay) * 0.06;
      if (s.ay < 20) s.ay = 20; if (s.ay > H - 20) s.ay = H - 20;
      if (s.bx < 20 && Math.abs(s.by - s.py) < 25) s.bvx = Math.abs(s.bvx);
      if (s.bx > W - 20 && Math.abs(s.by - s.ay) < 25) s.bvx = -Math.abs(s.bvx);
      if (s.bx < 0) { setScore((sc) => ({ ...sc, c: sc.c + 1 })); s.bx = W / 2; s.by = H / 2; s.bvx = 3; }
      if (s.bx > W) { setScore((sc) => ({ ...sc, p: sc.p + 1 })); s.bx = W / 2; s.by = H / 2; s.bvx = -3; }
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#3b8eff'; ctx.fillRect(10, s.py - 20, 6, 40);
      ctx.fillStyle = '#10b981'; ctx.fillRect(W - 16, s.ay - 20, 6, 40);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.bx, s.by, 4, 0, Math.PI * 2); ctx.fill();
    }, 16);
    return () => clearInterval(id);
  }, [running]);

  const onMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    stateRef.current.py = ((e.clientY - rect.top) / rect.height) * 200;
  };

  return (
    <div className="space-y-3 max-w-md mx-auto text-center">
      <div className="flex justify-around"><span className="font-bold text-brand-600">You: {score.p}</span><span className="font-bold text-accent-600">CPU: {score.c}</span></div>
      <canvas ref={canvasRef} width={400} height={200} onMouseMove={onMove} className="mx-auto rounded-2xl ring-1 ring-slate-200 max-w-full h-auto" />
      <button onClick={() => setRunning((r) => !r)} className="btn-primary">{running ? 'Pause' : 'Start'}</button>
      <p className="text-xs text-slate-400">Move mouse over canvas to control left paddle.</p>
    </div>
  );
}

// ============ Breakout ============
export function Breakout(_: { tool: Tool }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [lives, setLives] = useState(3);
  const [won, setWon] = useState(false);
  const stateRef = useRef({ px: 160, bx: 200, by: 300, bvx: 2, bvy: -3, bricks: [] as boolean[] });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = 400, H = 350;
    if (stateRef.current.bricks.length === 0) stateRef.current.bricks = Array(40).fill(true);
    if (!running) return;
    const id = setInterval(() => {
      const s = stateRef.current;
      s.bx += s.bvx; s.by += s.bvy;
      if (s.bx < 5 || s.bx > W - 5) s.bvx *= -1;
      if (s.by < 5) s.bvy *= -1;
      if (s.by > H - 15 && s.by < H - 5 && Math.abs(s.bx - s.px) < 35) s.bvy = -Math.abs(s.bvy);
      if (s.by > H) { setLives((l) => l - 1); s.bx = W / 2; s.by = H - 50; s.bvx = 2; s.bvy = -3; }
      for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) {
        const idx = r * 10 + c;
        if (s.bricks[idx] && s.bx > c * 40 && s.bx < c * 40 + 38 && s.by > r * 20 + 10 && s.by < r * 20 + 28) {
          s.bricks[idx] = false; s.bvy *= -1;
        }
      }
      if (s.bricks.every((b) => !b)) { setWon(true); setRunning(false); }
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#3b8eff'; ctx.fillRect(s.px - 35, H - 10, 70, 8);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.bx, s.by, 5, 0, Math.PI * 2); ctx.fill();
      for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) {
        if (s.bricks[r * 10 + c]) { ctx.fillStyle = ['#ef4444','#f59e0b','#10b981','#3b8eff'][r]; ctx.fillRect(c * 40 + 2, r * 20 + 12, 36, 14); }
      }
    }, 16);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => { if (lives <= 0) setRunning(false); }, [lives]);

  const onMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    stateRef.current.px = ((e.clientX - rect.left) / rect.width) * 400;
  };

  const reset = () => { stateRef.current = { px: 160, bx: 200, by: 300, bvx: 2, bvy: -3, bricks: Array(40).fill(true) }; setLives(3); setWon(false); setRunning(true); };

  return (
    <div className="space-y-3 max-w-md mx-auto text-center">
      <div className="flex justify-between"><span className="font-semibold">Lives: {lives}</span><button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /></button></div>
      <canvas ref={canvasRef} width={400} height={350} onMouseMove={onMove} className="mx-auto rounded-2xl ring-1 ring-slate-200 max-w-full h-auto" />
      {!running && !won && lives > 0 && <button onClick={() => setRunning(true)} className="btn-primary"><Play className="h-4 w-4" /> Start</button>}
      {won && <p className="font-semibold text-accent-600">You cleared all bricks!</p>}
      {lives <= 0 && <p className="font-semibold text-rose-500">Game Over!</p>}
    </div>
  );
}

// ============ Connect Four ============
export function ConnectFour(_: { tool: Tool }) {
  const COLS = 7, ROWS = 6;
  const [board, setBoard] = useState<(0 | 1 | 2)[]>(() => Array(COLS * ROWS).fill(0));
  const [turn, setTurn] = useState<1 | 2>(1);
  const [winner, setWinner] = useState(0);

  const drop = (col: number) => {
    if (winner) return;
    for (let r = ROWS - 1; r >= 0; r--) {
      const idx = r * COLS + col;
      if (board[idx] === 0) {
        const nb = [...board]; nb[idx] = turn; setBoard(nb);
        if (checkWinCF(nb, turn, idx)) setWinner(turn);
        else if (nb.every((v) => v !== 0)) setWinner(3);
        else setTurn(turn === 1 ? 2 : 1);
        return;
      }
    }
  };

  const reset = () => { setBoard(Array(COLS * ROWS).fill(0)); setTurn(1); setWinner(0); };

  return (
    <div className="space-y-3 max-w-md mx-auto text-center">
      <p className="font-semibold">{winner === 3 ? "It's a draw!" : winner ? `Player ${winner} wins!` : `Player ${turn}'s turn`}</p>
      <div className="grid gap-1 bg-brand-600 p-2 rounded-2xl mx-auto" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, width: 'fit-content' }}>
        {board.map((v, idx) => {
          const col = idx % COLS;
          return (
            <button key={idx} onClick={() => drop(col)} className="w-9 h-9 rounded-full transition hover:ring-2 hover:ring-white/50"
              style={{ backgroundColor: v === 1 ? '#f43f5e' : v === 2 ? '#fbbf24' : '#1e3a5f' }} />
          );
        })}
      </div>
      <button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /> New game</button>
    </div>
  );
}

function checkWinCF(b: number[], p: number, idx: number): boolean {
  const r = Math.floor(idx / COLS), c = idx % COLS;
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (const [dr, dc] of dirs) {
    let count = 1;
    for (let d = 1; d < 4; d++) { const nr = r + dr * d, nc = c + dc * d; if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr * COLS + nc] === p) count++; else break; }
    for (let d = 1; d < 4; d++) { const nr = r - dr * d, nc = c - dc * d; if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr * COLS + nc] === p) count++; else break; }
    if (count >= 4) return true;
  }
  return false;
}

// ============ Checkers ============
export function Checkers(_: { tool: Tool }) {
  const SIZE = 8;
  type Piece = { player: 1 | 2; king: boolean } | null;
  const [board, setBoard] = useState<Piece[]>(initCheckers());
  const [turn, setTurn] = useState<1 | 2>(1);
  const [sel, setSel] = useState<number | null>(null);
  const [winner, setWinner] = useState(0);

  function initCheckers(): Piece[] {
    const b: Piece[] = Array(64).fill(null);
    for (let i = 0; i < 24; i++) { const r = Math.floor(i / 8), c = i % 8; if ((r + c) % 2 === 1) b[i] = { player: 2, king: false }; }
    for (let i = 40; i < 64; i++) { const r = Math.floor(i / 8), c = i % 8; if ((r + c) % 2 === 1) b[i] = { player: 1, king: false }; }
    return b;
  }

  const move = (to: number) => {
    if (sel === null || winner) return;
    const piece = board[sel]; if (!piece || piece.player !== turn) return;
    const sr = Math.floor(sel / 8), sc = sel % 8, tr = Math.floor(to / 8), tc = to % 8;
    const dr = tr - sr, dc = tc - sc;
    const dir = piece.player === 1 ? -1 : 1;
    // Capture/jump move (2 squares diagonally over opponent)
    if (Math.abs(dr) === 2 && Math.abs(dc) === 2 && !board[to]) {
      const midR = sr + dr / 2, midC = sc + dc / 2;
      const midIdx = midR * 8 + midC;
      const midPiece = board[midIdx];
      if (!midPiece || midPiece.player === piece.player) return;
      const nb = [...board]; nb[to] = { ...piece, king: tr === 0 || tr === 7 || piece.king }; nb[sel] = null; nb[midIdx] = null;
      setBoard(nb); setSel(null); setTurn(turn === 1 ? 2 : 1);
      if (!nb.some((p) => p && p.player === (turn === 1 ? 2 : 1))) setWinner(turn);
      return;
    }
    // Simple diagonal move
    if (Math.abs(dr) !== 1 || Math.abs(dc) !== 1 || board[to]) return;
    if (!piece.king && Math.sign(dr) !== dir) return;
    const nb = [...board]; nb[to] = { ...piece, king: tr === 0 || tr === 7 || piece.king }; nb[sel] = null;
    setBoard(nb); setSel(null); setTurn(turn === 1 ? 2 : 1);
    if (!nb.some((p) => p && p.player === (turn === 1 ? 2 : 1))) setWinner(turn);
  };

  const reset = () => { setBoard(initCheckers()); setTurn(1); setSel(null); setWinner(0); };

  return (
    <div className="space-y-3 max-w-md mx-auto text-center">
      <p className="font-semibold">{winner ? `Player ${winner} wins!` : `Player ${turn}'s turn`}</p>
      <div className="grid grid-cols-8 gap-0 mx-auto rounded-xl overflow-hidden ring-1 ring-slate-300" style={{ width: 'fit-content' }}>
        {board.map((p, idx) => {
          const r = Math.floor(idx / 8), c = idx % 8;
          const dark = (r + c) % 2 === 1;
          return (
            <button key={idx} onClick={() => p && p.player === turn ? setSel(idx) : move(idx)}
              className={`w-9 h-9 flex items-center justify-center ${dark ? 'bg-amber-800' : 'bg-amber-100'} ${sel === idx ? 'ring-2 ring-brand-400' : ''}`}>
              {p && <span className={`w-6 h-6 rounded-full ${p.player === 1 ? 'bg-rose-500' : 'bg-slate-900'} ${p.king ? 'ring-2 ring-yellow-400' : ''}`} />}
            </button>
          );
        })}
      </div>
      <button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /> New game</button>
    </div>
  );
}

// ============ Sliding Puzzle (15) ============
export function SlidingPuzzle(_: { tool: Tool }) {
  const [tiles, setTiles] = useState(() => shufflePuzzle([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]));
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  function shufflePuzzle(arr: number[]): number[] {
    const a = [...arr]; for (let i = 0; i < 200; i++) { const ei = a.indexOf(0); const r = Math.floor(ei / 4), c = ei % 4; const dirs = [[0,1],[0,-1],[1,0],[-1,0]].filter(([dr,dc]) => r+dr>=0&&r+dr<4&&c+dc>=0&&c+dc<4); const [dr,dc] = dirs[Math.floor(Math.random()*dirs.length)]; const ni = (r+dr)*4+(c+dc); [a[ei],a[ni]]=[a[ni],a[ei]]; } return a;
  }

  const click = (idx: number) => {
    if (won) return;
    const ei = tiles.indexOf(0);
    const er = Math.floor(ei / 4), ec = ei % 4, r = Math.floor(idx / 4), c = idx % 4;
    if (Math.abs(er - r) + Math.abs(ec - c) !== 1) return;
    const nt = [...tiles]; [nt[ei], nt[idx]] = [nt[idx], nt[ei]]; setTiles(nt); setMoves((m) => m + 1);
    if (nt.slice(0, 15).every((v, i) => v === i + 1)) setWon(true);
  };

  const reset = () => { setTiles(shufflePuzzle([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0])); setMoves(0); setWon(false); };

  return (
    <div className="space-y-3 max-w-xs mx-auto text-center">
      <div className="flex justify-between"><span className="font-semibold">Moves: {moves}</span><button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /></button></div>
      <div className="grid grid-cols-4 gap-1 bg-slate-300 p-1 rounded-2xl">
        {tiles.map((v, i) => (
          <button key={i} onClick={() => click(i)} className={`aspect-square rounded-xl text-2xl font-bold transition-all ${v ? 'bg-white text-slate-800 hover:bg-brand-50' : 'bg-transparent'}`}>
            {v || ''}
          </button>
        ))}
      </div>
      {won && <p className="font-semibold text-accent-600">Solved in {moves} moves!</p>}
    </div>
  );
}

// ============ Whack-a-Mole ============
export function WhackAMole(_: { tool: Tool }) {
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const moleId = setInterval(() => {
      setMoles(Array(9).fill(false).map(() => Math.random() < 0.35));
    }, 800);
    const timeId = setInterval(() => setTime((t) => { if (t <= 1) { setRunning(false); return 0; } return t - 1; }), 1000);
    return () => { clearInterval(moleId); clearInterval(timeId); };
  }, [running]);

  const whack = (i: number) => { if (moles[i]) { setScore((s) => s + 1); setMoles((m) => m.map((v, j) => j === i ? false : v)); } };
  const reset = () => { setScore(0); setTime(30); setMoles(Array(9).fill(false)); setRunning(true); };

  return (
    <div className="space-y-4 max-w-sm mx-auto text-center">
      <div className="flex justify-between"><span className="font-semibold">Score: {score}</span><span className="font-semibold">Time: {time}s</span></div>
      <div className="grid grid-cols-3 gap-3">
        {moles.map((m, i) => (
          <button key={i} onClick={() => whack(i)} className="aspect-square rounded-2xl bg-amber-100 flex items-center justify-center text-4xl hover:bg-amber-200 transition">
            {m ? '🐹' : ''}
          </button>
        ))}
      </div>
      {!running && <button onClick={reset} className="btn-primary"><Play className="h-4 w-4" /> {time === 30 ? 'Start' : 'Play again'}</button>}
      {time === 0 && <p className="font-semibold text-accent-600">Final score: {score}</p>}
    </div>
  );
}

// ============ Simon Says ============
export function SimonSays(_: { tool: Tool }) {
  const [seq, setSeq] = useState<number[]>([]);
  const [inputIdx, setInputIdx] = useState(0);
  const [showing, setShowing] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(0);
  const colors = ['bg-rose-500', 'bg-accent-500', 'bg-brand-500', 'bg-amber-500'];
  const lit = ['bg-rose-300', 'bg-accent-300', 'bg-brand-300', 'bg-amber-300'];

  const start = () => { setSeq([Math.floor(Math.random() * 4)]); setRound(1); setRunning(true); };

  useEffect(() => {
    if (!running || !seq.length) return;
    setInputIdx(0);
    let i = 0;
    const show = () => {
      if (i >= seq.length) { setShowing(null); return; }
      setShowing(seq[i]);
      setTimeout(() => { setShowing(null); i++; setTimeout(show, 300); }, 500);
    };
    setTimeout(show, 500);
  }, [seq, running]);

  const click = (c: number) => {
    if (showing !== null) return;
    if (c === seq[inputIdx]) {
      setInputIdx((i) => {
        if (i + 1 >= seq.length) { setSeq((s) => [...s, Math.floor(Math.random() * 4)]); setRound((r) => r + 1); return 0; }
        return i + 1;
      });
    } else {
      setRunning(false); setRound(0);
    }
  };

  return (
    <div className="space-y-4 max-w-xs mx-auto text-center">
      <p className="font-semibold">Round: {round}</p>
      <div className="grid grid-cols-2 gap-2">
        {colors.map((c, i) => (
          <button key={i} onClick={() => click(i)} className={`aspect-square rounded-2xl transition-all ${showing === i ? lit[i] : c} ${showing === i ? 'scale-95' : ''}`} />
        ))}
      </div>
      {!running && <button onClick={start} className="btn-primary"><Play className="h-4 w-4" /> {round === 0 ? 'Start' : 'Try again'}</button>}
    </div>
  );
}

// ============ Color Matching ============
export function ColorMatching(_: { tool: Tool }) {
  const [target, setTarget] = useState('#2470f5');
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  const newRound = () => {
    const t = randomHex();
    const opts = [t, randomHex(), randomHex(), randomHex()];
    setTarget(t); setOptions(shuffle(opts)); setRound((r) => r + 1);
  };

  useEffect(() => { newRound(); }, []);

  const pick = (c: string) => { if (c === target) setScore((s) => s + 1); newRound(); };

  return (
    <div className="space-y-5 max-w-sm mx-auto text-center">
      <div className="flex justify-between"><span className="font-semibold">Score: {score}</span><span className="text-slate-400">Round {round}</span></div>
      <div><p className="text-sm text-slate-500 mb-2">Match this color:</p><div className="h-24 rounded-2xl ring-1 ring-slate-200" style={{ backgroundColor: target }} /></div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((c, i) => (
          <button key={i} onClick={() => pick(c)} className="h-20 rounded-2xl ring-1 ring-slate-200 hover:scale-105 transition" style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  );
}

function randomHex(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

// ============ Trivia Quiz ============
const QUESTIONS = [
  { q: 'What is the capital of France?', a: ['London', 'Paris', 'Berlin', 'Madrid'], c: 1 },
  { q: 'Which planet is known as the Red Planet?', a: ['Venus', 'Jupiter', 'Mars', 'Saturn'], c: 2 },
  { q: 'Who wrote "Romeo and Juliet"?', a: ['Dickens', 'Shakespeare', 'Hemingway', 'Twain'], c: 1 },
  { q: 'What is the largest mammal?', a: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippo'], c: 1 },
  { q: 'How many continents are there?', a: ['5', '6', '7', '8'], c: 2 },
  { q: 'What gas do plants absorb?', a: ['Oxygen', 'Nitrogen', 'CO2', 'Helium'], c: 2 },
  { q: 'Which language runs in a web browser?', a: ['Python', 'Java', 'C++', 'JavaScript'], c: 3 },
  { q: 'What year did WWII end?', a: ['1943', '1944', '1945', '1946'], c: 2 },
];

export function TriviaQuiz(_: { tool: Tool }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[idx];

  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.c) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= QUESTIONS.length) setDone(true);
      else { setIdx((n) => n + 1); setPicked(null); }
    }, 1200);
  };

  const reset = () => { setIdx(0); setScore(0); setPicked(null); setDone(false); };

  if (done) return (
    <div className="space-y-4 max-w-md mx-auto text-center">
      <Trophy className="h-12 w-12 text-amber-500 mx-auto" />
      <p className="font-display text-2xl font-bold">You scored {score}/{QUESTIONS.length}!</p>
      <button onClick={reset} className="btn-primary"><RotateCcw className="h-4 w-4" /> Play again</button>
    </div>
  );

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex justify-between text-sm text-slate-500"><span>Question {idx + 1}/{QUESTIONS.length}</span><span>Score: {score}</span></div>
      <p className="font-display text-lg font-semibold text-slate-900">{q.q}</p>
      <div className="space-y-2">
        {q.a.map((a, i) => (
          <button key={i} onClick={() => answer(i)} disabled={picked !== null}
            className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ring-1 ${
              picked === null ? 'bg-white ring-slate-200 hover:bg-brand-50 hover:ring-brand-200' :
              i === q.c ? 'bg-accent-100 text-accent-700 ring-accent-200' :
              picked === i ? 'bg-rose-100 text-rose-700 ring-rose-200' : 'bg-white ring-slate-100 opacity-60'
            }`}>
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ Card Matching (Pairs) ============
export function CardMatching(_: { tool: Tool }) {
  const symbols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const [cards, setCards] = useState(() => shuffle(symbols.concat(symbols).map((s, i) => ({ id: i, s, flipped: false, matched: false }))));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const won = cards.every((c) => c.matched);

  const click = (idx: number) => {
    if (flipped.length === 2 || cards[idx].flipped || cards[idx].matched) return;
    const nc = [...cards]; nc[idx].flipped = true; setCards(nc);
    const nf = [...flipped, idx]; setFlipped(nf);
    if (nf.length === 2) { setMoves((m) => m + 1); setTimeout(() => {
      setCards((c) => { const [a, b] = nf; if (c[a].s === c[b].s) { c[a].matched = true; c[b].matched = true; } else { c[a].flipped = false; c[b].flipped = false; } return [...c]; }); setFlipped([]);
    }, 700); }
  };

  const reset = () => { setCards(shuffle(symbols.concat(symbols).map((s, i) => ({ id: i, s, flipped: false, matched: false })))); setFlipped([]); setMoves(0); };

  return (
    <div className="space-y-4 max-w-sm mx-auto text-center">
      <div className="flex justify-between"><span className="font-semibold">Moves: {moves}</span><button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /></button></div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((c, i) => (
          <button key={c.id} onClick={() => click(i)} className={`aspect-square rounded-xl text-2xl font-bold flex items-center justify-center transition ${(c.flipped || c.matched) ? 'bg-white ring-1 ring-brand-200 text-brand-600' : 'bg-brand-500 text-white'}`}>
            {(c.flipped || c.matched) ? c.s : '?'}
          </button>
        ))}
      </div>
      {won && <p className="font-semibold text-accent-600">Solved in {moves} moves!</p>}
    </div>
  );
}

// ============ Platformer ============
export function Platformer(_: { tool: Tool }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const keysRef = useRef<Set<string>>(new Set());
  const stateRef = useRef({ x: 50, y: 200, vx: 0, vy: 0, onGround: false });
  const platforms = [[0, 280, 400, 20], [100, 220, 80, 10], [250, 180, 80, 10], [50, 140, 80, 10]];

  useEffect(() => {
    const down = (e: KeyboardEvent) => keysRef.current.add(e.key);
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = 400, H = 300, GRAV = 0.5;
    const id = setInterval(() => {
      const s = stateRef.current;
      if (keysRef.current.has('ArrowLeft')) s.vx = -3;
      else if (keysRef.current.has('ArrowRight')) s.vx = 3;
      else s.vx *= 0.8;
      if ((keysRef.current.has('ArrowUp') || keysRef.current.has(' ')) && s.onGround) { s.vy = -8; s.onGround = false; }
      s.vy += GRAV; s.x += s.vx; s.y += s.vy;
      s.onGround = false;
      for (const [px, py, pw, ph] of platforms) {
        if (s.x + 15 > px && s.x < px + pw && s.y + 15 > py && s.y < py + ph && s.vy >= 0) { s.y = py - 15; s.vy = 0; s.onGround = true; }
      }
      if (s.x < 0) s.x = 0; if (s.x > W - 15) s.x = W - 15;
      if (s.y > H) { s.x = 50; s.y = 200; s.vy = 0; }
      ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#22c55e'; for (const [px, py, pw, ph] of platforms) ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = '#f43f5e'; ctx.fillRect(s.x, s.y, 15, 15);
    }, 16);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="space-y-3 max-w-md mx-auto text-center">
      <canvas ref={canvasRef} width={400} height={300} className="mx-auto rounded-2xl ring-1 ring-slate-200 max-w-full h-auto" />
      {!running ? <button onClick={() => setRunning(true)} className="btn-primary"><Play className="h-4 w-4" /> Start</button> : <button onClick={() => setRunning(false)} className="btn-secondary">Pause</button>}
      <p className="text-xs text-slate-400">Arrow keys to move, Up/Space to jump.</p>
    </div>
  );
}

// ============ Brick Breaker (same as Breakout variant) ============
export function BrickBreaker(_: { tool: Tool }) {
  return <Breakout _={null as any} tool={null as any} />;
}

// ============ Aim Trainer ============
export function AimTrainer(_: { tool: Tool }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime((t) => { if (t <= 1) { setRunning(false); return 0; } return t - 1; }), 1000);
    return () => clearInterval(id);
  }, [running]);

  const hit = () => { if (!running) return; setScore((s) => s + 1); setPos({ x: Math.random() * 85 + 5, y: Math.random() * 80 + 5 }); };
  const start = () => { setScore(0); setTime(30); setRunning(true); setPos({ x: 50, y: 50 }); };

  return (
    <div className="space-y-4 max-w-md mx-auto text-center">
      <div className="flex justify-between"><span className="font-semibold">Hits: {score}</span><span className="font-semibold">Time: {time}s</span></div>
      <div className="relative h-72 rounded-2xl bg-slate-100 ring-1 ring-slate-200 overflow-hidden">
        {running && (
          <button onClick={hit} className="absolute h-10 w-10 rounded-full bg-rose-500 hover:scale-110 transition" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} />
        )}
        {!running && <button onClick={start} className="absolute inset-0 flex items-center justify-center text-brand-600 font-semibold">{time === 30 ? 'Click to start' : 'Play again'}</button>}
      </div>
      {!running && time < 30 && <p className="font-semibold text-accent-600">You hit {score} targets!</p>}
    </div>
  );
}

// ============ Reaction Time ============
export function ReactionTime(_: { tool: Tool }) {
  const [state, setState] = useState<'idle' | 'waiting' | 'go' | 'done'>('idle');
  const [time, setTime] = useState(0);
  const startRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  const start = () => {
    setState('waiting');
    timeoutRef.current = window.setTimeout(() => { setState('go'); startRef.current = performance.now(); }, 1500 + Math.random() * 3000);
  };

  const click = () => {
    if (state === 'waiting') { if (timeoutRef.current) clearTimeout(timeoutRef.current); setState('idle'); }
    else if (state === 'go') { setTime(Math.round(performance.now() - startRef.current)); setState('done'); }
    else if (state === 'idle' || state === 'done') start();
  };

  return (
    <div onClick={click}
      className={`h-64 rounded-2xl flex items-center justify-center cursor-pointer transition-colors text-center ${
        state === 'waiting' ? 'bg-rose-500 text-white' : state === 'go' ? 'bg-accent-500 text-white' : state === 'done' ? 'bg-brand-500 text-white' : 'bg-slate-700 text-white'
      }`}>
      {state === 'idle' && <p className="font-display text-xl">Click to start</p>}
      {state === 'waiting' && <p className="font-display text-xl">Wait for green…</p>}
      {state === 'go' && <p className="font-display text-xl">Click now!</p>}
      {state === 'done' && <p className="font-display text-xl">Your time: {time}ms<br/><span className="text-sm opacity-70">Click to try again</span></p>}
    </div>
  );
}
