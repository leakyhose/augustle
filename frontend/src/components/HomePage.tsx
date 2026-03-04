import { useState } from 'react';
import type { GameMode } from '@shared/types.ts';
import { AugustleLogo } from './AugustleLogo.tsx';
import { CountdownTimer } from './CountdownTimer.tsx';

interface HomePageProps {
  onSelect: (mode: GameMode) => void;
}

const GAME_MODES: {
  id: GameMode;
  label: string;
  description: string;
  icon?: string;
  titleSpacing?: string;
  colors: {
    bg: string;
    border: string;
    hover: string;
    hoverGlow: string;
    hoverOutline: string;
    text: string;
    subtext: string;
    corner: string;
    rule: string;
    divider: string;
  };
}[] = [
  {
    id: 'classic',
    label: 'Classic',
    description: 'Emperors until the Fall of Rome',
    icon: '/classic_icon.png',
    colors: {
      bg: '#c86050',
      border: '#6e2016',
      hover: '#e08878',
      hoverGlow: 'rgba(224,136,120,0.42)',
      hoverOutline: 'rgba(224,136,120,0.25)',
      text: '#160806',
      subtext: '#2e100a',
      corner: 'rgba(22,8,6,0.45)',
      rule: 'rgba(22,8,6,0.3)',
      divider: 'rgba(22,8,6,0.35)',
    },
  },
  {
    id: 'byzantine',
    label: 'Byzantine',
    description: 'Emperors of Constantinople',
    icon: '/byzantine_icon.png',
    titleSpacing: '0.13em',
    colors: {
      bg: '#8a74b8',
      border: '#6a5390',
      hover: '#b89de0',
      hoverGlow: 'rgba(184,157,224,0.42)',
      hoverOutline: 'rgba(184,157,224,0.25)',
      text: '#0e0814',
      subtext: '#2a1a3a',
      corner: 'rgba(14,8,20,0.45)',
      rule: 'rgba(14,8,20,0.3)',
      divider: 'rgba(14,8,20,0.35)',
    },
  },
  {
    id: 'all',
    label: 'Complete',
    description: 'Augustus to Constantine XI',
    icon: '/complete_icon.png',
    colors: {
      bg: '#b89e76',
      border: '#8b7355',
      hover: '#c5a84f',
      hoverGlow: 'rgba(197,168,79,0.42)',
      hoverOutline: 'rgba(197,168,79,0.25)',
      text: '#1a1208',
      subtext: '#3a2a18',
      corner: 'rgba(26,18,8,0.45)',
      rule: 'rgba(26,18,8,0.3)',
      divider: 'rgba(26,18,8,0.35)',
    },
  },
  {
    id: 'bust',
    label: 'Bust',
    description: 'Identify the Emperor',
    icon: '/bust_icon.png',
    colors: {
      bg: '#5b8fb9',
      border: '#3a6a8a',
      hover: '#7ab0d4',
      hoverGlow: 'rgba(122,176,212,0.42)',
      hoverOutline: 'rgba(122,176,212,0.25)',
      text: '#081420',
      subtext: '#1a3048',
      corner: 'rgba(8,20,32,0.45)',
      rule: 'rgba(8,20,32,0.3)',
      divider: 'rgba(8,20,32,0.35)',
    },
  },
];

function ModeCard({ id, label, description, icon, titleSpacing, colors, onSelect }: {
  id: GameMode;
  label: string;
  description: string;
  icon?: string;
  titleSpacing?: string;
  colors: typeof GAME_MODES[0]['colors'];
  onSelect: (mode: GameMode) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(id)}
      onKeyDown={e => e.key === 'Enter' && onSelect(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: '3px',
        cursor: 'pointer',
        filter: hovered ? 'brightness(1.12)' : 'brightness(1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'filter 0.2s ease, transform 0.2s ease',
        width: '420px',
        userSelect: 'none',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
      }}
    >
      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(corner => (
        <span
          key={corner}
          style={{
            position: 'absolute',
            width: 10,
            height: 10,
            top:    corner.startsWith('top')    ? 7 : undefined,
            bottom: corner.startsWith('bottom') ? 7 : undefined,
            left:   corner.endsWith('left')     ? 7 : undefined,
            right:  corner.endsWith('right')    ? 7 : undefined,
            borderTop:    corner.startsWith('top')    ? `1.5px solid ${colors.corner}` : undefined,
            borderBottom: corner.startsWith('bottom') ? `1.5px solid ${colors.corner}` : undefined,
            borderLeft:   corner.endsWith('left')     ? `1.5px solid ${colors.corner}` : undefined,
            borderRight:  corner.endsWith('right')    ? `1.5px solid ${colors.corner}` : undefined,
          }}
        />
      ))}

      <div style={{ width: '64px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon
          ? <img src={icon} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain', opacity: 0.7, mixBlendMode: 'multiply', pointerEvents: 'none', transform: 'scaleX(-1)' }} />
          : <span style={{ display: 'block', width: '1px', height: '40px', background: colors.rule }} />
        }
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <p
          className="font-cinzel"
          style={{
            margin: 0,
            fontSize: '1.5rem',
            letterSpacing: titleSpacing ?? '0.2em',
            paddingLeft: titleSpacing ?? '0.2em',
            textTransform: 'uppercase',
            fontWeight: 900,
          }}
        >
          {label}
        </p>
        <p
          className="font-crimson"
          style={{
            margin: 0,
            fontSize: '0.95rem',
            color: colors.subtext,
            letterSpacing: '0.04em',
          }}
        >
          {description}
        </p>
      </div>

      <div style={{ width: '64px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon
          ? <img src={icon} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain', opacity: 0.7, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
          : <span style={{ display: 'block', width: '1px', height: '40px', background: colors.rule }} />
        }
      </div>
    </div>
  );
}

export function HomePage({ onSelect }: HomePageProps) {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.6rem',
      }}
    >
      <AugustleLogo size="large" modeName="Guess the Roman Emperor" style={{ marginBottom: '1.8rem' }} />

      {GAME_MODES.map(({ id, label, description, icon, titleSpacing, colors }) => (
        <ModeCard key={id} id={id} label={label} description={description} icon={icon} titleSpacing={titleSpacing} colors={colors} onSelect={onSelect} />
      ))}

      <CountdownTimer style={{ marginTop: '2rem' }} />
    </div>
  );
}
