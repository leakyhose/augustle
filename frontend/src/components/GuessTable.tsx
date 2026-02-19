import type { Emperor, Feedback } from '@shared/types.ts';
import { GuessRow } from './GuessRow.tsx';
import { COLUMNS } from './columns.ts';

export interface GuessEntry {
  emperor: Emperor;
  feedback: Feedback;
}

interface GuessTableProps {
  guesses: GuessEntry[];
}

const PORTRAIT_WIDTH = 72;

export function GuessTable({ guesses }: GuessTableProps) {
  if (guesses.length === 0) return null;

  const reversed = [...guesses].reverse();

  const headerLabels = ['Name', ...COLUMNS.map(c => c.label)];
  const headerFlexes = [1.6,    ...COLUMNS.map(c => c.flex)];

  return (
    <div style={{ width: '100%', maxWidth: '1060px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', paddingBottom: '4px' }}>
        <div style={{ width: `${PORTRAIT_WIDTH}px`, flexShrink: 0 }} />

        {headerLabels.map((label, i) => (
          <div
            key={label}
            className="font-cinzel"
            style={{
              flex: headerFlexes[i],
              minWidth: 0,
              textAlign: 'center',
              fontSize: '0.82rem',
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              paddingBottom: '2px',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {reversed.map((entry, displayIdx) => (
        <GuessRow
          key={entry.emperor.name}
          emperor={entry.emperor}
          feedback={entry.feedback}
          animate={displayIdx === 0}
        />
      ))}
    </div>
  );
}
