import { useCallback, useEffect, useRef, useState } from 'react';
import type { Emperor, GameMode } from '@shared/types.ts';
import { fetchEmperors, fetchHint, submitGuess } from './api.ts';
import { isEmperorResponse, buildSyntheticFeedback } from './utils.ts';
import { GameHeader } from './components/GameHeader.tsx';
import { HomePage } from './components/HomePage.tsx';
import { AugustleLogo } from './components/AugustleLogo.tsx';
import { SearchInput, type SearchInputHandle } from './components/SearchInput.tsx';
import { GuessTable, type GuessEntry } from './components/GuessTable.tsx';
import { BustGuessTable } from './components/BustGuessTable.tsx';
import { PixelatedPortrait } from './components/PixelatedPortrait.tsx';
import { WinBanner } from './components/WinBanner.tsx';
import { InfoModal } from './components/InfoModal.tsx';

const HINT_AFTER = 6;
const VALID_MODES = new Set<GameMode>(['classic', 'byzantine', 'all', 'bust']);

const MODE_ACCENT: Record<GameMode, string> = {
  classic:   '#d96a5a',
  byzantine: '#9b7fd4',
  all:       '#C5A84F',
  bust:      '#5b8fb9',
};

const MODE_META: { id: GameMode; label: string }[] = [
  { id: 'classic',   label: 'Classic Emperors' },
  { id: 'byzantine', label: 'Byzantine Emperors' },
  { id: 'all',       label: 'All Emperors' },
  { id: 'bust',      label: 'Bust' },
];

function parsePath(pathname: string): GameMode | null {
  const seg = pathname.replace(/^\//, '') as GameMode;
  return VALID_MODES.has(seg) ? seg : null;
}

interface PersistedState {
  guesses: GuessEntry[];
  won: boolean;
  winEmperor: Emperor | null;
  hint: string | null;
  hintVisible: boolean;
  roundId?: string;
}

function storageKey(mode: GameMode) {
  return `augustle:${mode}`;
}

function saveState(mode: GameMode, state: PersistedState) {
  try {
    localStorage.setItem(storageKey(mode), JSON.stringify(state));
  } catch {
    // No storage
    }
}

function loadState(mode: GameMode): PersistedState | null {
  try {
    const raw = localStorage.getItem(storageKey(mode));
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export default function App() {
  const [gameMode,    setGameMode]    = useState<GameMode | null>(() => parsePath(window.location.pathname));
  const [emperors,    setEmperors]    = useState<Emperor[]>([]);
  const [guesses,     setGuesses]     = useState<GuessEntry[]>([]);
  const [won,         setWon]         = useState(false);
  const [winEmperor,  setWinEmperor]  = useState<Emperor | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [hint,        setHint]        = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [roundId,      setRoundId]      = useState<string | undefined>(undefined);
  const [yesterday,    setYesterday]    = useState<string | null>(null);
  const [portrait,     setPortrait]     = useState<string | null>(null);
  const [winAnimating, setWinAnimating] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const searchRef = useRef<SearchInputHandle>(null);
  const readyToSave = useRef(false);

  const navigate = useCallback((mode: GameMode | null) => {
    history.pushState(null, '', mode ? `/${mode}` : '/');
    setGameMode(mode);
  }, []);

  useEffect(() => {
    const onPop = () => setGameMode(parsePath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    readyToSave.current = false;
    setError(null);
    setEmperors([]);
    setYesterday(null);
    setPortrait(null);
    setWinAnimating(false);

    if (gameMode === null) {
      setGuesses([]);
      setWon(false);
      setWinEmperor(null);
      setHint(null);
      setHintVisible(false);
      return;
    }

    const saved = loadState(gameMode);

    if (saved) {
      setGuesses(saved.guesses);
      setWon(saved.won);
      setWinEmperor(saved.winEmperor);
      setHint(saved.hint);
      setHintVisible(saved.hintVisible);
    } else {
      setGuesses([]);
      setWon(false);
      setWinEmperor(null);
      setHint(null);
      setHintVisible(false);
    }

    setLoading(true);
    fetchEmperors(gameMode)
      .then(({ emperors: pool, roundId, yesterday, portrait }) => {
        setEmperors(pool);
        setYesterday(yesterday);
        if (portrait) setPortrait(portrait);

        if (saved && saved.roundId && saved.roundId !== roundId) {
          setGuesses([]);
          setWon(false);
          setWinEmperor(null);
          setHint(null);
          setHintVisible(false);
        }

        setRoundId(roundId);
        readyToSave.current = true;
      })
      .catch(() => setError('Could not load emperor list. Is the backend running?'))
      .finally(() => setLoading(false));
  }, [gameMode]);

  useEffect(() => {
    if (gameMode === null || !readyToSave.current) return;
    saveState(gameMode, { guesses, won, winEmperor, hint, hintVisible, roundId });
  }, [gameMode, guesses, won, winEmperor, hint, hintVisible, roundId]);

  async function handleGuess(name: string) {
    if (won) return;
    const guessedEmperor = emperors.find(e => e.name === name);
    if (!guessedEmperor) return;

    void (async () => {
      try {
        const response = await submitGuess(guessedEmperor, gameMode!);

        if (isEmperorResponse(response)) {
          const syntheticFeedback = buildSyntheticFeedback(response);
          setGuesses(prev => [...prev, { emperor: response, feedback: syntheticFeedback }]);
          setWon(true);
          setWinEmperor(response);
          setWinAnimating(true);
          setTimeout(() => setWinAnimating(false), isBust ? 700 : 2100);
        } else {
          setGuesses(prev => [...prev, { emperor: guessedEmperor, feedback: response }]);
        }
      } catch {
        setError('Failed to submit guess. Please try again.');
      } finally {
        setTimeout(() => searchRef.current?.focus(), 100);
      }
    })();
  }

  async function handleShowHint() {
    setHintVisible(true);
    if (hint !== null) return;
    try {
      const text = await fetchHint(gameMode!);
      setHint(text);
    } catch {
      setHint('The annals are sealed. The hint could not be retrieved.');
    }
  }

  const guessedNames   = new Set(guesses.map(g => g.emperor.name));
  const hintThreshold  = gameMode === 'bust' ? 4 : HINT_AFTER;
  const showHintButton = !won && guesses.length >= hintThreshold && !hintVisible;
  const isBust = gameMode === 'bust';

  const accent = MODE_ACCENT[gameMode ?? 'all'];

  const hasStarted = guesses.length > 0 || won;

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', ...(gameMode ? { '--color-gold': accent } as React.CSSProperties : {}) }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', background: accent, zIndex: 10, pointerEvents: 'none', transition: 'background 0.6s ease' }} />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'url(/emperor_background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          opacity: gameMode !== null ? 0.12 : 1,
          transition: 'opacity 1.2s ease',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.78) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />


      {gameMode === null ? (
        <HomePage onSelect={navigate} />
      ) : (
        <>
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: hasStarted ? (isBust ? '560px' : '1100px') : '560px',
            margin: '0 auto',
            minHeight: '100vh',
            paddingTop: hasStarted
              ? '24px'
              : isBust
                ? 'max(24px, calc(50vh - 300px))'
                : 'max(24px, calc(50vh - 120px))',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingBottom: '48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: hasStarted ? '16px' : '24px',
            transition: 'padding-top 0.6s ease, max-width 0.8s ease, gap 0.6s ease',
          }}
        >
          <div
            style={{
              maxHeight: hasStarted ? '0px' : '200px',
              opacity: hasStarted ? 0 : 1,
              overflow: 'hidden',
              marginBottom: hasStarted ? '-10px' : '0px',
              transition: hasStarted
                ? 'opacity 0.25s ease, max-height 0.35s ease 0.15s, margin 0.35s ease 0.15s'
                : 'opacity 0.4s ease 0.3s, max-height 0.3s ease, margin 0.3s ease',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <AugustleLogo
              size="large"
              modeName={gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
              onClick={() => navigate(null)}
            />
          </div>

          <div
            style={{
              maxHeight: hasStarted ? '80px' : '0px',
              opacity: hasStarted ? 1 : 0,
              overflow: 'hidden',
              marginTop: hasStarted ? '0px' : '-10px',
              marginBottom: hasStarted ? '0px' : '-10px',
              transition: hasStarted
                ? 'opacity 0.35s ease 0.3s, max-height 0.3s ease 0.25s, margin 0.3s ease 0.25s'
                : 'opacity 0.2s ease, max-height 0.3s ease 0.1s, margin 0.3s ease 0.1s',
              width: '100%',
            }}
          >
            <GameHeader
              onHome={() => navigate(null)}
              modeName={gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
            />
          </div>

          {loading && (
            <p className="font-crimson" style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>
              Loading the annals\u2026
            </p>
          )}
          {error && (
            <p className="font-crimson" style={{ color: 'var(--color-wrong)', fontStyle: 'italic' }}>
              {error}
            </p>
          )}
          {!loading && !error && (
            <>
              {isBust && portrait && !won && (
                <PixelatedPortrait src={portrait} guessCount={guesses.length} won={won} />
              )}

              <div style={{ width: '100%' }}>
                <SearchInput
                  ref={searchRef}
                  emperors={emperors}
                  guessedNames={guessedNames}
                  disabled={won}
                  onSelect={handleGuess}
                />
              </div>

              {showHintButton && (
                <div style={{ textAlign: 'center' }}>
                  <button
                    className="font-cinzel"
                    onClick={() => void handleShowHint()}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--color-gold)',
                      color: 'var(--color-gold)',
                      padding: '8px 24px',
                      fontSize: '0.8rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      borderRadius: '4px',
                    }}
                  >
                    Show Hint
                  </button>
                </div>
              )}

              {hintVisible && !won && (
                <div
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    padding: '16px 20px',
                    maxWidth: '600px',
                    margin: '0 auto',
                    width: '100%',
                  }}
                >
                  <p
                    className="font-cinzel"
                    style={{ margin: '0 0 8px', fontSize: '0.7rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center' }}
                  >
                    Hint
                  </p>
                  <p
                    className="font-crimson"
                    style={{ margin: 0, fontSize: '1.05rem', color: 'var(--color-text)', fontStyle: 'normal', lineHeight: 1.6, textAlign: 'center' }}
                  >
                    {hint ?? 'Loading\u2026'}
                  </p>
                </div>
              )}

              {won && !winAnimating && winEmperor && (
                <>
                  <WinBanner emperor={winEmperor} guessCount={guesses.length} />

                  <div style={{ textAlign: 'center', maxWidth: '560px', width: '100%', margin: '0 auto', padding: '6px 0 16px' }}>
                    <p
                      className="font-cinzel"
                      style={{
                        color: 'var(--color-muted)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        margin: '0 0 10px',
                      }}
                    >
                      Try another mode
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      {MODE_META.filter(m => m.id !== gameMode).map(m => (
                        <button
                          key={m.id}
                          className="font-cinzel"
                          onClick={() => navigate(m.id)}
                          style={{
                            background: 'transparent',
                            border: `1px solid ${MODE_ACCENT[m.id]}`,
                            color: MODE_ACCENT[m.id],
                            padding: '7px 22px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            borderRadius: '3px',
                            transition: 'background 0.2s ease, color 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = MODE_ACCENT[m.id];
                            e.currentTarget.style.color = '#0d0d0d';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = MODE_ACCENT[m.id];
                          }}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {isBust ? <BustGuessTable guesses={guesses} /> : <GuessTable guesses={guesses} />}

              {!won && (
                <button
                  className="font-crimson"
                  onClick={() => setShowInfoModal(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-muted)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    padding: 0,
                    margin: 0,
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-gold)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted)'; }}
                >
                  How to play?
                </button>
              )}

              {yesterday && (
                <p
                  className="font-crimson"
                  style={{
                    color: 'var(--color-muted)',
                    fontSize: '1.05rem',
                    textAlign: 'center',
                    margin: 0,
                    opacity: 0.7,
                  }}
                >
                  Yesterday's Emperor was <span style={{ color: accent }}>{yesterday}</span>
                </p>
              )}
            </>
          )}
        </div>

        {showInfoModal && gameMode && (
          <InfoModal mode={gameMode} onClose={() => setShowInfoModal(false)} />
        )}
        </>
      )}
    </div>
  );
}
