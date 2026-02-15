import type { Emperor, Feedback, GameMode } from '@shared/types.ts';

const BASE = 'http://localhost:3000';

export async function fetchEmperors(mode: GameMode): Promise<{ emperors: Emperor[]; roundId: string; yesterday: string; portrait?: string }> {
  const res = await fetch(`${BASE}/emperors?mode=${mode}`);
  if (!res.ok) throw new Error('Failed to fetch emperors');
  return res.json() as Promise<{ emperors: Emperor[]; roundId: string; yesterday: string; portrait?: string }>;
}

export async function fetchHint(mode: GameMode): Promise<string> {
  const res = await fetch(`${BASE}/emperors/hint?mode=${mode}`);
  if (!res.ok) throw new Error('Failed to fetch hint');
  const data = await res.json() as { hint: string };
  return data.hint;
}

export async function submitGuess(emperor: Emperor, mode: GameMode): Promise<Emperor | Feedback> {
  const res = await fetch(`${BASE}/emperors/guess?mode=${mode}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emperor),
  });
  if (!res.ok) throw new Error('Guess request failed');
  return res.json() as Promise<Emperor | Feedback>;
}
