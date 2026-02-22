import type { GameMode } from '@shared/types.ts';
import { CountdownTimer } from './CountdownTimer.tsx';

interface InfoModalProps {
  mode: GameMode;
  onClose: () => void;
}

const SECTION_STYLE: React.CSSProperties = {
  marginBottom: '20px',
};

const MODAL_ACCENT = '#C5A84F';

const SECTION_TITLE: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: MODAL_ACCENT,
  margin: '0 0 8px',
};

const BODY_TEXT: React.CSSProperties = {
  margin: 0,
  fontSize: '0.98rem',
  color: 'var(--color-text)',
  lineHeight: 1.65,
};

const GREEN  = '#5a9c6e';
const YELLOW = '#b89830';
const RED    = '#c44040';

function ColorWord({ color, children }: { color: string; children: React.ReactNode }) {
  return <span style={{ color, fontWeight: 700 }}>{children}</span>;
}

export function InfoModal({ mode, onClose }: InfoModalProps) {
  const isBust = mode === 'bust';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '28px 24px',
          position: 'relative',
          scrollbarWidth: 'none',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '14px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-muted)',
            fontSize: '1.3rem',
            cursor: 'pointer',
            padding: '4px 8px',
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ✕
        </button>

        <h2
          className="font-cinzel"
          style={{
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: MODAL_ACCENT,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: '0 0 20px',
          }}
        >
          How to Play
        </h2>

        <div style={{ ...SECTION_STYLE, textAlign: 'center' }}>
          <CountdownTimer />
        </div>

        <div style={SECTION_STYLE}>
          <p className="font-cinzel" style={SECTION_TITLE}>About</p>
          {isBust ? (
            <p className="font-crimson" style={BODY_TEXT}>
              A pixelated portrait of a Roman emperor is shown. With each guess, the image becomes
              clearer. Identify the emperor before you run out of tries.
            </p>
          ) : (
            <p className="font-crimson" style={BODY_TEXT}>
              Each day a new Roman emperor is chosen. Guess the emperor using the clues given after
              each attempt. The goal is to find the correct emperor in as few guesses as possible.
            </p>
          )}
        </div>

        <div style={SECTION_STYLE}>
          <p className="font-cinzel" style={SECTION_TITLE}>Colours</p>
          <p className="font-crimson" style={BODY_TEXT}>
            <ColorWord color={GREEN}>Green</ColorWord> means your guess matches the answer
            exactly.
          </p>
          {!isBust && (
            <>
              <p className="font-crimson" style={{ ...BODY_TEXT, marginTop: '4px' }}>
                <ColorWord color={YELLOW}>Yellow</ColorWord> means your guess is close. For
                example, a nearby region or a similar time period.
              </p>
              <p className="font-crimson" style={{ ...BODY_TEXT, marginTop: '4px' }}>
                <ColorWord color={RED}>Red</ColorWord> means your guess does not match at all.
              </p>
            </>
          )}
          {isBust && (
            <p className="font-crimson" style={{ ...BODY_TEXT, marginTop: '4px' }}>
              <ColorWord color={RED}>Red</ColorWord> means your guess is wrong.
            </p>
          )}
        </div>

        {!isBust && (
          <div style={SECTION_STYLE}>
            <p className="font-cinzel" style={SECTION_TITLE}>Arrows</p>
            <p className="font-crimson" style={BODY_TEXT}>
              An <span style={{ fontWeight: 700 }}>{'\u2191'}</span> arrow means the correct answer is
              higher or later than what you guessed.
            </p>
            <p className="font-crimson" style={{ ...BODY_TEXT, marginTop: '4px' }}>
              A <span style={{ fontWeight: 700 }}>{'\u2193'}</span> arrow means the correct answer is
              lower or earlier than what you guessed.
            </p>
          </div>
        )}

        {!isBust && (
          <div style={SECTION_STYLE}>
            <p className="font-cinzel" style={SECTION_TITLE}>Properties</p>
            <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'disc' }}>
              <li className="font-crimson" style={{ ...BODY_TEXT, marginBottom: '4px' }}>
                <strong>Dynasty/Era</strong> &ndash; The dynasty or political era the emperor
                belonged to. Arrows show whether the answer is earlier or later in the timeline.
              </li>
              <li className="font-crimson" style={{ ...BODY_TEXT, marginBottom: '4px' }}>
                <strong>Birthplace</strong> &ndash; The region or province where the emperor was
                born. Yellow means a nearby region.
              </li>
              <li className="font-crimson" style={{ ...BODY_TEXT, marginBottom: '4px' }}>
                <strong>Religion</strong> &ndash; The emperor's religious affiliation. Yellow means
                a related faith.
              </li>
              <li className="font-crimson" style={{ ...BODY_TEXT, marginBottom: '4px' }}>
                <strong>Start</strong> &ndash; The year the emperor's reign began. Arrows point
                toward the correct year. Yellow means within 25 years.
              </li>
              <li className="font-crimson" style={{ ...BODY_TEXT, marginBottom: '4px' }}>
                <strong>Length</strong> &ndash; How long the emperor's reign lasted. Arrows point
                toward the correct length. Yellow means within 3 years.
              </li>
              <li className="font-crimson" style={{ ...BODY_TEXT, marginBottom: '4px' }}>
                <strong>Succession</strong> &ndash; How the emperor came to power (e.g. dynastic
                heir, usurper, adopted heir).
              </li>
              <li className="font-crimson" style={{ ...BODY_TEXT }}>
                <strong>Fate</strong> &ndash; How the emperor's reign ended (e.g. natural causes,
                murdered, executed).
              </li>
            </ul>
          </div>
        )}

        <div style={{ ...SECTION_STYLE, marginBottom: 0 }}>
          <p className="font-cinzel" style={SECTION_TITLE}>Hint</p>
          <p className="font-crimson" style={BODY_TEXT}>
            After {isBust ? '4' : '6'} incorrect guesses, a hint button appears. It gives a
            short clue about the emperor to help narrow your search.
          </p>
        </div>
      </div>
    </div>
  );
}
