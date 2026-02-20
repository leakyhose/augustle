import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { Emperor } from '@shared/types.ts';

export interface SearchInputHandle {
  focus: () => void;
}

interface SearchInputProps {
  emperors: Emperor[];
  guessedNames: Set<string>;
  disabled: boolean;
  onSelect: (name: string) => void;
}

export const SearchInput = forwardRef<SearchInputHandle, SearchInputProps>(
  function SearchInput({ emperors, guessedNames, disabled, onSelect }, ref) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  const filtered = query.length > 0
    ? emperors.filter(
        e =>
          e.name.toLowerCase().includes(query.toLowerCase()) &&
          !guessedNames.has(e.name),
      )
    : [];

  function confirm(name: string) {
    setQuery('');
    setOpen(false);
    setHighlighted(0);
    onSelect(name);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(highlighted + 1, filtered.length - 1);
      setHighlighted(next);
      scrollIntoView(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(highlighted - 1, 0);
      setHighlighted(prev);
      scrollIntoView(prev);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlighted]) confirm(filtered[highlighted].name);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  function scrollIntoView(idx: number) {
    if (!listRef.current) return;
    const item = listRef.current.children[idx] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        disabled={disabled}
        placeholder={disabled ? 'You have already guessed correctly!' : 'Type any emperor to begin\u2026'}
        onChange={e => {
          setQuery(e.target.value);
          setHighlighted(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
        className="font-crimson"
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          color: 'var(--color-text)',
          fontSize: '1.1rem',
          outline: 'none',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />

      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            maxHeight: '240px',
            overflowY: 'auto',
            zIndex: 100,
          }}
        >
          {filtered.map((emperor, idx) => (
            <li
              key={emperor.name}
              onMouseDown={() => confirm(emperor.name)}
              onMouseEnter={() => setHighlighted(idx)}
              className="font-crimson"
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '1rem',
                color: 'var(--color-text)',
                background: idx === highlighted ? 'var(--color-card)' : 'transparent',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {emperor.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
