import { useEffect, useState } from 'react';
import type { CardState } from '../utils.ts';

interface FlipCardProps {
  state: CardState;
  colIndex: number;
  animate: boolean;
}

export function FlipCard({ state, colIndex, animate }: FlipCardProps) {
  const [phase, setPhase] = useState<'front' | 'flipping' | 'flipped'>(
    animate ? 'front' : 'flipped',
  );

  useEffect(() => {
    if (!animate) return;

    let t2: ReturnType<typeof setTimeout>;
    const t1 = setTimeout(() => {
      setPhase('flipping');
      t2 = setTimeout(() => setPhase('flipped'), 600);
    }, colIndex * 200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const innerClass = [
    'card-inner',
    phase === 'flipping' ? 'flipping' : '',
    phase === 'flipped'  ? 'flipped'  : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="card-scene" style={{ height: '80px' }}>
      <div className={innerClass}>
        <div className="card-front" />

        <div className={`card-back ${state.color}`}>
          <span
            className="font-crimson"
            style={{ color: 'var(--color-text)', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.2, wordBreak: 'break-word', textAlign: 'center' }}
          >
            {state.text}
            {state.arrow && (
              <span style={{ marginLeft: '4px', fontWeight: 700 }}>{state.arrow}</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
