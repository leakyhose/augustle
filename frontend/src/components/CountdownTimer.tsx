import { useEffect, useState } from 'react';

function msUntilMidnightEST(): number {
  const now = new Date();
  const estStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const tomorrowEST = new Date(estStr + 'T00:00:00');
  tomorrowEST.setDate(tomorrowEST.getDate() + 1);
  const estNowStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const parts: Record<string, string> = {};
  for (const p of estNowStr) if (p.type !== 'literal') parts[p.type] = p.value;
  const estNow = new Date(
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`,
  );
  const diff = tomorrowEST.getTime() - estNow.getTime();
  return Math.max(0, diff);
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface CountdownTimerProps {
  style?: React.CSSProperties;
}

export function CountdownTimer({ style }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(msUntilMidnightEST);

  useEffect(() => {
    const id = setInterval(() => setRemaining(msUntilMidnightEST()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ textAlign: 'center', ...style }}>
      <p
        className="font-cinzel"
        style={{
          color: 'var(--color-muted)',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          margin: '0 0 4px',
        }}
      >
        Next emperor in
      </p>
      <p
        className="font-cinzel"
        style={{
          color: 'var(--color-text)',
          fontSize: '1.3rem',
          fontWeight: 400,
          letterSpacing: '0.12em',
          margin: 0,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatTime(remaining)}
      </p>
    </div>
  );
}
