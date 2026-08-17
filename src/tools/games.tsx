import { useState, useEffect } from 'react';
import { Trophy, RotateCcw } from 'lucide-react';
import type { Tool } from '../catalog';

export function TicTacToe(_: { tool: Tool }) {
  const [board, setBoard] = useState<(null | 'X' | 'O')[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const winner = checkWin(board);
  const full = board.every((c) => c);

  const play = (i: number) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = turn;
    setBoard(next);
    setTurn(turn === 'X' ? 'O' : 'X');
  };

  const reset = () => { setBoard(Array(9).fill(null)); setTurn('X'); };

  return (
    <div className="space-y-5 text-center max-w-sm mx-auto">
      <p className="text-sm text-slate-600">
        {winner ? <span className="inline-flex items-center gap-1.5 font-semibold text-accent-600"><Trophy className="h-4 w-4" /> {winner} wins!</span> : full ? "It's a draw!" : <>Turn: <span className="font-semibold text-slate-900">{turn}</span></>}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            className="aspect-square rounded-2xl bg-slate-50 ring-1 ring-slate-200 text-4xl font-bold transition hover:bg-brand-50 hover:ring-brand-200"
          >
            <span className={cell === 'X' ? 'text-brand-600' : 'text-rose-500'}>{cell}</span>
          </button>
        ))}
      </div>
      <button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /> New game</button>
    </div>
  );
}

function checkWin(b: (null | 'X' | 'O')[]): null | 'X' | 'O' {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a, c, d] of lines) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return null;
}

export function NumberGuess(_: { tool: Tool }) {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [msg, setMsg] = useState('I picked a number between 1 and 100. Can you guess it?');
  const [tries, setTries] = useState(0);
  const [history, setHistory] = useState<{ n: number; res: string }[]>([]);
  const [won, setWon] = useState(false);

  const submit = () => {
    const n = parseInt(guess, 10);
    if (isNaN(n)) return;
    const t = tries + 1;
    setTries(t);
    let res: string;
    if (n === target) { res = 'Correct!'; setWon(true); setMsg(`You got it in ${t} tries!`); }
    else if (n < target) { res = 'Too low'; setMsg(`${n} is too low — go higher!`); }
    else { res = 'Too high'; setMsg(`${n} is too high — go lower!`); }
    setHistory((h) => [{ n, res }, ...h]);
    setGuess('');
  };

  const reset = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setTries(0); setHistory([]); setMsg('I picked a new number between 1 and 100.'); setWon(false); setGuess('');
  };

  return (
    <div className="space-y-5 max-w-md mx-auto text-center">
      <p className="text-slate-700 min-h-[3rem]">{msg}</p>
      <div className="flex gap-2 justify-center">
        <input
          type="number"
          className="input max-w-[120px] text-center text-lg font-semibold"
          value={guess}
          disabled={won}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="?"
        />
        <button onClick={submit} disabled={won || !guess} className="btn-primary">Guess</button>
        <button onClick={reset} className="btn-secondary"><RotateCcw className="h-4 w-4" /></button>
      </div>
      <p className="text-xs text-slate-400">Tries: {tries}</p>
      {history.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {history.map((h, i) => (
            <span key={i} className={`badge ${h.res === 'Correct!' ? 'bg-accent-100 text-accent-700' : h.res === 'Too low' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'}`}>
              {h.n} — {h.res}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
