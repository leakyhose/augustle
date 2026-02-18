import { useState } from 'react';
import type { Emperor, Feedback } from '@shared/types.ts';
import type { CardState } from '../utils.ts';
import { getCardState } from '../utils.ts';
import { FlipCard } from './FlipCard.tsx';
import { COLUMNS } from './columns.ts';

interface GuessRowProps {
  emperor: Emperor;
  feedback: Feedback;
  animate: boolean;
}

function downsizePortrait(url: string, px = 80): string {
  return url.replace(/\/\d+px-/, `/${px}px-`);
}

function Portrait({ emperor }: { emperor: Emperor }) {
  const [imgError,  setImgError]  = useState(false);
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

export function GuessRow({ emperor, feedback, animate }: GuessRowProps) {
  const nameCorrect = typeof feedback.name === 'object' && feedback.name !== null;
  const nameClose = feedback.name === 'close-name';
  const nameState: CardState = {
    color: nameCorrect ? 'correct' : nameClose ? 'close' : 'wrong',
    text: emperor.name,
  };

  return (
    <div style={{ display: 'flex', gap: '6px', width: '100%', alignItems: 'stretch' }}>
      <Portrait emperor={emperor} />

      <div style={{ flex: 1.6, minWidth: 0 }}>
        <FlipCard state={nameState} colIndex={0} animate={animate} />
      </div>

      {COLUMNS.map((col, idx) => {
        const feedbackVal = feedback[col.field];
        const state = getCardState(col.field, feedbackVal, emperor);
        return (
          <div key={col.field} style={{ flex: col.flex, minWidth: 0 }}>
            <FlipCard state={state} colIndex={idx + 1} animate={animate} />
          </div>
        );
      })}
    </div>
  );
}
