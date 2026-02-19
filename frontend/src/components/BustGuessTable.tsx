import { useState } from 'react';
import type { Emperor, Feedback } from '@shared/types.ts';
import type { GuessEntry } from './GuessTable.tsx';
import { FlipCard } from './FlipCard.tsx';
import type { CardState } from '../utils.ts';

interface BustGuessTableProps {
  guesses: GuessEntry[];
}

function downsizePortrait(url: string, px = 80): string {
  return url.replace(/\/\d+px-/, `/${px}px-`);
}

function BustPortrait({ emperor }: { emperor: Emperor }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const src = emperor.portrait ? downsizePortrait(emperor.portrait, 80) : null;

  return (
    <div
      style={{
        width: '72px',
        height: '72px',
        flexShrink: 0,
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <span
        className="font-cinzel"
        style={{
          fontSize: '0.6rem',
          color: 'var(--color-muted)',
          textAlign: 'center',
          padding: '4px',
          position: 'absolute',
          opacity: imgLoaded ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        {emperor.name.charAt(0)}
      </span>

      {!imgError && src && (
        <img
          src={src}
          alt={emperor.name}
          width={72}
          height={72}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            inset: 0,
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      )}
    </div>
  );
}

function BustGuessRow({ emperor, feedback, animate }: { emperor: Emperor; feedback: Feedback; animate: boolean }) {
  const isCorrect = typeof feedback.name === 'object' && feedback.name !== null;
  const nameState: CardState = {
    color: isCorrect ? 'correct' : 'wrong',
    text: emperor.name,
  };

  return (
    <div style={{ display: 'flex', gap: '6px', width: '100%', alignItems: 'stretch' }}>
      <BustPortrait emperor={emperor} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <FlipCard state={nameState} colIndex={0} animate={animate} />
      </div>
    </div>
  );
}

export function BustGuessTable({ guesses }: BustGuessTableProps) {
  if (guesses.length === 0) return null;

  const reversed = [...guesses].reverse();

  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {reversed.map((entry, displayIdx) => (
        <BustGuessRow
          key={entry.emperor.name}
          emperor={entry.emperor}
          feedback={entry.feedback}
          animate={displayIdx === 0}
        />
      ))}
    </div>
  );
}
