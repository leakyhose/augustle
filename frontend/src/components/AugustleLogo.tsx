import { useState } from 'react';

interface AugustleLogoProps {
  size?: 'large' | 'small';
  modeName?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function AugustleLogo({ size = 'small', modeName, onClick, style }: AugustleLogoProps) {
  const [hovered, setHovered] = useState(false);
  const isLarge = size === 'large';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        gap: isLarge ? '20px' : '6px',
        ...style,
      }}
    >
      <h1
        className="font-imfell"
        style={{
          margin: 0,
          fontSize: isLarge ? 'clamp(2.8rem, 7vw, 4.5rem)' : 'clamp(1.4rem, 3vw, 2rem)',
          color: hovered ? 'var(--color-gold)' : 'var(--color-text)',
          fontWeight: 400,
          letterSpacing: isLarge ? '0.02em' : '0.04em',
          lineHeight: 1.1,
          display: 'flex',
          alignItems: 'center',
          gap: isLarge ? '0.9rem' : '0.55rem',
          transition: 'color 0.25s ease',
        }}
      >
        <span style={{ color: 'var(--color-gold)', fontSize: isLarge ? '0.45em' : '0.65em' }}>──</span>
        Augustle
        <span style={{ color: 'var(--color-gold)', fontSize: isLarge ? '0.45em' : '0.65em' }}>──</span>
      </h1>

      {modeName && (
        <p
          className="font-cinzel"
          style={{
            margin: 0,
            fontSize: isLarge ? '1.02rem' : '0.82rem',
            fontWeight: isLarge ? 500 : 400,
            letterSpacing: '0.2em',
            paddingLeft: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
          }}
        >
          {modeName}
        </p>
      )}
    </div>
  );
}
