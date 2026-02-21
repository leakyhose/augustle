import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import type { Emperor } from '@shared/types.ts';
import { CountdownTimer } from './CountdownTimer.tsx';

interface WinBannerProps {
  emperor: Emperor;
  guessCount: number;
}

const CONFETTI_COLORS = ['#5a9c6e', '#4a7c59', '#C5A84F', '#e8dcc8', '#9b7fd4'];

export function WinBanner({ emperor, guessCount }: WinBannerProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const shared = { particleCount: 120, spread: 80, startVelocity: 55, colors: CONFETTI_COLORS, ticks: 250, gravity: 0.8 };
    confetti({ ...shared, angle: 60,  origin: { x: 0,   y: 0.75 } });
    confetti({ ...shared, angle: 120, origin: { x: 1,   y: 0.75 } });
  }, []);

  return (
    <div
      style={{
        background: 'linear-gradient(to bottom, #1e3828 0%, var(--color-surface) 80%)',
        borderRadius: '8px',
        border: '2px solid #5a9c6e',
        padding: '32px 28px',
        maxWidth: '560px',
        width: '100%',
        margin: '14px auto 4px',
        textAlign: 'center',
      }}
    >
      <p
        className="font-cinzel"
        style={{ color: 'var(--color-text)', fontSize: '1.1rem', letterSpacing: '0.18em', margin: '0 0 12px', textTransform: 'uppercase' }}
      >
        Correct in <span style={{ color: '#5a9c6e' }}>{guessCount}</span> {guessCount === 1 ? 'guess' : 'guesses'}
      </p>

      <h2
        className="font-cinzel"
        style={{ color: 'var(--color-gold)', fontSize: '2.6rem', fontWeight: 700, margin: '0 0 24px', letterSpacing: '0.1em', textShadow: '0 0 24px rgba(197,168,79,0.35)' }}
      >
        {emperor.name}
      </h2>

      {!imgError && emperor.portrait && (
        <img
          src={emperor.portrait}
          alt={emperor.name}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            maxWidth: '320px',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '6px',
            margin: '0 auto 24px',
            display: 'block',
          }}
        />
      )}

      {emperor.description && (
        <p
          className="font-crimson"
          style={{
            margin: '0 0 24px',
            fontSize: '1.1rem',
            color: 'var(--color-text)',
            fontStyle: 'normal',
            lineHeight: 1.7,
            textAlign: 'center',
          }}
        >
          {emperor.description}
        </p>
      )}

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
        <CountdownTimer />
      </div>
    </div>
  );
}
